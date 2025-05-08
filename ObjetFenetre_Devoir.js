const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { ObjetDisponibilite } = require("ObjetDisponibilite.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_ParamExecutionQCM,
} = require("ObjetFenetre_ParamExecutionQCM.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const { TypeNote } = require("TypeNote.js");
const { ObjetListe } = require("ObjetListe.js");
const { TypeModeCorrectionQCM } = require("TypeModeCorrectionQCM.js");
const { DonneesListe_DevoirPeriode } = require("DonneesListe_DevoirPeriode.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GDate } = require("ObjetDate.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { ObjetFenetre_SelectionQCM } = require("ObjetFenetre_SelectionQCM.js");
const {
	ObjetFenetre_ActionContextuelle,
} = require("ObjetFenetre_ActionContextuelle.js");
const TypeCallbackFenetreDevoir = { validation: 0, periode: 1, service: 2 };
class ObjetFenetre_Devoir extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.IdCoefficient = this.Nom + "_Coefficient";
		this.IdBareme = this.Nom + "_Bareme";
		this.idPeriodes = this.Nom + "_Periodes";
		this.IdCommentaire = this.Nom + "_Commentaire";
		this.idRattrapageService = this.Nom + "_RattrapageService";
		this.idRattrapageServiceSeuil = this.idRattrapageService + "_Seuil";
		this.idZoneDatePublication = this.Nom + "_zoneDatePublication";
		this.idMessageDetailNotesNonPublie =
			this.Nom + "_messageDetailNotesNonPublie";
		this.idLabelComboCategorie = this.Nom + "_labelComboCategorie";
		this.idLabelSelectionService = this.Nom + "_labelSelectionService";
		this.idLabelComboFacultatif = this.Nom + "_labelComboFacultatif";
		this.idLabelDateValidation = this.Nom + "_DateValidation";
		this.idLabelDatePublication = this.Nom + "_DatePublication";
		this.idInfoPublicationDecaleeParents =
			this.Nom + "_InfoPublicationDecaleeParents";
		this.largeurs = { devoir: 430, rattrapage: 420 };
		this.TypeMrFiche = {
			Bareme: "FenetreDevoir.MFicheBaremeDifferentDe20",
			Facultatif: "FenetreDevoir.MFicheDevoirFacultatif",
		};
		this.addIdentsSelectionService();
		this.addIdentsKiosque();
		this.addIdentsQCM();
		this.addIdentsSujetCorrigeDevoir();
		this.addIdentsGenreNotation();
		this.addIdentsDevoirRattrapage();
		this.GenreEdition = {
			aucune: 0,
			commentaire: 1,
			date: 2,
			coefficient: 3,
			bareme: 4,
			noteSeuilRattrapage: 5,
			rattrapageService: 6,
		};
		this.genreBouton = {
			supprimer: 0,
			rattrapage: 1,
			annuler: 2,
			valider: 3,
			creer: 4,
		};
		this.genreFacultatif = { commeBonus: 0, commeNote: 1, commeSeuil: 2 };
		this.listeFacultatif = new ObjetListeElements();
		this.listeFacultatif.addElement(
			new ObjetElement(
				GTraductions.getValeur("FenetreDevoir.CommeUnBonus"),
				null,
				this.genreFacultatif.commeBonus,
			),
		);
		this.listeFacultatif.addElement(
			new ObjetElement(
				GTraductions.getValeur("FenetreDevoir.CommeUneNote"),
				null,
				this.genreFacultatif.commeNote,
			),
		);
		if (this.avecGenreFacultatifCommeSeuil()) {
			this.listeFacultatif.addElement(
				new ObjetElement(
					GTraductions.getValeur("FenetreDevoir.CommeUnSeuil"),
					null,
					this.genreFacultatif.commeSeuil,
				),
			);
		}
		this.genreEdition = this.GenreEdition.aucune;
		this.avecQCM = true;
		this.avecModifQCM = true;
		this.avecDetailPublicationQCM = true;
		this.avecSelectionService = false;
		this.avecQCMCompetences = false;
		this.avecGenreNotation = false;
		this.avecDevoirRattrapage = false;
		this.avecRattrapageService = false;
		this.nrRattrapageDeService = null;
		this.avecConsigneQCM = true;
		this.avecPersonnalisationProjetAccompagnement = false;
		this.avecModeCorrigeALaDate = false;
		this.avecMultipleExecutions = false;
		this.avecCategorieEvaluation = false;
		this.avecThemes = false;
		this.listeServices = null;
		this.baremeAvecDecimales = false;
		this.setOptionsFenetre({ avecTailleSelonContenu: true });
		this.idBtnAssocierKiosque = this.Nom + "_btnAssocierKiosque";
		this.idBtnAssocierQCM = this.Nom + "_btnAssocierQCM";
		this.maxLengthCommentaire = 20;
		this.initialiserDevoir();
	}
	setNrRattrapageDeService(aValeur) {
		this.nrRattrapageDeService = aValeur;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			estLigneTitreZoneVisible() {
				return aInstance.verifierExistenceDevoirRattrapage(aInstance.devoir);
			},
			getHtmlInfoPublicationDecaleeParents() {
				return aInstance.getHtmlInfoPublicationDecaleeParents();
			},
			cbSujet: {
				getValue() {
					return aInstance._avecSujetDevoir();
				},
				setValue(aValue) {
					if (!aValue && aInstance._avecSujetDevoir()) {
						aInstance.surDemandeSuppressionSujet();
					}
				},
				getDisabled() {
					return (
						!aInstance.Actif || !aInstance.devoir || aInstance.devoir.verrouille
					);
				},
			},
			selectSujetDevoir: function () {
				$(this.node).eventValidation((aEvent) => {
					const lThis = aInstance;
					if (
						aInstance.Actif &&
						aInstance.devoir &&
						!aInstance.devoir.verrouille &&
						!aInstance._avecSujetDevoir()
					) {
						const lTabActions = [];
						lTabActions.push({
							libelle: IE.estMobile
								? GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMesDocuments",
									)
								: GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMonPoste",
									),
							icon: "icon_folder_open",
							selecFile: true,
							optionsSelecFile: { maxSize: lThis.getTailleMaxPieceJointe() },
							event(aParamsInput) {
								if (aParamsInput) {
									lThis.devoir.listeSujets.addElement(
										aParamsInput.eltFichier,
										0,
									);
									lThis.actualiserSujet();
								}
							},
							class: "bg-util-marron-claire",
						});
						const lParams = {
							genre: lThis.getEGenreSujet(),
							listeElements: lThis.devoir.listeSujets,
							callback: lThis.actualiserSujet,
						};
						lTabActions.push({
							libelle: GTraductions.getValeur(
								"fenetre_ActionContextuelle.depuisMonCloud",
							),
							icon: "icon_cloud",
							event: function () {
								lThis.ouvrirPJCloud(lParams);
							}.bind(this),
							class: "bg-util-marron-claire",
						});
						ObjetFenetre_ActionContextuelle.ouvrir(lTabActions, {
							pere: lThis,
						});
						aEvent.stopImmediatePropagation();
						aEvent.preventDefault();
					}
				});
			},
			selecFileSujetDevoir: {
				getOptionsSelecFile: function () {
					return {
						maxSize: aInstance.getTailleMaxPieceJointe(),
						interrompreClick: true,
					};
				},
				addFiles: function (aParams) {
					aInstance.devoir.listeSujets.addElement(aParams.eltFichier, 0);
					aInstance.actualiserSujet();
				},
				getDisabled: function () {
					return (
						!aInstance.Actif ||
						!aInstance.devoir ||
						aInstance.devoir.verrouille ||
						aInstance._avecSujetDevoir()
					);
				},
			},
			cbCorrigeDevoir: {
				getValue: function () {
					return aInstance._avecCorrigeDevoir();
				},
				setValue: function (aValue) {
					if (!aValue && aInstance._avecCorrigeDevoir()) {
						aInstance.surDemandeSuppressionCorrige();
					}
				},
				getDisabled: function () {
					return (
						!aInstance.Actif || !aInstance.devoir || aInstance.devoir.verrouille
					);
				},
			},
			selectCorrigeDevoir: function () {
				$(this.node).eventValidation((aEvent) => {
					const lThis = aInstance;
					if (
						aInstance.Actif &&
						aInstance.devoir &&
						!aInstance.devoir.verrouille &&
						!aInstance._avecCorrigeDevoir()
					) {
						const lTabActions = [];
						lTabActions.push({
							libelle: IE.estMobile
								? GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMesDocuments",
									)
								: GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMonPoste",
									),
							icon: "icon_folder_open",
							selecFile: true,
							optionsSelecFile: { maxSize: lThis.getTailleMaxPieceJointe() },
							event(aParamsInput) {
								if (aParamsInput) {
									lThis.devoir.listeCorriges.addElement(
										aParamsInput.eltFichier,
										0,
									);
									lThis.actualiserCorrige();
								}
							},
							class: "bg-util-marron-claire",
						});
						const lParams = {
							genre: lThis.getEGenreCorrige(),
							listeElements: lThis.devoir.listeCorriges,
							callback: lThis.actualiserCorrige,
						};
						lTabActions.push({
							libelle: GTraductions.getValeur(
								"fenetre_ActionContextuelle.depuisMonCloud",
							),
							icon: "icon_cloud",
							event: function () {
								lThis.ouvrirPJCloud(lParams);
							}.bind(this),
							class: "bg-util-marron-claire",
						});
						ObjetFenetre_ActionContextuelle.ouvrir(lTabActions, {
							pere: lThis,
						});
						aEvent.stopImmediatePropagation();
						aEvent.preventDefault();
					}
				});
			},
			selecFileCorrigeDevoir: {
				getOptionsSelecFile: function () {
					return {
						maxSize: aInstance.getTailleMaxPieceJointe(),
						interrompreClick: true,
					};
				},
				addFiles: function (aParams) {
					aInstance.devoir.listeCorriges.addElement(aParams.eltFichier, 0);
					aInstance.actualiserCorrige();
				},
				getDisabled: function () {
					return (
						!aInstance.Actif ||
						!aInstance.devoir ||
						aInstance.devoir.verrouille ||
						aInstance._avecCorrigeDevoir()
					);
				},
			},
			cbCorrigeQCM: {
				getValue: function () {
					let lEstCoche = false;
					if (!!aInstance.devoir && !!aInstance.devoir.executionQCM) {
						if (aInstance.devoir.executionQCM.publierCorrige === undefined) {
							aInstance.devoir.executionQCM.publierCorrige =
								aInstance.devoir.executionQCM.modeDiffusionCorrige !==
								TypeModeCorrectionQCM.FBQ_CorrigeSans;
						}
						lEstCoche = !!aInstance.devoir.executionQCM.publierCorrige;
					}
					return lEstCoche;
				},
				setValue: function (aValue) {
					if (!!aInstance.devoir && !!aInstance.devoir.executionQCM) {
						aInstance.devoir.executionQCM.publierCorrige = aValue;
						aInstance.devoir.executionQCM.setEtat(EGenreEtat.Modification);
					}
				},
				getDisabled: function () {
					return (
						!aInstance.Actif || !aInstance.devoir || aInstance.devoir.verrouille
					);
				},
			},
			btnAssocierQCM: {
				event: function () {
					aInstance.evenementSurBtnAssocierQCM();
				},
			},
			btnAssocierKiosque: {
				event: function () {
					aInstance.evenementSurBtnAssocierKiosque();
				},
			},
			cbEvaluationAssociee: {
				getValue: function () {
					return !!aInstance.devoir && !!aInstance.devoir.evaluation
						? !!aInstance.devoir.evaluation.listeCompetences &&
								aInstance.devoir.evaluation.listeCompetences.getNbrElementsExistes() >
									0
						: false;
				},
				setValue: function (aChecked) {
					if (!!aInstance.devoir) {
						if (aChecked) {
							this.controleur.competencesEvaluees.btnModifierCompetences.event();
						} else {
							aInstance.evenementSurSuppressionEvaluationAssociee();
						}
					}
				},
			},
			labelEvaluationAssociee: function () {
				return !!aInstance.devoir &&
					aInstance.devoir.getEtat() === EGenreEtat.Creation
					? GTraductions.getValeur("FenetreDevoir.CreerEvaluation")
					: GTraductions.getValeur("FenetreDevoir.EvaluationAssociee");
			},
			cbEvaluationDuQCM: {
				getValue: function () {
					return !!aInstance.devoir &&
						!!aInstance.devoir.executionQCM &&
						aInstance.devoir.executionQCM.QCM &&
						aInstance.devoir.executionQCM.QCM.nbCompetencesTotal > 0
						? !!aInstance.devoir.executionQCM.estLieAEvaluation
						: false;
				},
				setValue: function (aChecked) {
					if (!!aInstance.devoir && !!aInstance.devoir.executionQCM) {
						aInstance.devoir.executionQCM.estLieAEvaluation = aChecked;
						aInstance.devoir.executionQCM.setEtat(EGenreEtat.Modification);
					}
				},
			},
			cbSansDoublon: {
				getValue: function () {
					return !!aInstance.devoir &&
						!!aInstance.devoir.executionQCM &&
						aInstance.devoir.executionQCM.QCM &&
						aInstance.devoir.executionQCM.QCM.nbCompetencesTotal > 0
						? !!aInstance.devoir.executionQCM.sansDoublon
						: true;
				},
				setValue: function (aChecked) {
					if (!!aInstance.devoir && !!aInstance.devoir.executionQCM) {
						aInstance.devoir.executionQCM.sansDoublon = aChecked;
						aInstance.actualiserCompetencesDeServiceEtQcm(
							aInstance.devoir.executionQCM,
						);
					}
				},
			},
			competencesEvaluees: {
				estVisible: function () {
					return this.controleur.cbEvaluationAssociee.getValue();
				},
				avecCompetencesClassique: function () {
					return !this.controleur.competencesEvaluees.avecCompetencesDeQCM();
				},
				avecCompetencesDeQCM: function () {
					const lExecutionQCM = !!aInstance.devoir
						? aInstance.devoir.executionQCM
						: null;
					const lEstUnQCMAvecCompetences =
						!!lExecutionQCM &&
						!!lExecutionQCM.QCM &&
						lExecutionQCM.QCM.nbCompetencesTotal > 0;
					const lAuMoinsUneCompetenceEstCompatiblePourService =
						!!lExecutionQCM &&
						!!lExecutionQCM.listeCompetences &&
						lExecutionQCM.listeCompetences.count() > 0;
					return (
						lEstUnQCMAvecCompetences &&
						lAuMoinsUneCompetenceEstCompatiblePourService
					);
				},
				btnModifierCompetences: {
					event: function () {
						aInstance.evenementSurBtnCompetencesEvaluees();
					},
				},
			},
			btnCategorie: {
				event: function () {
					aInstance.evenementSurBtnCategorie();
				},
				estVisible: function () {
					return (
						aInstance.Actif &&
						aInstance.devoir &&
						!aInstance.devoir.verrouille &&
						!aInstance.cloture
					);
				},
			},
			btnMrFiche: {
				event: function (aTypeMrFiche) {
					if (!GApplication.getMessage().EnAffichage) {
						GApplication.getMessage().afficher({ idRessource: aTypeMrFiche });
					}
				},
				getTitle: function (aTypeMrFiche) {
					return GTraductions.getTitreMFiche(aTypeMrFiche);
				},
			},
			btnParametrerQCM: {
				event: function () {
					aInstance.ouvrirFenetreParametresQCM();
				},
				getTitle: function () {
					return GTraductions.getValeur("FenetreDevoir.ParametresExeQCMDevoir");
				},
			},
			cbRamenerSur20: {
				getValue: function () {
					return !!aInstance.devoir && !!aInstance.devoir.ramenerSur20;
				},
				setValue: function (aValeur) {
					if (!!aInstance.devoir) {
						aInstance.devoir.ramenerSur20 = aValeur;
					}
				},
				getDisabled: function () {
					let lEstEditable = false;
					if (
						!aInstance.cloture &&
						!!aInstance.Actif &&
						!!aInstance.devoir &&
						!aInstance.devoir.verrouille &&
						!aInstance.estUnRattrapageDeService()
					) {
						if (!!aInstance.baremeService && !!aInstance.devoir.bareme) {
							lEstEditable =
								aInstance.baremeService.getValeur() !==
								aInstance.devoir.bareme.getValeur();
						}
					}
					return !lEstEditable;
				},
				getLibelle: function () {
					let lStrBaremeDuService = "";
					if (!!aInstance.baremeService) {
						lStrBaremeDuService = aInstance.baremeService.getValeur();
					}
					return GTraductions.getValeur("FenetreDevoir.Ramenersur20", [
						lStrBaremeDuService,
					]);
				},
			},
			cbFacultatif: {
				getValue: function () {
					const lDevoir = aInstance.devoir;
					return (
						!!lDevoir &&
						(!!lDevoir.commeUnBonus ||
							!!lDevoir.commeUneNote ||
							!!lDevoir.commeUnSeuil)
					);
				},
				setValue: function (aValeur) {
					if (!!aInstance.devoir) {
						if (!aValeur) {
							aInstance.devoir.commeUnBonus = false;
							aInstance.devoir.commeUneNote = false;
							aInstance.devoir.commeUnSeuil = false;
						} else {
							const lSelectionCombo = aInstance.getInstance(
								aInstance.idComboFacultatif,
							).Selection;
							const lGenreFacultatif = aInstance.listeFacultatif
								.get(lSelectionCombo)
								.getGenre();
							aInstance.devoir.commeUneNote =
								lGenreFacultatif === aInstance.genreFacultatif.commeNote;
							aInstance.devoir.commeUnBonus =
								lGenreFacultatif === aInstance.genreFacultatif.commeBonus;
							aInstance.devoir.commeUnSeuil =
								lGenreFacultatif === aInstance.genreFacultatif.commeSeuil;
						}
					}
				},
				getDisabled: function () {
					let lEstEditable = false;
					if (
						!aInstance.cloture &&
						!!aInstance.Actif &&
						!!aInstance.devoir &&
						!aInstance.devoir.verrouille &&
						!aInstance.estUnRattrapageDeService()
					) {
						lEstEditable = true;
					}
					return !lEstEditable;
				},
			},
			getStyleCarreFacultatif: function () {
				let lCouleurFacultatif = "transparent";
				if (!!aInstance.devoir) {
					if (aInstance.devoir.commeUnBonus) {
						lCouleurFacultatif = GCouleur.devoir.commeUnBonus;
					} else if (aInstance.devoir.commeUneNote) {
						lCouleurFacultatif = GCouleur.devoir.commeUneNote;
					} else if (aInstance.devoir.commeUnSeuil) {
						lCouleurFacultatif = GCouleur.devoir.commeUnSeuil;
					}
				}
				return { "background-color": lCouleurFacultatif };
			},
			cbDevoirVerrouille: {
				getValue: function () {
					return !!aInstance.devoir && !!aInstance.devoir.verrouille;
				},
				setValue: function (aValeur) {
					if (!!aInstance.devoir) {
						aInstance.devoir.verrouille = aValeur;
						aInstance.actualiser();
					}
				},
				getDisabled: function () {
					const lEstEditable = !!aInstance.Actif;
					return !lEstEditable;
				},
			},
			estVerrouillageVisible: function () {
				return !aInstance.enCreation;
			},
			estDevoirVerrouille: function () {
				return !!aInstance.devoir && !!aInstance.devoir.verrouille;
			},
		});
	}
	ouvrirPJCloud() {}
	construireInstances() {
		this.identDateDevoir = this.add(
			ObjetCelluleDate,
			this._evenementSurDateDevoir,
			this.initialiserDateDevoir,
		);
		this.identDatePublication = this.add(
			ObjetCelluleDate,
			this._evenementSurDatePublication,
			this.initialiserDatePublication,
		);
		this.identPeriodes = this.add(ObjetListe, this._evenementSurPeriodes, null);
		this.idComboFacultatif = this.add(
			ObjetSaisie,
			this.eventComboFacultatif,
			this.initComboFacultatif,
		);
		if (
			GEtatUtilisateur.avecRessourcesEnvoiNote &&
			GEtatUtilisateur.activerKiosqueEnvoiNote
		) {
			this.addInstancesKiosque();
		}
		if (this.avecQCM) {
			this.addInstancesQCM();
		}
		if (this.avecSelectionService) {
			this.addInstancesSelectionService();
		}
		if (this.avecGenreNotation) {
			this.addInstancesGenreNotation();
		}
		if (this.avecDevoirRattrapage) {
			this.addInstancesDevoirRattrapage();
		}
		if (this.avecQCMCompetences) {
			this.identListeCompetencesQCM = this.add(
				ObjetListe,
				this.evenementSurListeCompetencesQCM,
				this.initialiserListeCompetencesQCM,
			);
		}
		if (this.avecCategorieEvaluation) {
			this.idComboCategorie = this.add(
				ObjetSaisie,
				this.eventComboCategorie,
				this.initComboCategorie,
			);
		}
		if (this.avecThemes) {
			this.addInstanceThemes();
		}
	}
	detruireInstances() {
		this.fermer();
	}
	getLibellePublic() {
		return "";
	}
	getHtmlInfoPublicationDecaleeParents() {
		return "";
	}
	initialiserListeCompetencesQCM() {}
	evenementSurListeCompetencesQCM() {}
	avecBorneSurDateSaisissable() {
		return true;
	}
	initialiserDateDevoir(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			largeurBouton: 100,
			labelledById: this.idLabelDateValidation,
		});
		if (!this.avecBorneSurDateSaisissable()) {
			aInstance.setOptionsObjetCelluleDate({
				premiereDate: null,
				derniereDate: null,
			});
		}
	}
	initialiserDatePublication(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			labelledById: this.idLabelDatePublication,
			describedById: this.idInfoPublicationDecaleeParents,
		});
		if (!this.avecBorneSurDateSaisissable()) {
			aInstance.setOptionsObjetCelluleDate({
				premiereDate: null,
				derniereDate: null,
			});
		}
	}
	initComboFacultatif(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 150,
			labelledById: this.idLabelComboFacultatif,
		});
	}
	initComboCategorie(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 207,
			getContenuCellule: function (aElement) {
				return { libelleHtml: _composeLibelleCategorie(aElement) };
			},
			getContenuElement: function (aParams) {
				return _composeLibelleCategorie(aParams.element);
			},
			labelledById: this.idLabelComboCategorie,
		});
	}
	setDonnees(
		aDevoir,
		aEnCreation,
		aListeServices,
		aBaremeService,
		aAvecDetailPublicationQCM,
		aListeCategories,
	) {
		this.devoirOriginel = aDevoir;
		this.devoir = MethodesObjet.dupliquer(aDevoir);
		this.avecDetailPublicationQCM =
			aAvecDetailPublicationQCM !== null &&
			aAvecDetailPublicationQCM !== undefined
				? aAvecDetailPublicationQCM
				: true;
		this.actualiserSelectionService(aListeServices);
		let lTitre = "";
		lTitre +=
			(aEnCreation
				? GTraductions.getValeur("Notes.CreerDevoir")
				: GTraductions.getValeur("Notes.ModificationDevoir")) + " : ";
		if (this.avecSousMatiere && !this.devoir.service.estUnService) {
			lTitre += this.devoir.service.matiere.getLibelle() + " (";
		}
		lTitre += this.devoir.service.estUnService
			? this.devoir.service.matiere.getLibelle()
			: this.devoir.service.pere.matiere.getLibelle();
		if (this.avecSousMatiere && !this.devoir.service.estUnService) {
			lTitre += ")";
		}
		lTitre += " - " + this.getLibellePublic();
		this.setOptionsFenetre({
			titre: "<span ie-ellipsis>" + lTitre + "</span>",
		});
		this.baremeService = aBaremeService
			? aBaremeService
			: GParametres.baremeNotation;
		this.getInstance(this.idComboFacultatif).setDonnees(this.listeFacultatif);
		if (this.avecCategorieEvaluation) {
			if (!aListeCategories || aListeCategories.count() === 0) {
				this.actualiserCategorieEvaluation();
			} else {
				this.listeCategories = aListeCategories;
				this.getInstance(this.idComboCategorie).setDonnees(
					this.listeCategories,
				);
			}
		}
		if (this.avecThemes) {
			this.getInstance(this.identMultiSelectionTheme).setDonnees(
				this.devoir.ListeThemes || new ObjetListeElements(),
				this.avecSousMatiere && !this.devoir.service.estUnService
					? this.devoir.service.pere.matiere
					: this.devoir.service.matiere,
				this.devoir.libelleCBTheme,
			);
		}
		this.enCreation = aEnCreation;
		this.actualiser();
		this.actualiserDevoirRattrapage();
		this.afficher();
		const lClasse = new ObjetListeElements();
		for (let i = 0, lNbr = this.devoir.listeClasses.count(); i < lNbr; i++) {
			if (!this._estUnGroupe(this.devoir.listeClasses.get(i))) {
				lClasse.add(this.devoir.listeClasses.get(i));
			}
		}
		this.getInstance(this.identPeriodes).setDonnees(
			new DonneesListe_DevoirPeriode(lClasse, {
				instance: this.getInstance(this.identPeriodes),
				nbrColonnesPeriodes: this.getNbrColonnesPeriodes(),
				regrouperPeriodes: this.regrouperPeriodes,
			}),
		);
		if (
			!!this.devoir &&
			!!this.devoir.executionQCM &&
			!!this.devoir.executionQCM.QCM &&
			this.devoir.executionQCM.QCM.nbCompetencesTotal > 0
		) {
			this.actualiserCompetencesDeServiceEtQcm(this.devoir.executionQCM);
		}
		$("#" + this.Nom.escapeJQ())
			.off({ keypress: this.surKeyPress })
			.on({ keypress: this.surKeyPress }, { instance: this });
	}
	setActif(aActif, aCloture, aClotureGlobal) {
		this.Actif = aActif;
		this.cloture = aCloture;
		this.clotureGlobal = aClotureGlobal;
	}
	composeContenu() {
		const T = [];
		T.push(`<div class="flex-contain flex-gap-xl">`);
		T.push(
			`<div class="flex-contain cols" style="width: ${this.largeurs.devoir}px;">`,
		);
		T.push(
			`<div class="flex-contain m-bottom-l" ie-if="estVerrouillageVisible">\n            <ie-checkbox ie-model="cbDevoirVerrouille">${GTraductions.getValeur("FenetreDevoir.Verrouille")}</ie-checkbox>\n            <div class="locked-contain" ie-if="estDevoirVerrouille">\n                <i class="icon_lock locked"></i>\n            </div>\n          </div>`,
		);
		if (this.avecQCM) {
			T.push(
				`<div id="${this.identZoneQCM}">${this.composeAssociationDevoirQCM()}</div>`,
			);
		}
		T.push(
			'<h4 class="titre-bloc" ie-if="estLigneTitreZoneVisible()">',
			this.getLibelleDevoirInitial(),
			"</h4>",
		);
		if (this.avecSelectionService) {
			T.push(
				`<div id="${this.identZoneSelectionService}">${this.composeSelectionService()}</div>`,
			);
		}
		T.push(
			`<div class="field-contain as-grid" style="--width-bloc : 9.5rem;">\n              <label id="${this.idLabelDateValidation}">${GTraductions.getValeur("FenetreDevoir.DevoirDu")}</label>\n              <div id="${this.getInstance(this.identDateDevoir).getNom()}"></div>\n            </div>`,
		);
		T.push(`<div class="flex-contain flex-start">`);
		T.push(
			`  <div id="${this.idZoneDatePublication}" class="fix-bloc field-contain as-grid">\n                <label id="${this.idLabelDatePublication}">${GTraductions.getValeur("FenetreDevoir.NotePublieeLe")}: </label>\n                <div id="${this.getInstance(this.identDatePublication).getNom()}"></div>\n              </div>`,
		);
		T.push(
			`  <div class="field-contain fluid-bloc">\n                <p class="message" id="${this.idInfoPublicationDecaleeParents}" ie-html="getHtmlInfoPublicationDecaleeParents"></p>\n              </div>`,
		);
		T.push(`</div>`);
		T.push(`<div class="flex-contain cols" style="padding-left:9.5rem;">`);
		T.push(`<div id="${this.idSujet}" class="field-contain selecfile"></div>`);
		T.push(
			`<div id="${this.idCorrige}" class="field-contain selecfile"></div>`,
		);
		T.push(`</div>`);
		T.push(this.composeCommentaireSurNote());
		T.push(this.composePeriodes());
		if (this.avecGenreNotation) {
			T.push(this.composeGenreNotation());
		}
		T.push('<div class="field-contain">');
		T.push(
			this.composeLigneSaisie(
				GTraductions.getValeur("FenetreDevoir.Bareme"),
				this.IdBareme,
				this.GenreEdition.bareme,
				"Gras m-right-l",
				null,
				3 + (this.baremeAvecDecimales ? 1 + TypeNote.decimalNotation : 0),
				45,
			),
		);
		T.push(
			this.composeLigneSaisie(
				GTraductions.getValeur("FenetreDevoir.Coefficient"),
				this.IdCoefficient,
				this.GenreEdition.coefficient,
				"Gras m-right-l",
				this.TypeMrFiche.Bareme,
				7,
				62,
			),
		);
		T.push("</div>");
		T.push(
			'<div class="field-contain">',
			'<ie-checkbox ie-model="cbRamenerSur20"></ie-checkbox>',
			"</div>",
		);
		T.push(
			'<div class="field-contain m-bottom-xl">',
			composeFacultatif.call(this),
			"</div>",
		);
		if (this.avecCategorieEvaluation) {
			T.push(
				`<div class="field-contain">\n                <label id="${this.idLabelComboCategorie}">${GTraductions.getValeur("FenetreDevoir.Categorie")}</label>\n                <div id="${this.getInstance(this.idComboCategorie).getNom()}"></div>\n                <ie-bouton aria-labelledby="${this.idLabelComboCategorie}" class="m-left-l" ie-model="btnCategorie" ie-display="btnCategorie.estVisible">...</ie-bouton>\n              </div>`,
			);
		}
		if (
			GEtatUtilisateur.avecRessourcesEnvoiNote &&
			GEtatUtilisateur.activerKiosqueEnvoiNote
		) {
			T.push(
				'<div id="',
				this.identZoneKiosque,
				'" class="flex-contain cols">' +
					this.composeAssociationDevoirKiosque() +
					"</div>",
			);
		}
		T.push(this.composeDevoirSurveille());
		T.push(
			`<div class="field-contain">\n\n        <input id="${this.IdCommentaire}" class="round-style fluid-bloc full-width" maxlength="${this.getTailleMaxCommentaire()}" placeholder="${GTraductions.getValeur("FenetreDevoir.RedigezVotreCommentaire")}, ${GTraductions.getValeur("FenetreDevoir.VisibleParEleves")}" onfocus="${this.Nom}.surFocus (id, ${this.GenreEdition.commentaire})" onblur="${this.Nom}.surBlur (id)" onkeypress="if (GNavigateur.IsToucheRetourChariot ()) {${this.Nom}.surBlur (id);${this.Nom}.surFocus (id, ${this.GenreEdition.commentaire})}"></input>\n        </div>`,
		);
		if (this.avecThemes) {
			T.push(
				`<div class="field-contain flex-contain flex-center">\n                <label class="fix-bloc">${GTraductions.getValeur("Themes")} : </label>\n                <div class="constrained-bloc" id="${this.getInstance(this.identMultiSelectionTheme).getNom()}" ></div>\n              </div>`,
			);
		}
		T.push(
			`<div id="${this.idMessageDetailNotesNonPublie}" class="field-contain Italique">${GTraductions.getValeur("FenetreDevoir.DetailNotesNonPublie")}</div>`,
		);
		if (this.avecRattrapageService) {
			T.push(
				'<div class="field-contain">',
				this.composeRattrapageService(),
				"</div>",
			);
		}
		const lCompetencesEvaluees = this.composeCompetencesEvaluees();
		if (!!lCompetencesEvaluees) {
			T.push(lCompetencesEvaluees);
		}
		T.push("</div>");
		if (this.avecDevoirRattrapage) {
			T.push(
				'<div class="fix-bloc p-left-xl" id="' +
					this.idWrapperDevoirRattrap +
					'" style="display:none; width: ',
				this.largeurs.rattrapage,
				'px;padding-top:2.2rem;">',
				this.composeDevoirRattrapage(),
				"</div>",
			);
		}
		T.push("</div>");
		return T.join("");
	}
	composeRattrapageService() {
		const T = [];
		return T.join("");
	}
	getLibelleDevoirInitial() {
		return "";
	}
	composeDevoirSurveille() {
		return "";
	}
	composeCompetencesEvaluees() {
		return "";
	}
	avecGenreFacultatifCommeSeuil() {
		return false;
	}
	getNbrColonnesPeriodes() {
		return this.regrouperPeriodes ? 1 : 2;
	}
	_estUnGroupe() {}
	composeCommentaireSurNote() {
		return "";
	}
	composePeriodes() {
		const T = [];
		T.push(
			'<div class="field-contain p-top-l p-bottom-l" id="',
			this.getInstance(this.identPeriodes).getNom(),
			'"></div>',
		);
		return T.join("");
	}
	getIdPeriode(I, J) {
		return this.Nom + "_" + I + "_" + J;
	}
	composeLigneSaisie(
		ATitre,
		AId,
		aGenreEdition,
		aClass,
		aTypeMonsieurFiche,
		aMaxLength,
		aInputWidth,
	) {
		const lMaxLength = aMaxLength ? aMaxLength : 40;
		const T = [];
		T.push('<div id="', AId, '_" class="flex-contain flex-center">');
		if (ATitre) {
			T.push('<label  for="', AId, '">', ATitre, "</label>");
		}
		T.push(
			'<input type="text" maxlength="',
			lMaxLength,
			'" id="' +
				AId +
				'" class="round-style ' +
				(aClass ? " " + aClass : "") +
				'" onfocus="' +
				this.Nom +
				".surFocus (id, " +
				aGenreEdition +
				')" onblur="' +
				this.Nom +
				'.surBlur (id)" onkeypress="if (GNavigateur.isToucheRetourChariot ()) {' +
				this.Nom +
				".surBlur (id); " +
				this.Nom +
				".surFocus (id, " +
				aGenreEdition +
				')}" ' +
				(aInputWidth ? ' style="width:' + aInputWidth + 'px;"' : "") +
				" />",
		);
		if (aTypeMonsieurFiche) {
			T.push(
				`<ie-btnicon ie-model="btnMrFiche('${aTypeMonsieurFiche}')" class="m-left icon_question bt-activable"></ie-btnicon>`,
			);
		}
		T.push("</div>");
		return T.join("");
	}
	surFocus(aId, aGenreEdition) {
		this.genreEdition = aGenreEdition;
		GHtml.setSelectionEdit(aId);
	}
	surBlur(aId) {
		this.genreEdition = this.GenreEdition.aucune;
		this.surEdition(aId);
	}
	getBaremeMaximal() {
		return GParametres.baremeMaxDevoirs
			? GParametres.baremeMaxDevoirs.getValeur()
			: 100.0;
	}
	surEdition(AId) {
		let lNote;
		if (AId === this.IdCoefficient) {
			lNote = this.controlerNote(this.IdCoefficient, 0.0, 99.0);
			if (lNote) {
				this.devoir.coefficient = lNote;
			}
		}
		let lThis;
		if (AId === this.IdBareme) {
			lNote = this.controlerNote(this.IdBareme, 1.0, this.getBaremeMaximal());
			if (
				lNote &&
				lNote.getValeur() < this.devoir.bareme.getValeur() &&
				!this.enCreation
			) {
				if (!GApplication.getMessage().EnAffichage) {
					lThis = this;
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Confirmation,
						message:
							GTraductions.getValeur(
								"FenetreDevoir.AvertissementChangementDeBareme1",
								[lNote.getValeur()],
							) +
							"<br />" +
							(this.avecDevoirRattrapage &&
							this.verifierExistenceDevoirRattrapage(this.devoir) &&
							lNote.getValeur() <
								this.devoir.devoirRattrapage.noteSeuil.getValeur()
								? GTraductions.getValeur(
										"FenetreDevoir.AvertissementChangementDeBareme2",
									) + "<br />"
								: "") +
							"<br />" +
							GTraductions.getValeur(
								"FenetreDevoir.ConfirmerChangementDeBareme",
							),
						callback: function (aBouton) {
							if (aBouton === 0) {
								lThis.devoir.bareme = lNote;
								if (
									lThis.avecDevoirRattrapage &&
									lThis.verifierExistenceDevoirRattrapage(lThis.devoir) &&
									lNote.getValeur() <
										lThis.devoir.devoirRattrapage.noteSeuil.getValeur()
								) {
									lThis.devoir.devoirRattrapage.noteSeuil = lNote;
								}
							}
							lThis.actualiser();
						},
					});
				}
				return;
			} else if (
				lNote &&
				this.avecDevoirRattrapage &&
				this.verifierExistenceDevoirRattrapage(this.devoir) &&
				lNote.getValeur() < this.devoir.devoirRattrapage.noteSeuil.getValeur()
			) {
				if (!GApplication.getMessage().EnAffichage) {
					lThis = this;
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Confirmation,
						message:
							GTraductions.getValeur(
								"FenetreDevoir.AvertissementChangementDeBareme2",
							) +
							"<br />" +
							"<br />" +
							GTraductions.getValeur(
								"FenetreDevoir.ConfirmerChangementDeBareme",
							),
						callback: function (aBouton) {
							if (aBouton === 0) {
								lThis.devoir.bareme = lNote;
								lThis.devoir.devoirRattrapage.noteSeuil = lNote;
							}
							lThis.actualiser();
						},
					});
				}
				return;
			} else if (lNote) {
				this.devoir.bareme = lNote;
			}
		}
		if (AId === this.idRattrapageServiceSeuil && this.avecRattrapageService) {
			this.mettreAJourRattrapageServiceSeuil();
		}
		if (AId === this.IdCommentaire) {
			this.devoir.commentaire = GHtml.getValue(this.IdCommentaire);
		}
		if (this.avecDevoirRattrapage) {
			this.surEditionRattrapage(AId);
		}
		this.actualiser();
	}
	surEditionRattrapage() {}
	mettreAJourRattrapageServiceSeuil() {}
	_evenementSurDateDevoir(aDate) {
		this.devoir.date = aDate;
		this.devoir.datePublication = this.devoir.date;
		this.evenementSurDateDevoir(aDate);
		this.actualiser();
	}
	_evenementSurDatePublication(aDate) {
		this.devoir.datePublication = aDate;
		this.evenementSurDatePublication(aDate);
		this.actualiser();
	}
	evenementSurDatePublication() {}
	_evenementSurPeriodes(aParamEvnt) {
		switch (aParamEvnt.genreEvenement) {
			case EGenreEvenementListe.Selection:
				if (aParamEvnt.colonne > 0) {
					if (this.regrouperPeriodes) {
						this.surSelectionPeriode(aParamEvnt.ligne, -1, aParamEvnt.article);
					} else {
						this.surSelectionPeriode(
							aParamEvnt.ligne,
							aParamEvnt.colonne - 1,
							aParamEvnt.article,
						);
					}
				}
				break;
			default:
				break;
		}
	}
	eventComboFacultatif(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.devoir.commeUneNote =
				aParams.element.getGenre() === this.genreFacultatif.commeNote;
			this.devoir.commeUnBonus =
				aParams.element.getGenre() === this.genreFacultatif.commeBonus;
			this.devoir.commeUnSeuil =
				aParams.element.getGenre() === this.genreFacultatif.commeSeuil;
			this.actualiser();
		}
	}
	eventComboCategorie(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.devoir.categorie = aParams.element;
			this.actualiser();
		}
	}
	controlerNote(aId, aMin, aMax) {
		const lNote = new TypeNote(GHtml.getValue(aId));
		const lNoteMin = new TypeNote(aMin);
		const lNoteMax = new TypeNote(aMax);
		const lEstValide = lNote.estUneNoteValide(lNoteMin, lNoteMax, false, false);
		if (!lEstValide) {
			if (!GApplication.getMessage().EnAffichage) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GChaine.format(
						GTraductions.getValeur("FenetreDevoir.ValeurComprise"),
						[lNoteMin, lNoteMax],
					),
				});
			}
		}
		return lEstValide ? lNote : null;
	}
	estUnRattrapageDeService() {
		return false;
	}
	existeNotesEleveSurRattrapage() {
		return false;
	}
	actualiserCompetencesDeServiceEtQcm() {}
	actualiser() {
		this.getInstance(this.identDateDevoir).setDonnees(this.devoir.date);
		GHtml.setValue(this.IdCoefficient, this.devoir.coefficient.getNote());
		let lBareme = this.devoir.bareme.getValeur();
		if (this.baremeAvecDecimales) {
			if (lBareme !== Math.floor(lBareme)) {
				lBareme = this.devoir.bareme.getNote();
			}
		}
		GHtml.setValue(this.IdBareme, lBareme);
		this.getInstance(this.idComboFacultatif).setActif(
			this.devoir.commeUnBonus ||
				this.devoir.commeUneNote ||
				this.devoir.commeUnSeuil,
		);
		let lIndiceComboFacultatif = this.genreFacultatif.commeBonus;
		if (this.devoir.commeUneNote) {
			lIndiceComboFacultatif = this.genreFacultatif.commeNote;
		} else if (this.devoir.commeUnSeuil) {
			lIndiceComboFacultatif = this.genreFacultatif.commeSeuil;
		}
		this.getInstance(this.idComboFacultatif).initSelection(
			this.listeFacultatif.getIndiceParNumeroEtGenre(
				null,
				lIndiceComboFacultatif,
			),
		);
		GHtml.setValue(this.IdCommentaire, this.devoir.commentaire);
		if (!this.enCreation) {
			this.setBoutonActif(
				this.genreBouton.supprimer,
				!this.devoir.verrouille && !this.clotureGlobal,
			);
		}
		this.setBoutonVisible(
			this.genreBouton.rattrapage,
			this.avecDevoirRattrapage &&
				(!this.devoir.devoirRattrapage ||
					!this.devoir.devoirRattrapage.existe() ||
					!this.devoir.devoirRattrapage.existeNumero()),
		);
		const leDevoirAUneEvaluationAvecPeriodeCloturee =
			!!this.devoir.evaluation &&
			this.leDevoirEstSurUnePeriodeClotureePourEvaluation(this.devoir);
		this.getInstance(this.identDateDevoir).setActif(
			!(
				this.cloture ||
				!this.Actif ||
				this.devoir.verrouille ||
				leDevoirAUneEvaluationAvecPeriodeCloturee
			),
		);
		GHtml.setDisabled(
			this.IdCoefficient,
			this.cloture ||
				!this.Actif ||
				this.devoir.verrouille ||
				!!this.devoir.coeffVerrouille ||
				this.estUnRattrapageDeService(),
		);
		GHtml.setDisabled(
			this.IdBareme,
			this.cloture ||
				!this.Actif ||
				this.devoir.verrouille ||
				!!this.devoir.baremeVerrouille,
		);
		this.getInstance(this.idComboFacultatif).setActif(
			!(
				this.cloture ||
				!this.Actif ||
				this.devoir.verrouille ||
				this.estUnRattrapageDeService()
			),
		);
		GHtml.setDisabled(
			this.IdCommentaire,
			this.cloture ||
				!this.Actif ||
				this.devoir.verrouille ||
				!!this.devoir.commentaireVerrouille,
		);
		if (this.avecCategorieEvaluation) {
			this.getInstance(this.idComboCategorie).setActif(
				!(
					this.cloture ||
					!this.Actif ||
					this.devoir.verrouille ||
					this.estUnRattrapageDeService()
				),
			);
		}
		if (this.avecRattrapageService) {
			this.actualiserServiceRattrapage();
		}
		let lAvecDetailNotesNonPublie = false;
		if (
			!!this.devoir &&
			!!this.devoir.service &&
			!!this.devoir.service.avecDetailNotesNonPublie
		) {
			lAvecDetailNotesNonPublie = true;
		}
		GHtml.setDisplay(this.idZoneDatePublication, !lAvecDetailNotesNonPublie);
		GHtml.setDisplay(
			this.idMessageDetailNotesNonPublie,
			!!lAvecDetailNotesNonPublie,
		);
		this.getInstance(this.identDatePublication).setPremiereDateSaisissable(
			this.devoir.date,
		);
		this.getInstance(this.identDatePublication).setDonnees(
			this.devoir.datePublication,
		);
		this.getInstance(this.identDatePublication).setActif(
			this.Actif &&
				!this.devoir.verrouille &&
				!leDevoirAUneEvaluationAvecPeriodeCloturee,
		);
		const lNbr = this.devoir.listeClasses.count();
		for (let I = 0; I < lNbr; I++) {
			const lClasse = this.devoir.listeClasses.get(I);
			const lNbr2 = this.getNbrColonnesPeriodes();
			for (let J = 0; J < lNbr2; J++) {
				const lPeriode = lClasse.listePeriodes.get(J);
				if (lPeriode) {
					GHtml.setDisabled(
						this.getIdPeriode(I, J),
						(lPeriode.getNumero() && !lPeriode.getActif()) ||
							this.devoir.verrouille,
					);
				}
			}
		}
		this.getInstance(this.identPeriodes).actualiser();
		if (
			GEtatUtilisateur.avecRessourcesEnvoiNote &&
			GEtatUtilisateur.activerKiosqueEnvoiNote
		) {
			this.actualiserKiosque();
		}
		if (this.avecQCM) {
			this.actualiserQCM();
		}
		this.actualiserSujet();
		this.actualiserCorrige();
		if (this.avecGenreNotation) {
			this.actualiserGenreNotation();
		}
		if (this.avecCategorieEvaluation && !!this.listeCategories) {
			const lIndex =
				!!this.listeCategories &&
				this.listeCategories.count() > 0 &&
				!!this.devoir.categorie
					? this.listeCategories.getIndiceParElement(this.devoir.categorie)
					: 0;
			this.getInstance(this.idComboCategorie).initSelection(lIndex);
		}
		this.actualiserCompetencesEvaluees();
	}
	actualiserServiceRattrapage() {}
	surValidation(aGenreBouton) {
		switch (aGenreBouton) {
			case this.genreBouton.supprimer: {
				if (!GApplication.getMessage().EnAffichage) {
					this.demanderConfirmationSuppression(aGenreBouton);
				}
				break;
			}
			case this.genreBouton.rattrapage: {
				if (this.avecDevoirRattrapage) {
					this.creerDevoirRattrapage();
				}
				break;
			}
			case this.genreBouton.annuler: {
				this.validerAction(aGenreBouton);
				break;
			}
			default: {
				let lAuMoinsUnePeriodeParClasse = true;
				for (let I = 0; I < this.devoir.listeClasses.count(); I++) {
					const lClasse = this.devoir.listeClasses.get(I);
					if (this._estUnGroupe(lClasse)) {
						continue;
					}
					if (lClasse.listePeriodes.count() === 0) {
						lAuMoinsUnePeriodeParClasse = false;
						break;
					}
				}
				if (!lAuMoinsUnePeriodeParClasse) {
					if (!GApplication.getMessage().EnAffichage) {
						const lThis = this;
						GApplication.getMessage().afficher({
							type: EGenreBoiteMessage.Information,
							titre: GTraductions.getValeur("FenetreDevoir.CreationImpossible"),
							message: GTraductions.getValeur("FenetreDevoir.PasDeperiode"),
							callback: function () {
								lThis.validerAction(lThis.genreBouton.annuler);
							},
						});
					}
				} else {
					this.validerAction(aGenreBouton);
				}
				break;
			}
		}
	}
	demanderConfirmationSuppression(aGenreBouton) {
		const lThis = this;
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			message: GTraductions.getValeur("FenetreDevoir.ConfirmerSuppression"),
			callback: function (aAccepte) {
				lThis.surConfirmationSuppression(aAccepte, aGenreBouton);
			},
		});
	}
	surConfirmationSuppression(aAccepte, aGenreBouton) {
		if (aAccepte === EGenreAction.Valider) {
			this.validerAction(aGenreBouton);
		}
	}
	validerAction(aGenreBouton) {
		this.fermer();
		this.callback.appel(TypeCallbackFenetreDevoir.validation, {
			bouton: aGenreBouton,
			devoir:
				aGenreBouton === this.genreBouton.annuler
					? this.devoirOriginel
					: this.devoir,
		});
	}
	creerDevoirRattrapage() {}
	surSelectionPeriode(I, J, aElt) {
		const leDevoirAUneEvaluationAvecPeriodeCloturee =
			!!this.devoir.evaluation &&
			this.leDevoirEstSurUnePeriodeClotureePourEvaluation(this.devoir);
		if (
			this.Actif &&
			(!this.devoir.estRattrapageService ||
				!this.existeNotesEleveSurRattrapage(true)) &&
			!this.devoir.verrouille &&
			(J === 1 || !leDevoirAUneEvaluationAvecPeriodeCloturee)
		) {
			const lClasse = this.devoir.listeClasses.getElementParNumeroEtGenre(
				aElt.getNumero(),
				aElt.getGenre(),
			);
			const lPeriode =
				J >= 0 ? lClasse.listePeriodes.get(J) : lClasse.listePeriodes;
			if (
				lPeriode instanceof ObjetListeElements ||
				!lPeriode.existeNumero() ||
				lPeriode.Actif
			) {
				this.callback.appel(TypeCallbackFenetreDevoir.periode, {
					devoir: this.devoir,
					classe: lClasse,
					periode: lPeriode,
					listeServices: this.listeServices,
					avecSansPeriode: J === 1,
				});
			}
		}
	}
	surKeyPress(aEvent) {
		const lInstance = aEvent.data.instance;
		let lAvecLettre = false;
		let lAvecVirgule = false;
		let lAvecMoins = false;
		switch (lInstance.genreEdition) {
			case lInstance.GenreEdition.aucune: {
				return;
			}
			case lInstance.GenreEdition.date: {
				return;
			}
			case lInstance.GenreEdition.coefficient: {
				lAvecLettre = false;
				lAvecVirgule = TypeNote.avecVirgule();
				lAvecMoins = false;
				return GNavigateur.estCaractereNote(
					lAvecLettre,
					lAvecVirgule,
					lAvecMoins,
				);
			}
			case lInstance.GenreEdition.bareme: {
				lAvecLettre = false;
				lAvecVirgule = !!lInstance.baremeAvecDecimales;
				lAvecMoins = false;
				return GNavigateur.estCaractereNote(
					lAvecLettre,
					lAvecVirgule,
					lAvecMoins,
				);
			}
			default:
				return true;
		}
	}
	addIdentsGenreNotation() {}
	addInstancesGenreNotation() {}
	composeGenreNotation() {
		return "";
	}
	actualiserGenreNotation() {}
	actualiserSelectionService() {}
	verifierExistenceDevoirRattrapage() {
		return false;
	}
	addIdentsDevoirRattrapage() {}
	addInstancesDevoirRattrapage() {}
	composeDevoirRattrapage() {
		return "";
	}
	actualiserDevoirRattrapage() {}
	actualiserCompetencesEvaluees() {}
	leDevoirAAuMoinsUNeNote(aDevoir) {
		const lDevoir = aDevoir || this.devoir;
		const lNbrEleves = !!lDevoir.listeEleves ? lDevoir.listeEleves.count() : 0;
		for (let I = 0; I < lNbrEleves; I++) {
			const lEleve = lDevoir.listeEleves.get(I);
			if (lEleve.Note && !lEleve.Note.estUneNoteVide()) {
				return true;
			}
		}
		return false;
	}
	getEGenreSujet() {
		return -1;
	}
	getEGenreCorrige() {
		return -1;
	}
	getTailleMaxPieceJointe() {
		return -1;
	}
	getTailleMaxCommentaire() {
		return this.maxLengthCommentaire;
	}
	addIdentsSujetCorrigeDevoir() {
		this.idSujet = this.Nom + "_Sujet";
		this.idCorrige = this.Nom + "_Corrige";
	}
	_supprimerSujet() {
		this.devoir.listeSujets.get(0).setEtat(EGenreEtat.Suppression);
		this.actualiserSujet();
	}
	_supprimerCorrige() {
		this.devoir.listeCorriges.get(0).setEtat(EGenreEtat.Suppression);
		this.actualiserCorrige();
	}
	actualiserSujet() {
		GHtml.setHtml(this.idSujet, this._composeSujet(), { instance: this });
	}
	actualiserCorrige() {
		GHtml.setHtml(this.idCorrige, this._composeCorrige(), { instance: this });
	}
	avecDepotCloud() {
		return false;
	}
	_composeSujet() {
		const H = [];
		if (this._autoriseSujetEtCorrigeDevoir()) {
			const lLibelle = GTraductions.getValeur("FenetreDevoir.avecLeSujet");
			const lmodel = this.avecDepotCloud()
				? 'ie-node="selectSujetDevoir"'
				: 'ie-model="selecFileSujetDevoir"';
			H.push(
				'<div class="label-contain" ',
				lmodel,
				this.avecDepotCloud() ? "" : " ie-selecfile",
				' role="presentation">',
			);
			H.push(
				'<ie-checkbox ie-model="cbSujet" ',
				GObjetWAI.composeAttribut({
					genre: EGenreAttribut.label,
					valeur: lLibelle,
				}),
				" >",
				lLibelle,
				"</ie-checkbox>",
			);
			H.push("</div>");
			if (this._avecSujetDevoir()) {
				const lSujet = this.devoir.listeSujets.getPremierElement();
				if (!!lSujet) {
					H.push('<div class="chips-contain">');
					H.push(
						GChaine.composerUrlLienExterne({
							documentJoint: lSujet,
							genreDocumentJoint:
								lSujet.genreDocument || EGenreDocumentJoint.Fichier,
							genreRessource: this.getEGenreSujet(),
						}),
					);
					H.push("</div>");
				}
			}
		}
		return H.join("");
	}
	_composeCorrige() {
		const H = [];
		if (this._autoriseSujetEtCorrigeDevoir()) {
			H.push(this._composeCorrigeDevoir());
		} else {
			H.push(this._composeAvecCorrigeQCM());
		}
		return H.join("");
	}
	_composeCorrigeDevoir() {
		const lLibelle = GTraductions.getValeur("FenetreDevoir.avecLeCorrige");
		const H = [];
		const lmodel = this.avecDepotCloud()
			? 'ie-node="selectCorrigeDevoir"'
			: 'ie-model="selecFileCorrigeDevoir"';
		H.push(
			'<div class="label-contain" ',
			lmodel,
			this.avecDepotCloud() ? "" : " ie-selecfile",
			' role="presentation">',
		);
		H.push(
			'<ie-checkbox ie-model="cbCorrigeDevoir"',
			GObjetWAI.composeAttribut({
				genre: EGenreAttribut.label,
				valeur: lLibelle,
			}),
			">",
			lLibelle,
			"</ie-checkbox>",
		);
		H.push("</div>");
		if (this._avecCorrigeDevoir()) {
			const lCorrige = this.devoir.listeCorriges.getPremierElement();
			if (!!lCorrige) {
				H.push('<div class="chips-contain">');
				H.push(
					GChaine.composerUrlLienExterne({
						documentJoint: lCorrige,
						genreDocumentJoint:
							lCorrige.genreDocument || EGenreDocumentJoint.Fichier,
						genreRessource: this.getEGenreCorrige(),
					}),
				);
				H.push("</div>");
			}
		}
		return H.join("");
	}
	_composeAvecCorrigeQCM() {
		const H = [];
		H.push('<ie-checkbox ie-model="cbCorrigeQCM">');
		H.push(GTraductions.getValeur("FenetreDevoir.AvecCorrigeQCM"));
		H.push("</ie-checkbox>");
		return H.join("");
	}
	surDemandeSuppressionSujet() {
		const lThis = this;
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			titre: "",
			message: GTraductions.getValeur("FenetreDevoir.MsgConfirmSupprSujet"),
			callback: function (aGenreAction) {
				if (aGenreAction === EGenreAction.Valider) {
					lThis._supprimerSujet();
				}
			},
		});
	}
	surDemandeSuppressionCorrige() {
		const lThis = this;
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			titre: "",
			message: GTraductions.getValeur("FenetreDevoir.MsgConfirmSupprCorrige"),
			callback: function (aGenreAction) {
				if (aGenreAction === EGenreAction.Valider) {
					lThis._supprimerCorrige();
				}
			},
		});
	}
	_autoriseSujetEtCorrigeDevoir() {
		return !(
			this.avecQCM &&
			this.devoir &&
			this.devoir.executionQCM &&
			this.devoir.executionQCM.existeNumero()
		);
	}
	_avecSujetDevoir() {
		return (
			this.devoir &&
			this.devoir.listeSujets &&
			this.devoir.listeSujets.getNbrElementsExistes() > 0
		);
	}
	_avecCorrigeDevoir() {
		return (
			this.devoir &&
			this.devoir.listeCorriges &&
			this.devoir.listeCorriges.getNbrElementsExistes() > 0
		);
	}
	addIdentsSelectionService() {
		this.identZoneSelectionService = this.Nom + "_ZoneSelectionService";
		this.identZoneSelectionService_mirroir =
			this.Nom + "_ZoneSelectionService_mirroir";
	}
	addIdentsQCM() {
		this.identZoneQCM = this.Nom + "_ZoneQCM";
		this.identDetailQCM = this.Nom + "_DetailQCM";
		this.identLibelleAssociationQCM = this.Nom + "_LibelleAssocierQCM";
	}
	addIdentsKiosque() {
		this.identZoneKiosque = this.Nom + "_ZoneKiosque";
		this.identZoneKiosque_mirroir = this.Nom + "_ZoneKiosque_mirroir";
		this.identDetailKiosque = this.Nom + "_DetailKiosque";
		this.identLibelleAssociationKiosque = this.Nom + "_LibelleAssocierKiosque";
	}
	addInstancesQCM() {
		if (this.avecModifQCM) {
			this.identFenetreSelectionQCM = this.addFenetre(
				ObjetFenetre_SelectionQCM,
				this.evntSurSelectionQCM,
				this.initFenetreSelectionQCM,
			);
		}
		this.identDisponibiliteQCM = this.add(
			ObjetDisponibilite,
			this.evntSurDisponibiliteQCM,
			this.initDisponibiliteQCM,
		);
		this.identFenetreParamQCM = this.addFenetre(
			ObjetFenetre_ParamExecutionQCM,
			this.evntSurParamExecutionQCM,
			this.initFenetreParamExecutionQCM,
		);
	}
	addInstancesKiosque() {
		this.identDisponibiliteKiosque = this.add(
			ObjetDisponibilite,
			this.evntSurDisponibiliteKiosque,
			this.initDisponibiliteQCM,
		);
	}
	addInstancesSelectionService() {
		this.idSelectionService = this.add(
			ObjetSaisie,
			this.eventSelectionService,
			this.initSelectionService,
		);
	}
	addInstanceThemes() {}
	composeAssociationDevoirKiosque() {
		const T = [];
		if (
			!!GEtatUtilisateur.avecRessourcesEnvoiNote &&
			GEtatUtilisateur.activerKiosqueEnvoiNote
		) {
			T.push('<div class="field-contain">');
			T.push(
				'<label class="fix-bloc" id="',
				this.identLibelleAssociationKiosque,
				'"></label>',
			);
			T.push(
				'<ie-bouton class="m-right-l" id="',
				this.idBtnAssocierKiosque,
				'" ie-model="btnAssocierKiosque" ',
				GObjetWAI.composeAttribut({
					genre: EGenreAttribut.label,
					valeur: GTraductions.getValeur("FenetreDevoir.AssocierAUnKiosque"),
				}),
				">...</ie-bouton>",
			);
			T.push("</div>");
			T.push(
				'<div class="flex-contain cols m-bottom-l" id="',
				this.identDetailKiosque,
				'">' + this.composeDetailKiosqueAssocie() + "</div>",
			);
		}
		return T.join("");
	}
	composeDetailKiosqueAssocie() {
		const T = [];
		if (
			GEtatUtilisateur.avecRessourcesEnvoiNote &&
			GEtatUtilisateur.activerKiosqueEnvoiNote
		) {
			T.push(
				'<div class="m-bottom-l">',
				GTraductions.getValeur("FenetreDevoir.ReponseEleveEntre"),
				" </div>",
				'<div id="',
				this.getInstance(this.identDisponibiliteKiosque).getNom(),
				'" class="flex-contain flex-center"></div>',
			);
		}
		return T.join("");
	}
	composeAssociationDevoirQCM() {
		const T = [];
		if (this.avecQCM) {
			T.push(
				`<div class="field-contain as-grid">\n              <label id="${this.identLibelleAssociationQCM}"></label>`,
			);
			if (this.avecModifQCM) {
				T.push(
					`<ie-bouton class="has-dots" id="${this.idBtnAssocierQCM}" ie-model="btnAssocierQCM" ${GObjetWAI.composeAttribut({ genre: EGenreAttribut.label, valeur: GTraductions.getValeur("FenetreDevoir.AssocierAUnQCM") })}>\n                ...\n              </ie-bouton>`,
				);
			}
			T.push(`</div>`);
			T.push(
				`<div id="${this.identDetailQCM}" class="m-bottom-l">\n              <div class="field-contain">\n              <label>${GTraductions.getValeur("FenetreDevoir.ReponseEleveEntre")}</label>\n                <ie-btnicon ie-model="btnParametrerQCM" class="icon_cog bt-activable"></ie-btnicon>\n              </div>\n              <div id="${this.getInstance(this.identDisponibiliteQCM).getNom()}"></div>\n            </div>`,
			);
		}
		return T.join("");
	}
	composeSelectionService() {
		return this.avecSelectionService &&
			MethodesObjet.isNumeric(this.idSelectionService)
			? `<div class="field-contain">\n        <label id="${this.idLabelSelectionService}">${GTraductions.getValeur("FenetreDevoir.Service")} </label>\n        <div id="${this.getInstance(this.idSelectionService).getNom()}"></div>\n    </div>`
			: "";
	}
	initDisponibiliteQCM(aInstance) {
		aInstance.setOptionsAffichage({
			afficherSurUneSeuleLigne: true,
			chaines: [GTraductions.getValeur("Le"), GTraductions.getValeur("EtLe")],
			avecHeureDebut: true,
			avecHeureFin: true,
		});
	}
	initFenetreParamExecutionQCM(aInstance) {
		aInstance.setOptionsFenetre({
			modale: true,
			titre: GTraductions.getValeur("FenetreDevoir.ParametresExeQCMDevoir"),
			largeur: 540,
			hauteur: null,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
	}
	initSelectionService(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 225,
			celluleAvecTexteHtml: true,
			avecTriListeElements: true,
			labelledById: this.idLabelSelectionService,
		});
	}
	evntSurSelectionQCM() {}
	ouvrirFenetreParametresQCM() {
		if (
			!!this.devoir.service &&
			!!this.devoir.executionQCM &&
			this.devoir.executionQCM.getEtat() === EGenreEtat.Creation
		) {
			this.devoir.executionQCM.estLieADevoir = true;
			this.devoir.executionQCM.service = this.devoir.service;
		}
		this.getInstance(this.identFenetreParamQCM).setActif(
			this.Actif && !this.cloture && !this.clotureGlobal,
		);
		this.getInstance(this.identFenetreParamQCM).setDonnees({
			afficherModeQuestionnaire: false,
			afficherRessentiEleve: true,
			autoriserSansCorrige: true,
			autoriserCorrigerALaDate: true,
			executionQCM: this.devoir.executionQCM,
			avecConsigne: this.avecConsigneQCM,
			avecPersonnalisationProjetAccompagnement:
				this.avecPersonnalisationProjetAccompagnement,
			avecModeCorrigeALaDate: this.avecModeCorrigeALaDate,
			avecMultipleExecutions: this.avecMultipleExecutions,
		});
	}
	evntSurDisponibiliteKiosque(aDonnees) {
		$.extend(this.devoir.execKiosque, aDonnees);
		this.devoir.execKiosque.setEtat(EGenreEtat.Modification);
		this.getInstance(this.identDisponibiliteQCM).setDonnees({
			dateDebutPublication: this.devoir.execKiosque.dateDebutPublication,
			dateFinPublication: this.devoir.execKiosque.dateFinPublication,
			afficherSurUneSeuleLigne: false,
			actif: true,
		});
	}
	evntSurDisponibiliteQCM(aDonnees) {
		$.extend(this.devoir.executionQCM, aDonnees);
		this.devoir.executionQCM.setEtat(EGenreEtat.Modification);
		if (this.avecDetailPublicationQCM) {
			this.getInstance(this.identDisponibiliteQCM).setDonnees({
				dateDebutPublication: this.devoir.executionQCM.dateDebutPublication,
				dateFinPublication: this.devoir.executionQCM.dateFinPublication,
				afficherSurUneSeuleLigne: false,
				actif: true,
				actifFin: !this.devoir.executionQCM.estUnTAF,
			});
			if (this.devoir.executionQCM.getEtat() === EGenreEtat.Creation) {
				UtilitaireQCM.verifierDateCorrection(this.devoir.executionQCM);
			}
		}
	}
	evenementSurDateDevoir(aDate) {
		if (
			this.devoir.executionQCM &&
			this.devoir.executionQCM.getEtat() === EGenreEtat.Creation
		) {
			const lPremiereHeure = GDate.placeEnDateHeure(0);
			const lDerniereHeure = GDate.placeEnDateHeure(
				GParametres.PlacesParJour - 1,
				true,
			);
			$.extend(this.devoir.executionQCM, {
				dateDebutPublication: new Date(
					aDate.setHours(
						lPremiereHeure.getHours(),
						lPremiereHeure.getMinutes(),
					),
				),
				dateFinPublication: new Date(
					aDate.setHours(
						lDerniereHeure.getHours(),
						lDerniereHeure.getMinutes(),
					),
				),
			});
		}
	}
	evenementSurBtnAssocierKiosque() {}
	evenementSurBtnAssocierQCM() {}
	evenementSurBtnCompetencesEvaluees() {}
	evenementSurBtnCategorie() {}
	actualiserCategorieEvaluation() {}
	evenementSurSuppressionEvaluationAssociee() {}
	leDevoirEstSurUnePeriodeClotureePourEvaluation() {
		return false;
	}
	actionSurListeQCMCumuls(aListeQCM, aMessage, aDonnees) {
		if (this.avecQCM) {
			this.getInstance(this.identFenetreSelectionQCM).setDonnees(
				aListeQCM,
				aMessage,
				aDonnees,
			);
		}
	}
	eventSelectionService(aParams) {
		if (!this.getInstance(this.idSelectionService).InteractionUtilisateur) {
			return;
		}
		switch (aParams.genreEvenement) {
			case EGenreEvenementObjetSaisie.selection: {
				const lParam = { service: aParams.element };
				if (this.avecQCM && this.devoir.executionQCM) {
					lParam.qcm = this.devoir.executionQCM.QCM;
					lParam.execQCM = this.devoir.executionQCM;
				}
				this.callback.appel(TypeCallbackFenetreDevoir.service, lParam);
				break;
			}
			default:
				break;
		}
	}
	evntSurParamExecutionQCM(aNumeroBouton, aExecutionQCM) {
		if (this.avecQCM) {
			this.devoir.executionQCM = aExecutionQCM;
		}
		if (aNumeroBouton > 0) {
			this.devoir.executionQCM.setEtat(EGenreEtat.Modification);
			this.actualiserQCM();
		}
	}
	actualiserKiosque() {
		if (this.devoir) {
			if (
				!!this.devoir.execKiosque &&
				this.devoir.execKiosque.getEtat() !== EGenreEtat.Suppression
			) {
				GHtml.setDisabled(this.IdBareme, true);
				GStyle.setDisplay(this.identZoneKiosque, true);
				GStyle.setDisplay(this.identZoneKiosque_mirroir, true);
				GHtml.setDisplay(this.idBtnAssocierKiosque, false);
				const lLienRessource = GChaine.composerUrlLienExterne({
					documentJoint: this.devoir.execKiosque,
					libelleEcran: this.devoir.execKiosque.ressource.getLibelle(),
					title: this.devoir.execKiosque.ressource.description,
				});
				const lLienStat = GChaine.composerUrlLienExterne({
					documentJoint: this.devoir,
					libelleEcran: GTraductions.getValeur("FenetreDevoir.resultatKiosque"),
				});
				GHtml.setHtml(
					this.identLibelleAssociationKiosque,
					GTraductions.getValeur("FenetreDevoir.AssocieAUnKiosque") +
						" : " +
						lLienRessource +
						lLienStat,
				);
				GStyle.setDisplay(this.identDetailKiosque, true);
				this.getInstance(this.identDisponibiliteKiosque).setDonnees({
					dateDebutPublication: this.devoir.execKiosque.dateDebutPublication,
					dateFinPublication: this.devoir.execKiosque.dateFinPublication,
					afficherSurUneSeuleLigne: false,
					actif: this.Actif && !this.devoir.verrouille,
				});
			} else {
				if (
					!this.Actif ||
					this.devoir.verrouille ||
					this.leDevoirAAuMoinsUNeNote() === true
				) {
					GStyle.setDisplay(this.identZoneKiosque, false);
					GStyle.setDisplay(this.identZoneKiosque_mirroir, false);
				} else {
					GStyle.setDisplay(
						this.identZoneKiosque,
						!this.devoir.executionQCM ||
							this.devoir.executionQCM.getEtat() === EGenreEtat.Suppression,
					);
					GStyle.setDisplay(this.identZoneKiosque_mirroir, true);
					GHtml.setHtml(
						this.identLibelleAssociationKiosque,
						GTraductions.getValeur("FenetreDevoir.AssocierAUnKiosque"),
					);
					GStyle.setDisplay(this.identDetailKiosque, false);
					GHtml.setDisplay(this.idBtnAssocierKiosque, true);
				}
			}
		}
	}
	actualiserQCM() {
		if (this.avecQCM && this.devoir) {
			if (this.devoir.executionQCM && this.devoir.executionQCM.existeNumero()) {
				GHtml.setDisabled(this.IdBareme, true);
				const lExecQCM = this.devoir.executionQCM;
				GStyle.setDisplay(this.identZoneQCM, true);
				if (this.avecModifQCM) {
					GHtml.setDisplay(
						this.idBtnAssocierQCM,
						lExecQCM.getEtat() === EGenreEtat.Creation,
					);
				}
				GHtml.setHtml(
					this.identLibelleAssociationQCM,
					GTraductions.getValeur("FenetreDevoir.AssocieAUnQCM") +
						" : " +
						lExecQCM.QCM.getLibelle(),
				);
				if (this.avecDetailPublicationQCM && !lExecQCM.estUnTAF) {
					GStyle.setDisplay(this.identDetailQCM, true);
					this.getInstance(this.identDisponibiliteQCM).setDonnees({
						dateDebutPublication: lExecQCM.dateDebutPublication,
						dateFinPublication: lExecQCM.dateFinPublication,
						afficherSurUneSeuleLigne: false,
						actif: this.Actif && !this.devoir.verrouille,
						actifFin: !lExecQCM.estUnTAF,
					});
				} else {
					GStyle.setDisplay(this.identDetailQCM, false);
				}
			} else {
				if (
					!this.Actif ||
					this.devoir.verrouille ||
					this.leDevoirAAuMoinsUNeNote() === true
				) {
					GStyle.setDisplay(this.identZoneQCM, false);
				} else {
					GStyle.setDisplay(
						this.identZoneQCM,
						!this.devoir.execKiosque ||
							this.devoir.execKiosque.getEtat() === EGenreEtat.Suppression,
					);
					if (this.avecModifQCM) {
						GHtml.setDisplay(this.idBtnAssocierQCM, true);
					}
					GHtml.setHtml(
						this.identLibelleAssociationQCM,
						GTraductions.getValeur("FenetreDevoir.AssocierAUnQCM"),
					);
					GStyle.setDisplay(this.identDetailQCM, false);
				}
			}
		}
	}
}
function _composeLibelleCategorie(aElement) {
	const T = [];
	T.push('<div ie-ellipsis class="cat-devoir-conteneur">');
	if (aElement.couleur) {
		T.push(
			'<span class="categorie-devoir" style="',
			GStyle.composeCouleurFond(aElement.couleur),
			'"></span>',
		);
	}
	T.push(
		'<span ie-ellipsis class="AlignementMilieuVertical">',
		aElement.getLibelle(),
		"</span>",
	);
	T.push("</div>");
	return T.join("");
}
function composeFacultatif() {
	const T = [];
	T.push(
		`<ie-checkbox ie-model="cbFacultatif"><span id="${this.idLabelComboFacultatif}">${GTraductions.getValeur("FenetreDevoir.Facultatif")}</span></ie-checkbox>\n            <span ie-style="getStyleCarreFacultatif" class="carre-facultatif"></span>\n            <div id="${this.getInstance(this.idComboFacultatif).getNom()}"></div>\n            <ie-btnicon ie-model="btnMrFiche('${this.TypeMrFiche.Facultatif}')" class="m-left icon_question bt-activable"></ie-btnicon>`,
	);
	return T.join("");
}
module.exports = { ObjetFenetre_Devoir, TypeCallbackFenetreDevoir };
