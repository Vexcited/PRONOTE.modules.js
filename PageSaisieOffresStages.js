exports.PageSaisieOffresStages = void 0;
const ObjetFenetre_EditionOffreStage_1 = require("ObjetFenetre_EditionOffreStage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const DonneesListe_OffresStages_1 = require("DonneesListe_OffresStages");
const PageConsultStage_1 = require("PageConsultStage");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const AccessApp_1 = require("AccessApp");
const GUID_1 = require("GUID");
var EGenreEcran;
(function (EGenreEcran) {
	EGenreEcran["ecranListe"] = "ecranListe";
	EGenreEcran["ecranDetail"] = "ecranDetail";
})(EGenreEcran || (EGenreEcran = {}));
class PageSaisieOffresStages extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this._options = {
			editionOffreStage: {
				avecPeriode: false,
				avecPeriodeUnique: true,
				avecSujetObjetSaisie: true,
				avecGestionPJ: false,
				tailleMaxPieceJointe: 0,
				avecEditionDocumentsJoints: false,
				genreRessourcePJ: 0,
			},
		};
		this._autorisations = { autoriserEditionToutesOffresStages: true };
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: !!IE.estMobile });
		this.contexte = {
			niveauCourant: 0,
			selection: [],
			guidRef: GUID_1.GUID.getId(),
			ecran: [EGenreEcran.ecranListe, EGenreEcran.ecranDetail],
		};
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
		return this;
	}
	setAutorisations(aAutorisations) {
		$.extend(this._autorisations, aAutorisations);
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case EGenreEcran.ecranListe:
				this.afficherEcranListe();
				break;
			case EGenreEcran.ecranDetail:
				this.afficherEcranDetail();
				break;
			default:
		}
	}
	changerEcran(aParams) {
		const lEcranSrc = {
			niveauEcran: aParams.src,
			genreEcran: this.getCtxEcran({ niveauEcran: aParams.src }),
		};
		const lEcranDest = {
			niveauEcran: aParams.dest,
			genreEcran: this.getCtxEcran({ niveauEcran: aParams.dest }),
		};
		if (aParams.data) {
			lEcranSrc.dataEcran = aParams.data;
		}
		super.basculerEcran(lEcranSrc, lEcranDest);
	}
	afficherEcranListe() {
		var _a, _b;
		const lSelection = this.getCtxSelection({ niveauEcran: 0 });
		let lIndice;
		if (lSelection) {
			lIndice = this.listeOffres.getIndiceParElement(lSelection);
		}
		const lListe = this.getInstance(this.identListeOffresFlat);
		lListe.setDonnees(
			new DonneesListe_OffresStages_1.DonneesListe_OffresStages(
				this.listeOffres,
				{
					autoriserEditionToutesOffresStages:
						this._autorisations.autoriserEditionToutesOffresStages,
				},
			),
			lIndice,
		);
		if (IE.estMobile) {
			(_b =
				(_a = this.paramCombo) === null || _a === void 0
					? void 0
					: _a.combo) === null || _b === void 0
				? void 0
				: _b.setVisible(true);
		}
	}
	afficherEcranDetail() {
		var _a, _b, _c;
		const lArticle = this.listeOffres.getElementParNumero(
			(_a = this.getCtxSelection({ niveauEcran: 0 })) === null || _a === void 0
				? void 0
				: _a.getNumero(),
		);
		if (!lArticle) {
			this.getInstance(this.identConsultStage).resetHtml();
			return;
		}
		this.initConsultStage(this.getInstance(this.identConsultStage));
		const lParams = {
			stage: lArticle,
			avecDefinitionStage: true,
			sujetsStage: this.listeSujets,
			callbackAlerteSupprimer: () => {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.suppression.message",
						),
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.suppression.titre",
						),
					})
					.then((aGenreAction) => {
						this._evntSuppressionApresConfirm(
							{ article: lArticle },
							aGenreAction,
						);
					});
			},
			callbackModifier: (aParam) => {
				this._evntEditionConsult(aParam);
			},
			callbackReturnParams: () => {
				return this.getParametresPageSaisie();
			},
		};
		if (IE.estMobile) {
			lParams.callBackRetourEcranPrec = () => {
				if (IE.estMobile) {
					this.changerEcran({ src: 0, dest: 1 });
					if (!this._options.editionOffreStage.avecSujetObjetSaisie) {
						this.callback_evntSaisie(this.paramCombo);
					} else if (this._options.editionOffreStage.avecSujetObjetSaisie) {
						this.callbackRetour();
					}
				}
			};
			(_c =
				(_b = this.paramCombo) === null || _b === void 0
					? void 0
					: _b.combo) === null || _c === void 0
				? void 0
				: _c.setVisible(false);
		}
		this.getInstance(this.identConsultStage).setDonnees(lParams);
	}
	construireInstances() {
		this.identFenetreEdition = this.addFenetre(
			ObjetFenetre_EditionOffreStage_1.ObjetFenetre_EditionOffreStage,
			this._evntFenetreEdition.bind(this),
			this._initFenetreEdition.bind(this),
		);
		this.identListeOffresFlat = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this.initListe,
		);
		this.identConsultStage = this.add(
			PageConsultStage_1.PageConsultStage,
			this.initConsultStage,
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = false;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	initListe(aInstance) {
		let avecOmbre = false;
		!IE.estMobile ? (avecOmbre = true) : (avecOmbre = false);
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecLigneCreation: true,
			forcerOmbreScrollTop: avecOmbre,
			avecOmbreDroite: true,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"OffreStage.MsgAucuneOffre",
			),
			forcerScrollV_mobile: true,
		});
	}
	getParametresPageSaisie() {
		return this._options.editionOffreStage;
	}
	evenementSurListe(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				this.changerEcran({ src: 0, dest: 1, data: aParams.article });
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.ouvrirFenetreCreation();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.suppression.message",
						),
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.suppression.titre",
						),
					})
					.then((aGenerAction) => {
						this._evntSuppressionApresConfirm(aParams, aGenerAction);
					});
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this._evntListeOffres(aParams);
				break;
		}
		this.construireStructureAffichageAutre();
	}
	_evntEditionConsult(aParam) {
		aParam.offre.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.listeOffres.addElement(
			aParam.offre,
			this.listeOffres.getIndiceParNumeroEtGenre(aParam.offre.getNumero()),
		);
		this.lancerSaisie({ offre: aParam.offre });
	}
	_evntListeOffres(aParam) {
		let lOffre;
		switch (aParam.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
				lOffre = this.listeOffres.getElementParElement(aParam.article);
				const lFenetre = this.getInstance(this.identFenetreEdition);
				lFenetre.setOptionsFenetre({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.TitreEdition",
					),
				});
				lFenetre.setDonnees({
					offre: lOffre,
					sujetsStage: this.listeSujets,
					estEnEdition: true,
				});
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.suppression.message",
						),
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.suppression.titre",
						),
					})
					.then((aGenerAction) => {
						this._evntSuppressionApresConfirm(aParam, aGenerAction);
					});
				break;
			default:
				break;
		}
	}
	ouvrirFenetreCreation() {
		this._evntCreation();
	}
	_evntCreation() {
		const lTitre = ObjetTraduction_1.GTraductions.getValeur(
			"OffreStage.Proposer",
		);
		const lFenetre = this.getInstance(this.identFenetreEdition);
		lFenetre.setOptionsFenetre({ titre: lTitre });
		lFenetre.setDonnees({ sujetsStage: this.listeSujets, estEnCreation: true });
	}
	initConsultStage(aInstance) {
		aInstance.setParametres({
			avecPeriode: this._options.editionOffreStage.avecPeriode,
			avecPeriodeUnique: this._options.editionOffreStage.avecPeriodeUnique,
			avecGestionPJ: this._options.editionOffreStage.avecGestionPJ,
			avecSujetObjetSaisie:
				this._options.editionOffreStage.avecSujetObjetSaisie,
			autoriserEditionToutesOffresStages:
				this._autorisations.autoriserEditionToutesOffresStages,
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		if (!IE.estMobile) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "offre-stages-conteneur" },
					IE.jsx.str(
						"div",
						{ class: "liste", style: "max-width:65rem;" },
						IE.jsx.str("div", {
							class: " m-left full-height ",
							style: "min-width:60rem;",
							id: this.getNomInstance(this.identListeOffresFlat),
						}),
					),
					IE.jsx.str(
						"div",
						{ class: "bloc-contain" },
						IE.jsx.str("div", {
							id: this.getInstance(this.identConsultStage).getNom(),
						}),
					),
				),
			);
		} else if (IE.estMobile) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "ecran p-top-xxl full-height" },
					IE.jsx.str(
						"section",
						{
							class: [
								"section",
								this.optionsEcrans.avecBascule ? "mono" : "multi",
							],
							style: "height:100%;",
							id: this.getIdDeNiveau({ niveauEcran: 0 }),
						},
						IE.jsx.str("div", {
							class: "m-left full-height",
							id: this.getNomInstance(this.identListeOffresFlat),
						}),
					),
					IE.jsx.str(
						"aside",
						{
							class: [
								"section",
								"p-x-xl",
								this.optionsEcrans.avecBascule ? "mono" : "multi",
							],
							id: this.getIdDeNiveau({ niveauEcran: 1 }),
						},
						IE.jsx.str("div", {
							class: this.optionsEcrans.avecBascule ? "ecran-visu" : "",
							id: this.getInstance(this.identConsultStage).getNom(),
						}),
					),
				),
			);
		}
		return H.join("");
	}
	setDonnees(aParam) {
		this.paramCombo = aParam.paramCombo;
		if (!this._options.editionOffreStage.avecSujetObjetSaisie) {
			this.callback_evntSaisie = aParam.callback_evntSaisie;
		} else {
			this.callbackRetour = aParam.callbackRetour;
		}
		if (!aParam.listeOffres) {
			aParam.listeOffres = new ObjetListeElements_1.ObjetListeElements();
		}
		this.listeOffres = aParam.listeOffres;
		if (this._options.editionOffreStage.avecSujetObjetSaisie) {
			this.listeSujets = aParam.listeSujets;
		} else {
			this.listeSujets = new ObjetListeElements_1.ObjetListeElements();
		}
		this.changerEcran({ src: null, dest: 0 });
		const lSelection = this.getCtxSelection({ niveauEcran: 0 });
		if (lSelection) {
			this.changerEcran({ src: 0, dest: 1, data: lSelection });
		} else {
			this.getInstance(this.identConsultStage).resetHtml();
		}
	}
	resetSelection() {
		this.setCtxSelection({ niveauEcran: 0, dataEcran: undefined });
	}
	lancerSaisie(aParam) {
		const lParam = {
			listeOffres: this.listeOffres,
			offre: new ObjetElement_1.ObjetElement(),
		};
		$.extend(lParam, aParam);
		this.callback.appel(lParam);
	}
	_initFenetreEdition(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"OffreStage.TitreEdition",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		aInstance.setParametresEditionOffreStage(this._options.editionOffreStage);
	}
	_evntFenetreEdition(aParam) {
		if (aParam.estEnCreation) {
			const lOffre = aParam.offre;
			lOffre.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			this.listeOffres.addElement(lOffre);
			this.lancerSaisie({ offre: lOffre, listeOffres: this.listeOffres });
		} else if (aParam.estEnEdition) {
			aParam.offre.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.listeOffres.addElement(
				aParam.offre,
				this.listeOffres.getIndiceParNumeroEtGenre(aParam.offre.getNumero()),
			);
			this.lancerSaisie({ offre: aParam.offre });
		}
	}
	_evntSuppressionApresConfirm(aParam, aGenreAction) {
		if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
			let lOffre = null;
			if (!!aParam.article) {
				lOffre = this.listeOffres.getElementParElement(aParam.article);
			}
			lOffre.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.resetSelection();
			this.lancerSaisie({ offre: lOffre, listeOffres: this.listeOffres });
		}
	}
}
exports.PageSaisieOffresStages = PageSaisieOffresStages;
