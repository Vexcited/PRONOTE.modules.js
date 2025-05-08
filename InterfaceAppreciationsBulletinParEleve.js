const { InterfacePage } = require("InterfacePage.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { InterfacePiedBulletin } = require("InterfacePiedBulletin.js");
const { ObjetListe } = require("ObjetListe.js");
const {
	ObjetRequeteAppreciationsBulletinParEleve,
} = require("ObjetRequeteAppreciationsBulletinParEleve.js");
const {
	ObjetFenetre_ParamAppreciationsBulletinEleve,
} = require("ObjetFenetre_ParamAppreciationsBulletinEleve.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GDate } = require("ObjetDate.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetFicheGraphe } = require("ObjetFicheGraphe.js");
const {
	ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
const DonneesListe_AppreciationsBulletinParEleve = require("DonneesListe_AppreciationsBulletinParEleve.js");
const {
	TypeGenreLigneRecapDevoisEvalsEleve,
} = require("TypeGenreLigneRecapDevoisEvalsEleve.js");
const {
	ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
const {
	ObjetFenetre_DetailEvaluationsCompetences,
} = require("ObjetFenetre_DetailEvaluationsCompetences.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const ObjetRequeteSaisieBulletin = require("ObjetRequeteSaisieBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { ETypeAppreciationUtil } = require("Enumere_TypeAppreciation.js");
const {
	ObjetRequeteAssistantSaisie,
} = require("ObjetRequeteAssistantSaisie.js");
const {
	EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const nombreListeMax = 3;
class InterfaceAppreciationsBulletinParEleve extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.classeSelectionnee = null;
		this.afficherGrapheDevoir = true;
		this.modeGrapheCourbe = true;
		this.nombreListeVisible = 0;
		this.optionsAffichageListe = {
			afficherPeriodeVerticale: false,
			afficherCoefficientZero: true,
			afficherPeriode: new ObjetListeElements(),
			ordreTriChronologique: true,
			colonneElargie: false,
			afficherDevoirsEvalPdB: true,
			afficherAbsencePdB: true,
			afficherRetardPdB: true,
			afficherCategorie: false,
			listeCategoriesSelectionnees: new ObjetListeElements(),
		};
		this.moteur = new ObjetMoteurReleveBulletin();
		this.moteurPdB = new ObjetMoteurPiedDeBulletin();
		this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			_evntSurDernierMenuDeroulant.bind(this),
			_initTripleCombo.bind(this),
		);
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.identListe = [];
		for (let I = 0; I < nombreListeMax; I++) {
			this.identListe.push(this.add(ObjetListe, _evntSurListe.bind(this)));
		}
		this.identFenetreOptionsAffichage = this.addFenetre(
			ObjetFenetre_ParamAppreciationsBulletinEleve,
			this.evntFenetreParamAppreciationsBulletinEleve,
			this.initFenetreParamAppreciationsBulletinEleve,
		);
		this.identPiedPage = this.add(
			InterfacePiedBulletin,
			_evntSurPied.bind(this),
		);
		this.identFicheGraphe = this.add(ObjetFicheGraphe);
		if (this.avecAssistantSaisie()) {
			this.identFenetreAssistantSaisie = this.add(
				ObjetFenetre_AssistantSaisie,
				_evntSurFenetreAssistantSaisie.bind(this),
				this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
			);
		}
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences,
			this.evenementFenetreDetailEvaluations,
			this.initFenetreDetailEvaluations,
		);
		this.construireFicheEleveEtFichePhoto();
	}
	getTitleBoutonGraphe() {
		return GTraductions.getValeur("AppreciationsBulletinEleve.Graphe.Hint");
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="flex-contain cols full-size p-all">');
		H.push('<div class="fluid-bloc">');
		for (let I = 0; I < nombreListeMax; I++) {
			H.push(
				'<div class="p-y" id="',
				this.getInstance(this.identListe[I]).getNom(),
				'"></div>',
			);
		}
		H.push("</div>");
		H.push(
			'  <div  id="',
			this.getInstance(this.identPiedPage).getNom(),
			'"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListe[0];
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau.getHtmlBtnTriOrdreChronologique(
				"btnTriChronologique",
			),
		});
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau.getHtmlBtnCompacterColonnes(
				"btnCompacterColonnes",
			),
		});
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
		if (this.avecAssistantSaisie()) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					"btnAssistantSaisie",
				),
			});
		}
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau.getHtmlBtnParametrer("btnOptionsAffichage"),
		});
	}
	evenementAfficherMessage(aGenreMessage) {
		$("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
			"display",
			"none",
		);
		for (let I = 1; I < nombreListeMax; I++) {
			this.getInstance(this.identListe[I]).setVisible(false);
		}
		this._evenementAfficherMessage(aGenreMessage);
	}
	initFenetreParamAppreciationsBulletinEleve(aInstance) {
		aInstance.setOptionsFenetre({
			titre: GTraductions.getValeur(
				"AppreciationsBulletinEleve.FenetreParametrageAffichage.ParametresAffichage",
			),
			largeur: 400,
			hauteur: 80,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
	}
	evntFenetreParamAppreciationsBulletinEleve(aNumeroBouton, aParametres) {
		if (aNumeroBouton === 1) {
			this.setOptionsAffichageListe({
				afficherPeriodeVerticale: aParametres.afficherPeriodeVerticale,
				afficherCoefficientZero: aParametres.afficherCoefficientZero,
				afficherPeriode: aParametres.afficherPeriode,
				afficherDevoirsEvalPdB: aParametres.afficherDevoirsEvalPdB,
				afficherAbsencePdB: aParametres.afficherAbsencePdB,
				afficherRetardPdB: aParametres.afficherRetardPdB,
				afficherCategorie: aParametres.afficherCategorie,
				listeCategoriesSelectionnees: aParametres.listeCategoriesSelectionnees,
			});
			this.afficherPage();
		}
	}
	getListeTypesAppreciations() {
		if (this.avecAssistantSaisie()) {
			this.requeteDonneesAssistantSaisie();
		} else {
			this.listeTypesAppreciations = new ObjetListeElements();
		}
	}
	requeteDonneesAssistantSaisie() {
		new ObjetRequeteAssistantSaisie(
			this,
			this.actionSurRequeteDonneesAssistantSaisie,
		).lancerRequete();
	}
	actionSurRequeteDonneesAssistantSaisie(aListeTypesAppreciations) {
		this.listeTypesAppreciations = aListeTypesAppreciations;
	}
	initFenetreDetailEvaluations(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 700,
			hauteur: 500,
			listeBoutons: [GTraductions.getValeur("Fermer")],
		});
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin: TypeReleveBulletin.AppreciationsBulletinParEleve,
		});
	}
	setOptionsAffichageListe(aOptionsAffichage) {
		Object.assign(this.optionsAffichageListe, aOptionsAffichage);
	}
	getOptionsAffichageListe() {
		return this.optionsAffichageListe;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnTriChronologique: {
				event() {
					aInstance.optionsAffichageListe.ordreTriChronologique =
						!aInstance.optionsAffichageListe.ordreTriChronologique;
					aInstance.afficherPage();
				},
				getTitle() {
					return GTraductions.getValeur(
						"AppreciationsBulletinEleve.BoutonBandeau.OrdreChrono",
					);
				},
				getSelection() {
					return !!aInstance.optionsAffichageListe.ordreTriChronologique;
				},
			},
			btnCompacterColonnes: {
				event() {
					aInstance.optionsAffichageListe.colonneElargie =
						!aInstance.optionsAffichageListe.colonneElargie;
					aInstance.afficherInterfaceGraphique(aInstance.Donnees.listeTableau);
				},
				getTitle() {
					return GTraductions.getValeur(
						"AppreciationsBulletinEleve.BoutonBandeau.CompacterColonne",
					);
				},
				getSelection() {
					return !aInstance.optionsAffichageListe.colonneElargie;
				},
			},
			btnAssistantSaisie: {
				event() {
					_evntSurAssistant.call(aInstance);
				},
				getTitle() {
					return aInstance.moteurAssSaisie.getTitleBoutonAssistantSaisie();
				},
				getSelection() {
					return GEtatUtilisateur.assistantSaisieActif;
				},
			},
			btnOptionsAffichage: {
				event() {
					aInstance
						.getInstance(aInstance.identFenetreOptionsAffichage)
						.setDonnees({
							afficherCoefficientZero:
								aInstance.optionsAffichageListe.afficherCoefficientZero,
							afficherPeriodeVerticale:
								aInstance.optionsAffichageListe.afficherPeriodeVerticale,
							afficherPeriode: aInstance.optionsAffichageListe.afficherPeriode,
							afficherDevoirsEvalPdB:
								aInstance.optionsAffichageListe.afficherDevoirsEvalPdB,
							afficherAbsencePdB:
								aInstance.optionsAffichageListe.afficherAbsencePdB,
							afficherRetardPdB:
								aInstance.optionsAffichageListe.afficherRetardPdB,
							afficherCategorie:
								aInstance.optionsAffichageListe.afficherCategorie,
							listeCategoriesSelectionnees:
								aInstance.optionsAffichageListe.listeCategoriesSelectionnees,
						});
				},
				getTitle() {
					return GTraductions.getValeur(
						"AppreciationsBulletinEleve.FenetreParametrageAffichage.ParametresAffichage",
					);
				},
				getSelection() {
					return aInstance
						.getInstance(aInstance.identFenetreOptionsAffichage)
						.estAffiche();
				},
			},
		});
	}
	afficherPage() {
		this.setEtatSaisie(false);
		const lClasse = _getClasse();
		if (!this.classeSelectionnee || this.classeSelectionnee !== lClasse) {
			this.optionsAffichageListe.afficherPeriode = new ObjetListeElements();
			this.classeSelectionnee = lClasse;
		}
		this.optionsAffichageListe.listeCategoriesSelectionnees.parcourir(
			(aCategorie) => {
				if (!!aCategorie.coche) {
					aCategorie.setEtat(EGenreEtat.Modification);
				} else {
					aCategorie.setEtat(EGenreEtat.Aucun);
				}
			},
		);
		const lParam = {
			eleve: _getEleve(),
			classe: _getClasse(),
			service: _getService(),
			ordre: this.optionsAffichageListe.ordreTriChronologique,
			modeVertical: this.optionsAffichageListe.afficherPeriodeVerticale,
			coefficientZero: this.optionsAffichageListe.afficherCoefficientZero,
			periodes: this.optionsAffichageListe.afficherPeriode,
			avecCategories: this.optionsAffichageListe.afficherCategorie,
			listeCategoriesSelectionnees:
				this.optionsAffichageListe.listeCategoriesSelectionnees,
		};
		_initPiedPage.call(this, false);
		new ObjetRequeteAppreciationsBulletinParEleve(
			this,
			_actionSurRecupererDonnees.bind(this),
		).lancerRequete(lParam);
		this.getListeTypesAppreciations();
	}
	actualiserGraphe(aParam) {
		const lInterface = this;
		if (aParam !== undefined) {
			const graphe = !!this.afficherGrapheDevoir
				? !this.modeGrapheCourbe
					? aParam.graphDevoirHisto
					: aParam.graphDevoirCourbe
				: aParam.graphEval;
			this.setGraphe(
				{
					image: [graphe],
					titre: aParam.titreGraphe,
					message: "",
					libelle: graphe ? undefined : aParam.msgGraphEval,
				},
				{
					controleur: {
						afficherDevoirsEval: {
							getValue: function (aMode) {
								return aMode
									? lInterface.afficherGrapheDevoir
									: !lInterface.afficherGrapheDevoir;
							},
							setValue: function (aValue) {
								lInterface.afficherGrapheDevoir = aValue;
								lInterface.actualiserGraphe(aParam);
							},
						},
						modeAffichage: {
							getValue: function () {
								return !!lInterface.modeGrapheCourbe;
							},
							setValue: function (aValue) {
								lInterface.modeGrapheCourbe = aValue;
								lInterface.actualiserGraphe(aParam);
							},
						},
					},
					filtres: [
						{
							html:
								'<span class="EspaceDroit">' +
								'<label class="EspaceDroit"><ie-radio ie-model="afficherDevoirsEval(1)" />' +
								GTraductions.getValeur(
									"AppreciationsBulletinEleve.Graphe.Devoirs",
								) +
								"</label>" +
								'<label class="EspaceDroit"><ie-radio ie-model="afficherDevoirsEval(0)" />' +
								GTraductions.getValeur(
									"AppreciationsBulletinEleve.Graphe.Evaluations",
								) +
								"</label></span>" +
								(lInterface.afficherGrapheDevoir
									? '<ie-switch ie-model="modeAffichage" style="float:right;"><span class="Image_GrapheHistogramme"></span><span class="Image_GrapheCourbe"></span></ie-switch>'
									: ""),
						},
					],
				},
			);
		}
		this.actualiserFicheGraphe();
	}
	initPiedPage(aInstance) {
		const lContexte = {
			eleve: _getEleve(),
			classe: _getClasse(),
			service: _getService(),
			typeReleveBulletin: TypeReleveBulletin.AppreciationsBulletinParEleve,
			suivante: { orientationVerticale: false },
		};
		this.moteurPdB.initPiedPage(aInstance, {
			typeReleveBulletin: TypeReleveBulletin.AppreciationsBulletinParEleve,
			typeContexteBulletin: TypeContexteBulletin.CB_Eleve,
			avecSaisie: true,
			avecValidationAuto: true,
			clbckValidationAutoSurEdition: _clbckValidationAutoSurEdition.bind(
				this,
				lContexte,
			),
		});
	}
	saisieAppreciation(aParam, aParamRequete) {
		const lParam = {
			instanceListe: aParam.instanceListe,
			paramRequete: aParamRequete,
			paramCellSuivante:
				aParam.suivante !== null && aParam.suivante !== undefined
					? aParam.suivante
					: { orientationVerticale: true },
			clbckEchec: function () {}.bind(this),
		};
		$.extend(lParam, {
			clbckSucces: function (aParamSucces) {
				this.moteurPdB.majAppreciationPdBParPeriode(
					$.extend(aParamSucces, {
						instanceListe: lParam.instanceListe,
						global: aParam.global,
					}),
				);
			}.bind(this),
		});
		this.moteur.saisieAppreciation(lParam);
	}
	afficherInterfaceGraphique(aListeTableaux) {
		let I = 0;
		this.nombreListeVisible = 0;
		for (; I < aListeTableaux.count(); I++) {
			const lTableau = aListeTableaux.get(I);
			this._initialiserListe(this.getInstance(this.identListe[I]), lTableau);
			if (lTableau.listeLignes.count() > 0) {
				this.getInstance(this.identListe[I]).setVisible(true);
				this.getInstance(this.identListe[I]).setDonnees(
					new DonneesListe_AppreciationsBulletinParEleve(
						_formatterDonneesPourRegroupements.call(this, lTableau.listeLignes),
						lTableau.listeColonnnesDynamique,
						this.optionsAffichageListe,
					),
				);
				this.nombreListeVisible++;
			} else {
				this.getInstance(this.identListe[I]).setVisible(false);
			}
		}
		for (; I < nombreListeMax; I++) {
			this.getInstance(this.identListe[I]).setVisible(false);
		}
		this.surResizeInterface();
	}
	_initialiserListe(aInstance, aTableau) {
		let lAuMoinsUnePeriodeVisible = false;
		let lColonnes = [];
		const modeVertical = this.optionsAffichageListe.afficherPeriodeVerticale;
		lColonnes.push({
			id: DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne,
			taille: "250px",
			titre: {
				libelle: modeVertical
					? aTableau.listeColonnnesDynamique.listePeriodes
							.get(0)
							.periode.getLibelle()
					: "",
			},
		});
		let tailleColonne = this.optionsAffichageListe.colonneElargie
			? "100px"
			: "50px";
		let lAfficherMoyenne = false;
		for (
			let lNumPeriode = 0;
			lNumPeriode < aTableau.listeColonnnesDynamique.listePeriodes.count();
			lNumPeriode++
		) {
			const lPeriode =
				aTableau.listeColonnnesDynamique.listePeriodes.get(lNumPeriode);
			const lAfficherPeriode = _getPeriodeAffichee.call(
				this,
				this.optionsAffichageListe.afficherPeriode,
				lPeriode.periode,
			);
			if (!!lAfficherPeriode) {
				const lPeriodeVisible = !modeVertical
					? lAfficherPeriode.periode.getNumero() ===
							lPeriode.periode.getNumero() && lAfficherPeriode.visible
					: true;
				const lPeriodePied =
					this.Donnees.ObjetListeAppreciations.listePeriodes.getElementParNumero(
						lPeriode.periode.getNumero(),
					);
				if (lPeriodeVisible) {
					lAuMoinsUnePeriodeVisible = true;
					if (lPeriodePied && lPeriodePied.nbrDevoirs) {
						lAfficherMoyenne = true;
						lColonnes.push({
							id:
								DonneesListe_AppreciationsBulletinParEleve.colonnes.periode +
								lNumPeriode,
							taille: tailleColonne,
							titre: { libelle: lPeriode.getLibelle() },
							hint: GTraductions.getValeur(
								"AppreciationsBulletinEleve.HintMoyenne",
							),
						});
					}
				}
			}
		}
		if (!modeVertical && lAfficherMoyenne) {
			lColonnes.push({
				id: DonneesListe_AppreciationsBulletinParEleve.colonnes.moyenneAnnuelle,
				taille: tailleColonne,
				titre: {
					libelle: GTraductions.getValeur(
						"AppreciationsBulletinEleve.MoyenneAnnuelle",
					),
				},
			});
		}
		aInstance.controleur.hintColonneDevoir = function (lNumDevoir) {
			const lDevoir =
				aTableau.listeColonnnesDynamique.listeColonnesDevoirsEval.get(
					lNumDevoir,
				);
			return lDevoir.hint || "";
		};
		tailleColonne = this.optionsAffichageListe.colonneElargie
			? "120px"
			: "75px";
		for (
			let lNumDevoir = 0;
			lNumDevoir <
			aTableau.listeColonnnesDynamique.listeColonnesDevoirsEval.count();
			lNumDevoir++
		) {
			const lTitreColonneDevoir = [];
			const lDevoir =
				aTableau.listeColonnnesDynamique.listeColonnesDevoirsEval.get(
					lNumDevoir,
				);
			lTitreColonneDevoir.push(
				"<div>",
				'<div style="display: flex; justify-content: center;">',
			);
			if (!!lDevoir.categorie && !!lDevoir.categorie.couleur) {
				lTitreColonneDevoir.push(
					'<div style="border: .1rem solid black; width:.8rem; height: .8rem;  align-self: center; margin-right: 0.3rem; background-color:',
					lDevoir.categorie.couleur,
					';"></div>',
				);
			}
			lTitreColonneDevoir.push(
				GDate.formatDate(lDevoir.date, "%JJ/%MM"),
				"</div>",
			);
			lTitreColonneDevoir.push(
				lDevoir.getGenre() === EGenreRessource.Devoir
					? '<div class="ie-ellipsis">' + lDevoir.getLibelle() + "</div>"
					: "",
			);
			lTitreColonneDevoir.push(lDevoir.coefficient, "</div>");
			const lTitre = [];
			if (!modeVertical) {
				lTitre.push({
					libelle: lDevoir.periode.getLibelle(),
					avecFusionColonne: true,
				});
			}
			lTitre.push({
				libelleHtml: lTitreColonneDevoir.join(""),
				titleHtml: lDevoir.hint,
			});
			lColonnes.push({
				id:
					DonneesListe_AppreciationsBulletinParEleve.colonnes.devoir +
					lNumDevoir,
				taille: tailleColonne,
				titre: lTitre,
				genre: lDevoir.getGenre(),
			});
		}
		if (!lAuMoinsUnePeriodeVisible) {
			lColonnes = [];
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			scrollHorizontal:
				DonneesListe_AppreciationsBulletinParEleve.colonnes.devoir + "0",
			hauteurAdapteContenu: true,
		});
	}
	valider() {
		const lPiedPage = this.getInstance(this.identPiedPage).getDonneesSaisie();
		const service = _getService();
		const lListeAppreciations = new ObjetElement();
		if (lPiedPage.appreciations) {
			lListeAppreciations.setNumero(service.getNumero());
			lListeAppreciations.setLibelle(service.getLibelle());
			lListeAppreciations.setEtat(EGenreEtat.Modification);
			lListeAppreciations.ListeAppreciations = new ObjetListeElements();
			lPiedPage.appreciations.parcourir((D) => {
				D.ListeAppreciations.parcourir((periode) => {
					lListeAppreciations.ListeAppreciations.addElement(periode);
				});
			});
		}
		const listeService = new ObjetListeElements();
		listeService.addElement(lListeAppreciations);
		new ObjetRequeteSaisieBulletin(
			this,
			this.actionSurValidation,
		).lancerRequete({
			classe: _getClasse(),
			eleve: _getEleve(),
			listeDonnees: listeService,
			listeCdClasse: lPiedPage.appreciationsGenerales,
			listeNiveauDAcquisitions: lPiedPage.appreciations.listeNiveauDAcquitions,
			listeMoyennes: lPiedPage.appreciations.listeMoyennes,
			listeTypesAppreciations: this.listeTypesAppreciations,
		});
	}
}
function _getEleve() {
	return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve);
}
function _getClasse() {
	return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
}
function _getService() {
	return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service);
}
function _evntSurPied(aParam) {
	this.objCelluleAppreciation = $.extend(aParam, { ctxPiedBulletin: true });
	this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
		instanceFenetreAssistantSaisie: this.getInstance(
			this.identFenetreAssistantSaisie,
		),
		listeTypesAppreciations: this.listeTypesAppreciations,
		tabTypeAppreciation: ETypeAppreciationUtil.getTypeAppreciation(
			GEtatUtilisateur.getGenreOnglet(),
			aParam.appreciation,
			this.objCelluleAppreciation.global,
		),
		tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
			estCtxPied: true,
			appreciation: aParam.appreciation,
			typeReleveBulletin: TypeReleveBulletin.AppreciationsBulletinParEleve,
			estCtxApprGenerale: this.objCelluleAppreciation.global,
		}),
		avecEtatSaisie: false,
	});
}
function _evntSurAssistant() {
	GEtatUtilisateur.inverserEtatAssistantSaisie();
	if (
		this.identPiedPage &&
		this.getInstance(this.identPiedPage).evenementSurAssistant
	) {
		this.getInstance(this.identPiedPage).evenementSurAssistant();
	}
}
function _evntSurChangementAssistantSaisie() {
	this.afficherPage(false);
}
function _validerAppreciation(aParam, aParamSaisie) {
	const lContexte = aParamSaisie.contexte;
	const lListe = aParamSaisie.liste;
	const lEstCtxPiedBulletin = aParamSaisie.estCtxPiedBulletin;
	this.moteurAssSaisie.validerDonneesSurValider({
		article: lContexte.article,
		appreciation: lContexte.appreciation,
		eltSelectionne: aParam.eltSelectionne,
	});
	const lService = lContexte.global === true ? null : _getService();
	this.saisieAppreciation(
		{
			instanceListe: lListe,
			estCtxPied: lEstCtxPiedBulletin,
			suivante: { orientationVerticale: false },
			global: lContexte.global,
		},
		{
			eleve: _getEleve(),
			classe: _getClasse(),
			periode: lContexte.article,
			service: lService,
			appreciation: lContexte.appreciation,
			typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
				estCtxPied: lEstCtxPiedBulletin,
				eleve: _getEleve(),
				typeReleveBulletin: TypeReleveBulletin.AppreciationsBulletinParEleve,
				appreciation: lContexte.appreciation,
				estCtxApprGenerale: lContexte.global,
			}),
		},
	);
}
function surEvntAssSaisie(aParam) {
	const lContexte = this.objCelluleAppreciation;
	const lEstCtxPiedBulletin =
		lContexte !== null && lContexte !== undefined && lContexte.ctxPiedBulletin;
	const lListe = lEstCtxPiedBulletin
		? lContexte.instanceListe
		: this.getInstance(this.identListe);
	if (lListe !== null && lListe !== undefined) {
		let lClbck;
		switch (aParam.cmd) {
			case EBoutonFenetreAssistantSaisie.Valider:
				lClbck = function () {
					_validerAppreciation.call(this, aParam, {
						contexte: lContexte,
						liste: lListe,
						estCtxPiedBulletin: lEstCtxPiedBulletin,
					});
				}.bind(this);
				break;
			case EBoutonFenetreAssistantSaisie.PasserEnSaisie:
				lClbck = function () {
					this.moteurAssSaisie.passerEnSaisie({
						instanceListe: lListe,
						idColonne: lContexte.idColonne,
					});
				}.bind(this);
				break;
			case EBoutonFenetreAssistantSaisie.Fermer:
				lClbck = null;
				break;
			default:
		}
		this.moteurAssSaisie.saisirModifAssSaisieAvantTraitement({
			estAssistantModifie: aParam.estAssistantModifie,
			pere: this,
			clbck: lClbck,
		});
	}
}
function _evntSurFenetreAssistantSaisie(aNumeroBouton) {
	const lParam = {
		instanceFenetreAssistantSaisie: this.getInstance(
			this.identFenetreAssistantSaisie,
		),
		eventChangementUtiliserAssSaisie:
			_evntSurChangementAssistantSaisie.bind(this),
		evntClbck: surEvntAssSaisie.bind(this),
	};
	this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
}
function _initAfficherPeriode(aListePeriode) {
	const listePeriode = new ObjetListeElements();
	if (aListePeriode) {
		aListePeriode.parcourir((aElement) => {
			const ligne = new ObjetElement();
			ligne.periode = aElement;
			ligne.visible = true;
			listePeriode.addElement(ligne);
		});
	}
	return listePeriode;
}
function _actionSurRecupererDonnees(aParam, aPiedDePage) {
	this.setGraphe(null);
	if (aParam.Message) {
		_masquerVisibilitePiedPage.call(this, true);
	} else {
		_masquerVisibilitePiedPage.call(this, false);
		this.Donnees = aParam;
		this.PiedDePage = aPiedDePage;
		if (
			this.optionsAffichageListe.afficherPeriode.count() !==
			aParam.listePeriodes.count()
		) {
			this.optionsAffichageListe.afficherPeriode = _initAfficherPeriode.call(
				this,
				aParam.listePeriodes,
			);
		}
		this.afficherInterfaceGraphique(aParam.listeTableau);
		_afficherPiedPage.call(this, aPiedDePage);
		_activerImpression.call(this);
	}
	if (!!this.identFicheGraphe) {
		this.getInstance(this.identFicheGraphe).fermer();
	}
	if (!aParam.Message) {
		this.afficherBandeau(true);
		this.actualiserGraphe(aParam);
	}
}
function _activerImpression() {}
function _initTripleCombo(aInstance) {
	aInstance.setParametres([
		EGenreRessource.Classe,
		EGenreRessource.Service,
		EGenreRessource.Eleve,
	]);
}
function _evntSurDernierMenuDeroulant() {
	this.surSelectionEleve();
	const lEleve = _getEleve();
	const lExisteEleve =
		lEleve !== null && lEleve !== undefined && lEleve.existeNumero();
	if (lExisteEleve) {
		this.afficherPage();
	}
}
function _formatterDonneesPourRegroupements(aDonnees) {
	const lDonneesAcRegroup = new ObjetListeElements();
	let lLigne = null;
	let lPere = null;
	aDonnees.parcourir((aLigne) => {
		lLigne = aLigne;
		if (
			aLigne.getGenre() === TypeGenreLigneRecapDevoisEvalsEleve.LigneTitreEval
		) {
			lLigne.estUnDeploiement = true;
			lLigne.estDeploye = true;
			lPere = lLigne;
		} else if (
			aLigne.getGenre() === TypeGenreLigneRecapDevoisEvalsEleve.LigneElementComp
		) {
			lLigne.pere = lPere;
		}
		lDonneesAcRegroup.addElement(lLigne);
	});
	return lDonneesAcRegroup;
}
function _initPiedPage() {
	const lInstancePdP = this.getInstance(this.identPiedPage);
	this.initPiedPage(lInstancePdP);
	lInstancePdP.initialiser(true);
}
function _clbckValidationAutoSurEdition(aCtx, aParam) {
	let lCtx = $.extend(aCtx, { periode: aParam.periode });
	if (aParam.global === true) {
		lCtx = $.extend(lCtx, { service: null });
	} else {
		let lTypeGenreAppreciation = this.moteur.getTypeGenreAppreciation({
			estCtxPied: true,
			appreciation: aParam.appreciation,
			typeReleveBulletin: TypeReleveBulletin.AppreciationsBulletinParEleve,
			estCtxApprGenerale: aParam.global,
		});
		lCtx = $.extend(lCtx, { typeGenreAppreciation: lTypeGenreAppreciation });
	}
	if (lCtx.suivante !== null && lCtx.suivante !== undefined) {
		$.extend(aParam, { suivante: lCtx.suivante });
	}
	this.moteurPdB.clbckValidationAutoSurEditionPdB(
		$.extend(lCtx, {
			clbckSaisieAppreciation: this.saisieAppreciation.bind(this),
		}),
		aParam,
	);
}
function _afficherPiedPage(aPiedDePage) {
	if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
		this.getInstance(this.identPiedPage).setDonnees({
			donnees: aPiedDePage,
			options: this.optionsAffichageListe,
		});
	}
}
function _masquerVisibilitePiedPage(aMasquer) {
	if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
		$("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
			"display",
			aMasquer ? "none" : "",
		);
	}
}
function _evntSurListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.SelectionClick:
			if (
				aParametres.article.getGenre() ===
					TypeGenreLigneRecapDevoisEvalsEleve.LigneTitreEval &&
				aParametres.declarationColonne.genre === EGenreRessource.Evaluation
			) {
				surClicEvaluation.call(this, aParametres);
			}
			break;
		case EGenreEvenementListe.Edition:
			break;
	}
}
function surClicEvaluation(aParametre) {
	const lEval =
		DonneesListe_AppreciationsBulletinParEleve.getDevoir(aParametre);
	const lPeriode =
		DonneesListe_AppreciationsBulletinParEleve.getPeriode(aParametre);
	if (lEval && lEval.listeRelationsESI && lEval.listeRelationsESI.length) {
		new ObjetRequeteDetailEvaluationsCompetences(
			this,
			_reponseRequeteDetailEvaluations.bind(this, aParametre.article),
		).lancerRequete({
			eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
			pilier: null,
			periode: lPeriode,
			numRelESI: lEval.listeRelationsESI,
		});
	}
}
function _reponseRequeteDetailEvaluations(aLigne, aJSON) {
	const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
	const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
		GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
		aLigne,
	);
	lFenetre.setDonnees(aLigne, aJSON, { titreFenetre: lTitreParDefaut });
}
function _getPeriodeAffichee(aTableau, aPeriode) {
	let lPeriode = null;
	aTableau.parcourir((aElement) => {
		if (aElement.periode.getNumero() === aPeriode.getNumero()) {
			lPeriode = aElement;
			return false;
		}
	});
	return lPeriode;
}
module.exports = InterfaceAppreciationsBulletinParEleve;
