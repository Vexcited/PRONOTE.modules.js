exports.InterfaceAppreciationsBulletinParEleve = void 0;
const InterfacePage_1 = require("InterfacePage");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const InterfacePiedBulletin_1 = require("InterfacePiedBulletin");
const ObjetListe_1 = require("ObjetListe");
const ObjetRequeteAppreciationsBulletinParEleve_1 = require("ObjetRequeteAppreciationsBulletinParEleve");
const ObjetFenetre_ParamAppreciationsBulletinEleve_1 = require("ObjetFenetre_ParamAppreciationsBulletinEleve");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetFicheGraphe_1 = require("ObjetFicheGraphe");
const ObjetFenetre_AssistantSaisie_1 = require("ObjetFenetre_AssistantSaisie");
const DonneesListe_AppreciationsBulletinParEleve_1 = require("DonneesListe_AppreciationsBulletinParEleve");
const TypeGenreLigneRecapDevoisEvalsEleve_1 = require("TypeGenreLigneRecapDevoisEvalsEleve");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const ObjetRequeteSaisieBulletin_1 = require("ObjetRequeteSaisieBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const Enumere_TypeAppreciation_1 = require("Enumere_TypeAppreciation");
const ObjetRequeteAssistantSaisie_1 = require("ObjetRequeteAssistantSaisie");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const UtilitaireDeserialiserPiedBulletin_1 = require("UtilitaireDeserialiserPiedBulletin");
const AccessApp_1 = require("AccessApp");
const nombreListeMax = 3;
class InterfaceAppreciationsBulletinParEleve extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appScoEspace.getEtatUtilisateur();
		this.classeSelectionnee = null;
		this.afficherGrapheDevoir = true;
		this.modeGrapheCourbe = true;
		this.nombreListeVisible = 0;
		this.optionsAffichageListe = {
			afficherPeriodeVerticale: false,
			afficherCoefficientZero: true,
			afficherPeriode: new ObjetListeElements_1.ObjetListeElements(),
			ordreTriChronologique: true,
			colonneElargie: false,
			afficherDevoirsEvalPdB: true,
			afficherAbsencePdB: true,
			afficherRetardPdB: true,
			afficherCategorie: false,
			listeCategoriesSelectionnees:
				new ObjetListeElements_1.ObjetListeElements(),
		};
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evntSurDernierMenuDeroulant.bind(this),
			this._initTripleCombo.bind(this),
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
			this.identListe.push(
				this.add(ObjetListe_1.ObjetListe, this._evntSurListe.bind(this)),
			);
		}
		this.identFenetreOptionsAffichage = this.addFenetre(
			ObjetFenetre_ParamAppreciationsBulletinEleve_1.ObjetFenetre_ParamAppreciationsBulletinEleve,
			this.evntFenetreParamAppreciationsBulletinEleve,
			this.initFenetreParamAppreciationsBulletinEleve,
		);
		this.identPiedPage = this.add(
			InterfacePiedBulletin_1.InterfacePiedBulletin,
			this._evntSurPied.bind(this),
		);
		this.identFicheGraphe = this.add(ObjetFicheGraphe_1.ObjetFicheGraphe);
		if (this.avecAssistantSaisie()) {
			this.identFenetreAssistantSaisie = this.add(
				ObjetFenetre_AssistantSaisie_1.ObjetFenetre_AssistantSaisie,
				this._evntSurFenetreAssistantSaisie.bind(this),
				this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
			);
		}
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences_1.ObjetFenetre_DetailEvaluationsCompetences,
			null,
			this.initFenetreDetailEvaluations,
		);
		this.construireFicheEleveEtFichePhoto();
	}
	getTitleBoutonGraphe() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"AppreciationsBulletinEleve.Graphe.Hint",
		);
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
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListe[0];
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnTriOrdreChronologique(
				this.jsxModeleBoutonTriChronologique.bind(this),
			),
		});
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnCompacterColonnes(
				this.jsxModeleBoutonCompacterColonnes.bind(this),
			),
		});
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
		if (this.avecAssistantSaisie()) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					this.jsxModeleBoutonAssistantSaisie.bind(this),
				),
			});
		}
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
				this.jsxModeleBoutonOptionsAffichage.bind(this),
			),
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
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"AppreciationsBulletinEleve.FenetreParametrageAffichage.ParametresAffichage",
			),
			largeur: 400,
			hauteur: 80,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
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
			this.listeTypesAppreciations =
				new ObjetListeElements_1.ObjetListeElements();
		}
	}
	requeteDonneesAssistantSaisie() {
		new ObjetRequeteAssistantSaisie_1.ObjetRequeteAssistantSaisie(
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
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinParEleve,
		});
	}
	setOptionsAffichageListe(aOptionsAffichage) {
		Object.assign(this.optionsAffichageListe, aOptionsAffichage);
	}
	getOptionsAffichageListe() {
		return this.optionsAffichageListe;
	}
	jsxModeleBoutonAssistantSaisie() {
		return {
			event: () => {
				this._evntSurAssistant();
			},
			getTitle: () => {
				return this.moteurAssSaisie.getTitleBoutonAssistantSaisie();
			},
			getSelection: () => {
				return this.etatUtilSco.assistantSaisieActif;
			},
		};
	}
	jsxModeleBoutonTriChronologique() {
		return {
			event: () => {
				this.optionsAffichageListe.ordreTriChronologique =
					!this.optionsAffichageListe.ordreTriChronologique;
				this.afficherPage();
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"AppreciationsBulletinEleve.BoutonBandeau.OrdreChrono",
				);
			},
			getSelection: () => {
				return !!this.optionsAffichageListe.ordreTriChronologique;
			},
		};
	}
	jsxModeleBoutonCompacterColonnes() {
		return {
			event: () => {
				this.optionsAffichageListe.colonneElargie =
					!this.optionsAffichageListe.colonneElargie;
				this.afficherInterfaceGraphique(this.Donnees.listeTableau);
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"AppreciationsBulletinEleve.BoutonBandeau.CompacterColonne",
				);
			},
			getSelection: () => {
				return !this.optionsAffichageListe.colonneElargie;
			},
		};
	}
	jsxModeleBoutonOptionsAffichage() {
		return {
			event: () => {
				this.getInstance(this.identFenetreOptionsAffichage).setDonnees({
					afficherCoefficientZero:
						this.optionsAffichageListe.afficherCoefficientZero,
					afficherPeriodeVerticale:
						this.optionsAffichageListe.afficherPeriodeVerticale,
					afficherPeriode: this.optionsAffichageListe.afficherPeriode,
					afficherDevoirsEvalPdB:
						this.optionsAffichageListe.afficherDevoirsEvalPdB,
					afficherAbsencePdB: this.optionsAffichageListe.afficherAbsencePdB,
					afficherRetardPdB: this.optionsAffichageListe.afficherRetardPdB,
					afficherCategorie: this.optionsAffichageListe.afficherCategorie,
					listeCategoriesSelectionnees:
						this.optionsAffichageListe.listeCategoriesSelectionnees,
				});
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"AppreciationsBulletinEleve.FenetreParametrageAffichage.ParametresAffichage",
				);
			},
			getSelection: () => {
				return this.getInstance(this.identFenetreOptionsAffichage).estAffiche();
			},
		};
	}
	afficherPage() {
		this.setEtatSaisie(false);
		const lClasse = this._getClasse();
		if (!this.classeSelectionnee || this.classeSelectionnee !== lClasse) {
			this.optionsAffichageListe.afficherPeriode =
				new ObjetListeElements_1.ObjetListeElements();
			this.classeSelectionnee = lClasse;
		}
		this.optionsAffichageListe.listeCategoriesSelectionnees.parcourir(
			(aCategorie) => {
				if (!!aCategorie.coche) {
					aCategorie.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				} else {
					aCategorie.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
				}
			},
		);
		const lParam = {
			eleve: this._getEleve(),
			classe: this._getClasse(),
			service: this._getService(),
			ordre: this.optionsAffichageListe.ordreTriChronologique,
			modeVertical: this.optionsAffichageListe.afficherPeriodeVerticale,
			coefficientZero: this.optionsAffichageListe.afficherCoefficientZero,
			listePeriodes: this.optionsAffichageListe.afficherPeriode,
			avecCategories: this.optionsAffichageListe.afficherCategorie,
			listeCategories: this.optionsAffichageListe.listeCategoriesSelectionnees,
		};
		this._initPiedPage();
		new ObjetRequeteAppreciationsBulletinParEleve_1.ObjetRequeteAppreciationsBulletinParEleve(
			this,
			this._actionSurRecupererDonnees.bind(this),
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
					filtres: [
						{
							getHtml: () => {
								const lafficherDevoirsEval = (aMode) => {
									return {
										getValue: () => {
											return aMode
												? this.afficherGrapheDevoir
												: !this.afficherGrapheDevoir;
										},
										setValue: () => {
											this.afficherGrapheDevoir = !!aMode;
											this.actualiserGraphe(aParam);
										},
										getName: () => {
											return `${this.Nom}_DevoirsEval`;
										},
									};
								};
								const lmodeAffichage = (aPourLineaire) => {
									return {
										getValue: () => {
											return !!this.modeGrapheCourbe === aPourLineaire;
										},
										setValue: () => {
											this.modeGrapheCourbe = aPourLineaire;
											this.actualiserGraphe(aParam);
										},
										getName: () => {
											return `${this.Nom}_jsxModelRadiolModeAffichage`;
										},
										getDisabled: () => {
											return false;
										},
									};
								};
								return IE.jsx.str(
									"div",
									{ class: ["flex-contain", "flex-center", "justify-between"] },
									IE.jsx.str(
										"span",
										{ class: "EspaceDroit" },
										IE.jsx.str(
											"ie-radio",
											{
												"ie-model": lafficherDevoirsEval.bind(this, 1),
												class: "EspaceDroit",
											},
											ObjetTraduction_1.GTraductions.getValeur(
												"AppreciationsBulletinEleve.Graphe.Devoirs",
											),
										),
										IE.jsx.str(
											"ie-radio",
											{ "ie-model": lafficherDevoirsEval.bind(this, 0) },
											ObjetTraduction_1.GTraductions.getValeur(
												"AppreciationsBulletinEleve.Graphe.Evaluations",
											),
										),
									),
									lInterface.afficherGrapheDevoir &&
										IE.jsx.str(
											"div",
											null,
											IE.jsx.str(
												"ie-radio",
												{
													class: ["as-chips"],
													"ie-model": lmodeAffichage.bind(this, false),
												},
												ObjetTraduction_1.GTraductions.getValeur(
													"AppreciationsBulletinEleve.Graphe.Histogramme",
												),
											),
											IE.jsx.str(
												"ie-radio",
												{
													class: ["as-chips"],
													"ie-model": lmodeAffichage.bind(this, true),
												},
												ObjetTraduction_1.GTraductions.getValeur(
													"AppreciationsBulletinEleve.Graphe.Lineaire",
												),
											),
										),
								);
							},
						},
					],
				},
			);
		}
		this.actualiserFicheGraphe();
	}
	initPiedPage(aInstance) {
		const lContexte = {
			eleve: this._getEleve(),
			classe: this._getClasse(),
			service: this._getService(),
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinParEleve,
			suivante: { orientationVerticale: false },
		};
		this.moteurPdB.initPiedPage(aInstance, {
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinParEleve,
			typeContexteBulletin:
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve,
			avecSaisie: true,
			avecValidationAuto: true,
			clbckValidationAutoSurEdition: this._clbckValidationAutoSurEdition.bind(
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
			clbckEchec: () => {},
			clbckSucces: (aParamSucces) => {
				this.moteurPdB.majAppreciationPdBParPeriode(
					$.extend(aParamSucces, {
						instanceListe: lParam.instanceListe,
						global: aParam.global,
					}),
				);
			},
		};
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
					new DonneesListe_AppreciationsBulletinParEleve_1.DonneesListe_AppreciationsBulletinParEleve(
						this._formatterDonneesPourRegroupements(lTableau.listeLignes),
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
			id: DonneesListe_AppreciationsBulletinParEleve_1
				.DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne,
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
			const lAfficherPeriode = this._getPeriodeAffichee(
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
								DonneesListe_AppreciationsBulletinParEleve_1
									.DonneesListe_AppreciationsBulletinParEleve.colonnes.periode +
								lNumPeriode,
							taille: tailleColonne,
							titre: { libelle: lPeriode.getLibelle() },
							hint: ObjetTraduction_1.GTraductions.getValeur(
								"AppreciationsBulletinEleve.HintMoyenne",
							),
						});
					}
				}
			}
		}
		if (!modeVertical && lAfficherMoyenne) {
			lColonnes.push({
				id: DonneesListe_AppreciationsBulletinParEleve_1
					.DonneesListe_AppreciationsBulletinParEleve.colonnes.moyenneAnnuelle,
				taille: tailleColonne,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"AppreciationsBulletinEleve.MoyenneAnnuelle",
					),
				},
			});
		}
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
				ObjetDate_1.GDate.formatDate(lDevoir.date, "%JJ/%MM"),
				"</div>",
			);
			lTitreColonneDevoir.push(
				lDevoir.getGenre() === Enumere_Ressource_1.EGenreRessource.Devoir
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
					DonneesListe_AppreciationsBulletinParEleve_1
						.DonneesListe_AppreciationsBulletinParEleve.colonnes.devoir +
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
				DonneesListe_AppreciationsBulletinParEleve_1
					.DonneesListe_AppreciationsBulletinParEleve.colonnes.devoir + "0",
			hauteurAdapteContenu: true,
		});
	}
	valider() {
		const lPiedPage = this.getInstance(this.identPiedPage).getDonneesSaisie();
		const service = this._getService();
		const lListeAppreciations = new ObjetElement_1.ObjetElement();
		if (lPiedPage.appreciations) {
			lListeAppreciations.setNumero(service.getNumero());
			lListeAppreciations.setLibelle(service.getLibelle());
			lListeAppreciations.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lListeAppreciations.ListeAppreciations =
				new ObjetListeElements_1.ObjetListeElements();
			lPiedPage.appreciations.parcourir((D) => {
				D.ListeAppreciations.parcourir((periode) => {
					lListeAppreciations.ListeAppreciations.addElement(periode);
				});
			});
		}
		const listeService = new ObjetListeElements_1.ObjetListeElements();
		listeService.addElement(lListeAppreciations);
		new ObjetRequeteSaisieBulletin_1.ObjetRequeteSaisieBulletin(
			this,
			this.actionSurValidation,
		).lancerRequete({
			classe: this._getClasse(),
			eleve: this._getEleve(),
			listeDonnees: listeService,
			listeCdClasse: lPiedPage.appreciationsGenerales,
			listeNiveauDAcquisitions: lPiedPage.appreciations.listeNiveauDAcquitions,
			listeMoyennes: lPiedPage.appreciations.listeMoyennes,
			listeTypesAppreciations: this.listeTypesAppreciations,
		});
	}
	_getEleve() {
		return this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
	}
	_getClasse() {
		return this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
	}
	_getService() {
		return this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Service,
		);
	}
	_evntSurPied(aParam) {
		this.objCelluleAppreciation = $.extend(aParam, { ctxPiedBulletin: true });
		this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			listeTypesAppreciations: this.listeTypesAppreciations,
			tabTypeAppreciation:
				Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
					this.etatUtilSco.getGenreOnglet(),
					aParam.appreciation,
					this.objCelluleAppreciation.global,
				),
			tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
				estCtxPied: true,
				appreciation: aParam.appreciation,
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinParEleve,
				estCtxApprGenerale: this.objCelluleAppreciation.global,
			}),
			avecEtatSaisie: false,
		});
	}
	_evntSurAssistant() {
		this.etatUtilSco.inverserEtatAssistantSaisie();
		if (
			this.identPiedPage &&
			this.getInstance(this.identPiedPage).evenementSurAssistant
		) {
			this.getInstance(this.identPiedPage).evenementSurAssistant();
		}
	}
	_evntSurChangementAssistantSaisie() {
		this.afficherPage();
	}
	_validerAppreciation(aParam, aParamSaisie) {
		const lContexte = aParamSaisie.contexte;
		const lListe = aParamSaisie.liste;
		const lEstCtxPiedBulletin = aParamSaisie.estCtxPiedBulletin;
		this.moteurAssSaisie.validerDonneesSurValider({
			article: lContexte.article,
			appreciation: lContexte.appreciation,
			eltSelectionne: aParam.eltSelectionne,
		});
		const lService = lContexte.global === true ? null : this._getService();
		this.saisieAppreciation(
			{
				instanceListe: lListe,
				estCtxPied: lEstCtxPiedBulletin,
				suivante: { orientationVerticale: false },
				global: lContexte.global,
			},
			{
				eleve: this._getEleve(),
				classe: this._getClasse(),
				periode: lContexte.article,
				service: lService,
				appreciation: lContexte.appreciation,
				typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
					estCtxPied: lEstCtxPiedBulletin,
					eleve: this._getEleve(),
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin
							.AppreciationsBulletinParEleve,
					appreciation: lContexte.appreciation,
					estCtxApprGenerale: lContexte.global,
				}),
			},
		);
	}
	surEvntAssSaisie(aParam) {
		const lContexte = this.objCelluleAppreciation;
		const lEstCtxPiedBulletin =
			lContexte !== null &&
			lContexte !== undefined &&
			lContexte.ctxPiedBulletin;
		const lListe = lEstCtxPiedBulletin
			? lContexte.instanceListe
			: this.getInstance(this.identListe);
		if (lListe !== null && lListe !== undefined) {
			let lClbck;
			switch (aParam.cmd) {
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Valider:
					lClbck = () => {
						this._validerAppreciation(aParam, {
							contexte: lContexte,
							liste: lListe,
							estCtxPiedBulletin: lEstCtxPiedBulletin,
						});
					};
					break;
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.PasserEnSaisie:
					lClbck = () => {
						this.moteurAssSaisie.passerEnSaisie({
							instanceListe: lListe,
							idColonne: lContexte.idColonne,
						});
					};
					break;
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Fermer:
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
	_evntSurFenetreAssistantSaisie(aNumeroBouton) {
		const lParam = {
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			eventChangementUtiliserAssSaisie:
				this._evntSurChangementAssistantSaisie.bind(this),
			evntClbck: this.surEvntAssSaisie.bind(this),
		};
		this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
	}
	_initAfficherPeriode(aListePeriode) {
		const listePeriode = new ObjetListeElements_1.ObjetListeElements();
		if (aListePeriode) {
			aListePeriode.parcourir((aElement) => {
				const ligne = new ObjetElement_1.ObjetElement();
				ligne.periode = aElement;
				ligne.visible = true;
				listePeriode.addElement(ligne);
			});
		}
		return listePeriode;
	}
	_actionSurRecupererDonnees(aParam) {
		const lPiedDePage =
			new UtilitaireDeserialiserPiedBulletin_1.UtilitaireDeserialiserPiedBulletin().creerPiedDePage(
				aParam,
			);
		this.setGraphe(null);
		if (aParam.Message) {
			this._masquerVisibilitePiedPage(true);
		} else {
			this._masquerVisibilitePiedPage(false);
			this.Donnees = aParam;
			this.PiedDePage = lPiedDePage;
			if (
				this.optionsAffichageListe.afficherPeriode.count() !==
				aParam.listePeriodes.count()
			) {
				this.optionsAffichageListe.afficherPeriode = this._initAfficherPeriode(
					aParam.listePeriodes,
				);
			}
			this.afficherInterfaceGraphique(aParam.listeTableau);
			this._afficherPiedPage(lPiedDePage);
			this._activerImpression();
		}
		if (!!this.identFicheGraphe) {
			this.getInstance(this.identFicheGraphe).fermer();
		}
		if (!aParam.Message) {
			this.afficherBandeau(true);
			this.actualiserGraphe(aParam);
		}
	}
	_activerImpression() {}
	_initTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Service,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
	}
	_evntSurDernierMenuDeroulant() {
		this.surSelectionEleve();
		const lEleve = this._getEleve();
		const lExisteEleve =
			lEleve !== null && lEleve !== undefined && lEleve.existeNumero();
		if (lExisteEleve) {
			this.afficherPage();
		}
	}
	_formatterDonneesPourRegroupements(aDonnees) {
		const lDonneesAcRegroup = new ObjetListeElements_1.ObjetListeElements();
		let lLigne = null;
		let lPere = null;
		aDonnees.parcourir((aLigne) => {
			lLigne = aLigne;
			if (
				aLigne.getGenre() ===
				TypeGenreLigneRecapDevoisEvalsEleve_1
					.TypeGenreLigneRecapDevoisEvalsEleve.LigneTitreEval
			) {
				lLigne.estUnDeploiement = true;
				lLigne.estDeploye = true;
				lPere = lLigne;
			} else if (
				aLigne.getGenre() ===
				TypeGenreLigneRecapDevoisEvalsEleve_1
					.TypeGenreLigneRecapDevoisEvalsEleve.LigneElementComp
			) {
				lLigne.pere = lPere;
			}
			lDonneesAcRegroup.addElement(lLigne);
		});
		return lDonneesAcRegroup;
	}
	_initPiedPage() {
		const lInstancePdP = this.getInstance(this.identPiedPage);
		this.initPiedPage(lInstancePdP);
		lInstancePdP.initialiser(true);
	}
	_clbckValidationAutoSurEdition(aCtx, aParam) {
		let lCtx = $.extend(aCtx, { periode: aParam.periode });
		if (aParam.global === true) {
			lCtx = $.extend(lCtx, { service: null });
		} else {
			let lTypeGenreAppreciation = this.moteur.getTypeGenreAppreciation({
				estCtxPied: true,
				appreciation: aParam.appreciation,
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinParEleve,
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
	_afficherPiedPage(aPiedDePage) {
		if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
			this.getInstance(this.identPiedPage).setDonnees({
				donnees: aPiedDePage,
				options: this.optionsAffichageListe,
			});
		}
	}
	_masquerVisibilitePiedPage(aMasquer) {
		if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
			$("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
				"display",
				aMasquer ? "none" : "",
			);
		}
	}
	_evntSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (
					aParametres.article.getGenre() ===
						TypeGenreLigneRecapDevoisEvalsEleve_1
							.TypeGenreLigneRecapDevoisEvalsEleve.LigneTitreEval &&
					aParametres.declarationColonne.genre ===
						Enumere_Ressource_1.EGenreRessource.Evaluation
				) {
					this.surClicEvaluation(aParametres);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				break;
		}
	}
	surClicEvaluation(aParametre) {
		const lEval =
			DonneesListe_AppreciationsBulletinParEleve_1.DonneesListe_AppreciationsBulletinParEleve.getDevoir(
				aParametre,
			);
		const lPeriode =
			DonneesListe_AppreciationsBulletinParEleve_1.DonneesListe_AppreciationsBulletinParEleve.getPeriode(
				aParametre,
			);
		if (lEval && lEval.listeRelationsESI && lEval.listeRelationsESI.length) {
			new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
				this,
				this._reponseRequeteDetailEvaluations.bind(this, aParametre.article),
			).lancerRequete({
				eleve: this.etatUtilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				),
				pilier: null,
				periode: lPeriode,
				numRelESI: lEval.listeRelationsESI,
			});
		}
	}
	_reponseRequeteDetailEvaluations(aLigne, aJSON) {
		const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
		const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
			this.etatUtilSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			aLigne,
		);
		lFenetre.setDonnees(aLigne, aJSON, { titreFenetre: lTitreParDefaut });
	}
	_getPeriodeAffichee(aTableau, aPeriode) {
		let lPeriode = null;
		aTableau.parcourir((aElement) => {
			if (aElement.periode.getNumero() === aPeriode.getNumero()) {
				lPeriode = aElement;
				return false;
			}
		});
		return lPeriode;
	}
}
exports.InterfaceAppreciationsBulletinParEleve =
	InterfaceAppreciationsBulletinParEleve;
