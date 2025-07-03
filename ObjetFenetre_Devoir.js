exports.ObjetFenetre_Devoir = exports.TypeCallbackFenetreDevoir = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDisponibilite_1 = require("ObjetDisponibilite");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ParamExecutionQCM_1 = require("ObjetFenetre_ParamExecutionQCM");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const TypeNote_1 = require("TypeNote");
const ObjetListe_1 = require("ObjetListe");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const DonneesListe_DevoirPeriode_1 = require("DonneesListe_DevoirPeriode");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const ObjetFenetre_SelectionQCM_1 = require("ObjetFenetre_SelectionQCM");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const AccessApp_1 = require("AccessApp");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const ToucheClavier_1 = require("ToucheClavier");
var TypeCallbackFenetreDevoir;
(function (TypeCallbackFenetreDevoir) {
	TypeCallbackFenetreDevoir[(TypeCallbackFenetreDevoir["validation"] = 0)] =
		"validation";
	TypeCallbackFenetreDevoir[(TypeCallbackFenetreDevoir["periode"] = 1)] =
		"periode";
	TypeCallbackFenetreDevoir[(TypeCallbackFenetreDevoir["service"] = 2)] =
		"service";
})(
	TypeCallbackFenetreDevoir ||
		(exports.TypeCallbackFenetreDevoir = TypeCallbackFenetreDevoir = {}),
);
class ObjetFenetre_Devoir extends ObjetFenetre_1.ObjetFenetre {
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
		this.idBtnAssocierKiosque = this.Nom + "_btnAssocierKiosque";
		this.idBtnAssocierQCM = this.Nom + "_btnAssocierQCM";
		this.maxLengthCommentaire = 20;
		this.addIdentsSelectionService();
		this.addIdentsKiosque();
		this.addIdentsQCM();
		this.addIdentsSujetCorrigeDevoir();
		this.addIdentsGenreNotation();
		this.addIdentsDevoirRattrapage();
		this.listeFacultatif = new ObjetListeElements_1.ObjetListeElements();
		this.listeFacultatif.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.CommeUnBonus"),
				null,
				this.genreFacultatif.commeBonus,
			),
		);
		this.listeFacultatif.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.CommeUneNote"),
				null,
				this.genreFacultatif.commeNote,
			),
		);
		if (this.avecGenreFacultatifCommeSeuil()) {
			this.listeFacultatif.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.CommeUnSeuil",
					),
					null,
					this.genreFacultatif.commeSeuil,
				),
			);
		}
		this.setOptionsFenetre({ avecTailleSelonContenu: true });
		this.initialiserDevoir();
	}
	initialiserDevoir() {}
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
								? ObjetTraduction_1.GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMesDocuments",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
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
							class: "bg-orange-claire",
						});
						const lAvecCloud = GEtatUtilisateur.listeCloud.count() > 0;
						if (lAvecCloud) {
							const lParams = {
								genre: lThis.getEGenreSujet(),
								listeElements: lThis.devoir.listeSujets,
								callback: lThis.actualiserSujet,
							};
							lTabActions.push({
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"fenetre_ActionContextuelle.depuisMonCloud",
								),
								icon: "icon_cloud",
								event: function () {
									lThis.ouvrirPJCloud(lParams);
								}.bind(this),
								class: "bg-orange-claire",
							});
							if (GEtatUtilisateur.avecCloudENEJDisponible()) {
								const lActionENEJ =
									ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.getActionENEJ(
										() => lThis.ouvrirPJCloudENEJ(lParams),
									);
								if (lActionENEJ) {
									lTabActions.push(lActionENEJ);
								}
							}
						}
						ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
							lTabActions,
							{ pere: lThis },
						);
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
								? ObjetTraduction_1.GTraductions.getValeur(
										"fenetre_ActionContextuelle.depuisMesDocuments",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
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
							class: "bg-orange-claire",
						});
						const lAvecCloud = GEtatUtilisateur.listeCloud.count() > 0;
						if (lAvecCloud) {
							const lParams = {
								genre: lThis.getEGenreCorrige(),
								listeElements: lThis.devoir.listeCorriges,
								callback: lThis.actualiserCorrige,
							};
							lTabActions.push({
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"fenetre_ActionContextuelle.depuisMonCloud",
								),
								icon: "icon_cloud",
								event: function () {
									lThis.ouvrirPJCloud(lParams);
								}.bind(this),
								class: "bg-orange-claire",
							});
							if (GEtatUtilisateur.avecCloudENEJDisponible()) {
								const lActionENEJ =
									ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.getActionENEJ(
										() => lThis.ouvrirPJCloudENEJ(lParams),
									);
								if (lActionENEJ) {
									lTabActions.push(lActionENEJ);
								}
							}
						}
						ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
							lTabActions,
							{ pere: lThis },
						);
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
								TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans;
						}
						lEstCoche = !!aInstance.devoir.executionQCM.publierCorrige;
					}
					return lEstCoche;
				},
				setValue: function (aValue) {
					if (!!aInstance.devoir && !!aInstance.devoir.executionQCM) {
						aInstance.devoir.executionQCM.publierCorrige = aValue;
						aInstance.devoir.executionQCM.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
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
							this.controleur.competencesEvaluees.btnModifierCompetences.event.call(
								this,
								null,
								null,
							);
						} else {
							aInstance.evenementSurSuppressionEvaluationAssociee();
						}
					}
				},
			},
			labelEvaluationAssociee: function () {
				return !!aInstance.devoir &&
					aInstance.devoir.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
					? ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.CreerEvaluation",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.EvaluationAssociee",
						);
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
						aInstance.devoir.executionQCM.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
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
					if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({ idRessource: aTypeMrFiche });
					}
				},
				getTitle: function (aTypeMrFiche) {
					return ObjetTraduction_1.GTraductions.getTitreMFiche(aTypeMrFiche);
				},
			},
			btnParametrerQCM: {
				event: function () {
					aInstance.ouvrirFenetreParametresQCM();
				},
				getTitle: function () {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.ParametresExeQCMDevoir",
					);
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
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.Ramenersur20",
						[lStrBaremeDuService],
					);
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
						lCouleurFacultatif = (0, AccessApp_1.getApp)().getCouleur().devoir
							.commeUnBonus;
					} else if (aInstance.devoir.commeUneNote) {
						lCouleurFacultatif = (0, AccessApp_1.getApp)().getCouleur().devoir
							.commeUneNote;
					} else if (aInstance.devoir.commeUnSeuil) {
						lCouleurFacultatif = (0, AccessApp_1.getApp)().getCouleur().devoir
							.commeUnSeuil;
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
	ouvrirPJCloud(aParams) {}
	ouvrirPJCloudENEJ(aParams) {}
	construireInstances() {
		this.identDateDevoir = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementSurDateDevoir,
			this.initialiserDateDevoir,
		);
		this.identDatePublication = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementSurDatePublication,
			this.initialiserDatePublication,
		);
		this.identPeriodes = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurPeriodes,
			null,
		);
		this.idComboFacultatif = this.add(
			ObjetSaisie_1.ObjetSaisie,
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
				ObjetListe_1.ObjetListe,
				this.evenementSurListeCompetencesQCM,
				this.initialiserListeCompetencesQCM,
			);
		}
		if (this.avecCategorieEvaluation) {
			this.idComboCategorie = this.add(
				ObjetSaisie_1.ObjetSaisie,
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
	initialiserListeCompetencesQCM(aInstance) {}
	evenementSurListeCompetencesQCM(aParametres) {}
	avecBorneSurDateSaisissable() {
		return true;
	}
	initialiserDateDevoir(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			ariaLabelledBy: this.idLabelDateValidation,
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
			ariaLabelledBy: this.idLabelDatePublication,
			ariaDescribedBy: this.idInfoPublicationDecaleeParents,
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
			ariaLabelledBy: this.idLabelComboFacultatif,
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
			ariaLabelledBy: this.idLabelComboCategorie,
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
		this.devoir = MethodesObjet_1.MethodesObjet.dupliquer(aDevoir);
		this.avecDetailPublicationQCM =
			aAvecDetailPublicationQCM !== null &&
			aAvecDetailPublicationQCM !== undefined
				? aAvecDetailPublicationQCM
				: true;
		this.actualiserSelectionService(aListeServices);
		let lTitre = "";
		lTitre +=
			(aEnCreation
				? ObjetTraduction_1.GTraductions.getValeur("Notes.CreerDevoir")
				: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.ModificationDevoir",
					)) + " : ";
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
				this.devoir.ListeThemes ||
					new ObjetListeElements_1.ObjetListeElements(),
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
		const lClasse = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 0, lNbr = this.devoir.listeClasses.count(); i < lNbr; i++) {
			if (!this._estUnGroupe(this.devoir.listeClasses.get(i))) {
				lClasse.add(this.devoir.listeClasses.get(i));
			}
		}
		this.getInstance(this.identPeriodes).setDonnees(
			new DonneesListe_DevoirPeriode_1.DonneesListe_DevoirPeriode(lClasse, {
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
			`<div class="flex-contain m-bottom-l" ie-if="estVerrouillageVisible">\n            <ie-checkbox ie-model="cbDevoirVerrouille">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Verrouille")}</ie-checkbox>\n            <div class="locked-contain" ie-if="estDevoirVerrouille">\n                <i role="presentation" class="icon_lock locked"></i>\n            </div>\n          </div>`,
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
			`<div class="field-contain as-grid" style="--width-bloc : 9.5rem;">\n              <label id="${this.idLabelDateValidation}">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.DevoirDu")}</label>\n              <div id="${this.getNomInstance(this.identDateDevoir)}"></div>\n            </div>`,
		);
		T.push(`<div class="flex-contain flex-start">`);
		T.push(
			`  <div id="${this.idZoneDatePublication}" class="fix-bloc field-contain as-grid">\n                <label id="${this.idLabelDatePublication}">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.NotePublieeLe")}: </label>\n                <div id="${this.getNomInstance(this.identDatePublication)}"></div>\n              </div>`,
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
		T.push('<div class="field-contain flex-gap-l">');
		T.push(
			this.composeLigneSaisie(
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Bareme"),
				this.IdBareme,
				this.GenreEdition.bareme,
				"Gras m-right-l",
				null,
				3 +
					(this.baremeAvecDecimales
						? 1 + TypeNote_1.TypeNote.decimalNotation
						: 0),
				45,
			),
		);
		T.push(
			this.composeLigneSaisie(
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Coefficient"),
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
			this.composeFacultatif(),
			"</div>",
		);
		if (this.avecCategorieEvaluation) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"label",
						{ id: this.idLabelComboCategorie },
						ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Categorie"),
					),
					IE.jsx.str("div", { id: this.getNomInstance(this.idComboCategorie) }),
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"FenetreCategorieEvaluation.SelectionUneCategorie",
							),
							class: "m-left-l",
							"ie-model": "btnCategorie",
							"ie-display": "btnCategorie.estVisible",
						},
						"...",
					),
				),
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
		const lLabelCommentaire =
			`${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.RedigezVotreCommentaire")}, ${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.VisibleParEleves")}`.toAttrValue();
		const lGetNode = (aNode) => {
			const lThis = this;
			$(aNode).on({
				focus() {
					lThis.surFocus(this.id, lThis.GenreEdition.commentaire);
				},
				blur() {
					lThis.surBlur(this.id);
				},
				keypress(aEvent) {
					if (ToucheClavier_1.ToucheClavierUtil.estEventRetourChariot(aEvent)) {
						lThis.surBlur(this.id);
						lThis.surFocus(this.id, lThis.GenreEdition.commentaire);
					}
				},
			});
		};
		T.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str("input", {
					id: this.IdCommentaire,
					class: "fluid-bloc full-width",
					maxlength: this.getTailleMaxCommentaire(),
					"aria-label": lLabelCommentaire,
					placeholder: lLabelCommentaire,
					"ie-node": lGetNode,
				}),
			),
		);
		if (this.avecThemes) {
			T.push(
				`<div class="field-contain flex-contain flex-center">\n                <label class="fix-bloc">${ObjetTraduction_1.GTraductions.getValeur("Themes")} : </label>\n                <div class="constrained-bloc" id="${this.getNomInstance(this.identMultiSelectionTheme)}"></div>\n              </div>`,
			);
		}
		T.push(
			`<div id="${this.idMessageDetailNotesNonPublie}" class="field-contain Italique">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.DetailNotesNonPublie")}</div>`,
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
	_estUnGroupe(aClasse) {
		return;
	}
	composeCommentaireSurNote() {
		return "";
	}
	composePeriodes() {
		const T = [];
		T.push(
			'<div class="field-contain p-top-l p-bottom-l" id="',
			this.getNomInstance(this.identPeriodes),
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
		aAriaLabelSansTitre,
	) {
		const lMaxLength = aMaxLength ? aMaxLength : 40;
		const T = [];
		T.push('<div id="', AId, '_" class="flex-contain flex-center">');
		if (ATitre) {
			T.push('<label  for="', AId, '">', ATitre, "</label>");
		}
		const lGetNode = (aNode) => {
			const lThis = this;
			$(aNode).on({
				focus() {
					lThis.surFocus(this.id, aGenreEdition);
				},
				blur() {
					lThis.surBlur(this.id);
				},
				keypress(aEvent) {
					if (ToucheClavier_1.ToucheClavierUtil.estEventRetourChariot(aEvent)) {
						lThis.surBlur(this.id);
						lThis.surFocus(this.id, aGenreEdition);
					}
				},
			});
		};
		T.push(
			IE.jsx.str("input", {
				type: "text",
				"ie-node": lGetNode,
				maxlength: lMaxLength,
				id: AId,
				class: aClass ? " " + { aClass } : "",
				style: { width: aInputWidth },
				"aria-label":
					aAriaLabelSansTitre && !ATitre ? aAriaLabelSansTitre : false,
			}),
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
		ObjetHtml_1.GHtml.setSelectionEdit(aId);
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
		let lThis = this;
		if (AId === this.IdBareme) {
			lNote = this.controlerNote(this.IdBareme, 1.0, this.getBaremeMaximal());
			if (
				lNote &&
				lNote.getValeur() < this.devoir.bareme.getValeur() &&
				!this.enCreation
			) {
				if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
					lThis = this;
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message:
								ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.AvertissementChangementDeBareme1",
									[lNote.getValeur()],
								) +
								"<br />" +
								(this.avecDevoirRattrapage &&
								this.verifierExistenceDevoirRattrapage(this.devoir) &&
								lNote.getValeur() <
									this.devoir.devoirRattrapage.noteSeuil.getValeur()
									? ObjetTraduction_1.GTraductions.getValeur(
											"FenetreDevoir.AvertissementChangementDeBareme2",
										) + "<br />"
									: "") +
								"<br />" +
								ObjetTraduction_1.GTraductions.getValeur(
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
				if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
					lThis = this;
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message:
								ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.AvertissementChangementDeBareme2",
								) +
								"<br />" +
								"<br />" +
								ObjetTraduction_1.GTraductions.getValeur(
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
			this.devoir.commentaire = ObjetHtml_1.GHtml.getValue(this.IdCommentaire);
		}
		if (this.avecDevoirRattrapage) {
			this.surEditionRattrapage(AId);
		}
		this.actualiser();
	}
	surEditionRattrapage(aIdElementModifie) {}
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
	evenementSurDatePublication(aDate) {}
	_evenementSurPeriodes(aParamEvnt) {
		switch (aParamEvnt.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
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
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
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
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.devoir.categorie = aParams.element;
			this.actualiser();
		}
	}
	controlerNote(aId, aMin, aMax) {
		const lNote = new TypeNote_1.TypeNote(ObjetHtml_1.GHtml.getValue(aId));
		const lNoteMin = new TypeNote_1.TypeNote(aMin);
		const lNoteMax = new TypeNote_1.TypeNote(aMax);
		const lEstValide = lNote.estUneNoteValide(lNoteMin, lNoteMax, false, false);
		if (!lEstValide) {
			if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.ValeurComprise",
							),
							[lNoteMin + "", lNoteMax + ""],
						),
					});
			}
		}
		return lEstValide ? lNote : null;
	}
	estUnRattrapageDeService() {
		return false;
	}
	existeNotesEleveSurRattrapage(aSansVerifierNote) {
		return false;
	}
	actualiserCompetencesDeServiceEtQcm(aExecution) {}
	actualiser() {
		this.getInstance(this.identDateDevoir).setDonnees(this.devoir.date);
		ObjetHtml_1.GHtml.setValue(
			this.IdCoefficient,
			this.devoir.coefficient.getNote(),
		);
		let lBareme = this.devoir.bareme.getValeur();
		if (this.baremeAvecDecimales) {
			if (lBareme !== Math.floor(lBareme)) {
				lBareme = this.devoir.bareme.getNote();
			}
		}
		ObjetHtml_1.GHtml.setValue(this.IdBareme, lBareme);
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
		ObjetHtml_1.GHtml.setValue(this.IdCommentaire, this.devoir.commentaire);
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
		ObjetHtml_1.GHtml.setDisabled(
			this.IdCoefficient,
			this.cloture ||
				!this.Actif ||
				this.devoir.verrouille ||
				!!this.devoir.coeffVerrouille ||
				this.estUnRattrapageDeService(),
		);
		ObjetHtml_1.GHtml.setDisabled(
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
		ObjetHtml_1.GHtml.setDisabled(
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
		ObjetHtml_1.GHtml.setDisplay(
			this.idZoneDatePublication,
			!lAvecDetailNotesNonPublie,
		);
		ObjetHtml_1.GHtml.setDisplay(
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
					ObjetHtml_1.GHtml.setDisabled(
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
				if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
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
					if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
						const lThis = this;
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.CreationImpossible",
								),
								message: ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.PasDeperiode",
								),
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
		(0, AccessApp_1.getApp)()
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.ConfirmerSuppression",
				),
				callback: function (aAccepte) {
					lThis.surConfirmationSuppression(aAccepte, aGenreBouton);
				},
			});
	}
	surConfirmationSuppression(aAccepte, aGenreBouton) {
		if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
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
				lPeriode instanceof ObjetListeElements_1.ObjetListeElements ||
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
				lAvecVirgule = TypeNote_1.TypeNote.avecVirgule();
				lAvecMoins = false;
				return ObjetNavigateur_1.Navigateur.estCaractereNote(
					lAvecLettre,
					lAvecVirgule,
					lAvecMoins,
				);
			}
			case lInstance.GenreEdition.bareme: {
				lAvecLettre = false;
				lAvecVirgule = !!lInstance.baremeAvecDecimales;
				lAvecMoins = false;
				return ObjetNavigateur_1.Navigateur.estCaractereNote(
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
	actualiserSelectionService(aListeServices) {}
	verifierExistenceDevoirRattrapage(aDevoir) {
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
		this.devoir.listeSujets
			.get(0)
			.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		this.actualiserSujet();
	}
	_supprimerCorrige() {
		this.devoir.listeCorriges
			.get(0)
			.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		this.actualiserCorrige();
	}
	actualiserSujet() {
		ObjetHtml_1.GHtml.setHtml(this.idSujet, this._composeSujet(), {
			instance: this,
		});
	}
	actualiserCorrige() {
		ObjetHtml_1.GHtml.setHtml(this.idCorrige, this._composeCorrige(), {
			instance: this,
		});
	}
	avecDepotCloud() {
		return false;
	}
	_composeSujet() {
		const H = [];
		if (this._autoriseSujetEtCorrigeDevoir()) {
			const lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDevoir.avecLeSujet",
			);
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
				ObjetWAI_1.GObjetWAI.composeAttribut({
					genre: ObjetWAI_1.EGenreAttribut.label,
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
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: lSujet,
							genreDocumentJoint:
								lSujet.genreDocument ||
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
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
		const lLibelle = ObjetTraduction_1.GTraductions.getValeur(
			"FenetreDevoir.avecLeCorrige",
		);
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
			ObjetWAI_1.GObjetWAI.composeAttribut({
				genre: ObjetWAI_1.EGenreAttribut.label,
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
					ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: lCorrige,
						genreDocumentJoint:
							lCorrige.genreDocument ||
							Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
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
		H.push(
			ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.AvecCorrigeQCM"),
		);
		H.push("</ie-checkbox>");
		return H.join("");
	}
	surDemandeSuppressionSujet() {
		const lThis = this;
		(0, AccessApp_1.getApp)()
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				titre: "",
				message: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.MsgConfirmSupprSujet",
				),
				callback: function (aGenreAction) {
					if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
						lThis._supprimerSujet();
					}
				},
			});
	}
	surDemandeSuppressionCorrige() {
		const lThis = this;
		(0, AccessApp_1.getApp)()
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				titre: "",
				message: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.MsgConfirmSupprCorrige",
				),
				callback: function (aGenreAction) {
					if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
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
				ObjetFenetre_SelectionQCM_1.ObjetFenetre_SelectionQCM,
				this.evntSurSelectionQCM,
				this.initFenetreSelectionQCM,
			);
		}
		this.identDisponibiliteQCM = this.add(
			ObjetDisponibilite_1.ObjetDisponibilite,
			this.evntSurDisponibiliteQCM,
			this.initDisponibiliteQCM,
		);
		this.identFenetreParamQCM = this.addFenetre(
			ObjetFenetre_ParamExecutionQCM_1.ObjetFenetre_ParamExecutionQCM,
			this.evntSurParamExecutionQCM,
			this.initFenetreParamExecutionQCM,
		);
	}
	initFenetreSelectionQCM(aInstance) {}
	addInstancesKiosque() {
		this.identDisponibiliteKiosque = this.add(
			ObjetDisponibilite_1.ObjetDisponibilite,
			this.evntSurDisponibiliteKiosque,
			this.initDisponibiliteQCM,
		);
	}
	addInstancesSelectionService() {
		this.idSelectionService = this.add(
			ObjetSaisie_1.ObjetSaisie,
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
				IE.jsx.str(
					"ie-bouton",
					{
						class: "m-right-l",
						id: this.idBtnAssocierKiosque,
						"ie-model": "btnAssocierKiosque",
						"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.AssocierAUnKiosque",
						),
					},
					"...",
				),
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
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.ReponseEleveEntre",
				),
				" </div>",
				'<div id="',
				this.getNomInstance(this.identDisponibiliteKiosque),
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
					IE.jsx.str(
						"ie-bouton",
						{
							class: "has-dots",
							id: this.idBtnAssocierQCM,
							"ie-model": "btnAssocierQCM",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.AssocierAUnQCM",
							),
						},
						"...",
					),
				);
			}
			T.push(`</div>`);
			T.push(
				`<div id="${this.identDetailQCM}" class="m-bottom-l">\n              <div class="field-contain">\n              <label>${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.ReponseEleveEntre")}</label>\n                <ie-btnicon ie-model="btnParametrerQCM" class="icon_cog bt-activable"></ie-btnicon>\n              </div>\n              <div id="${this.getNomInstance(this.identDisponibiliteQCM)}"></div>\n            </div>`,
			);
		}
		return T.join("");
	}
	composeSelectionService() {
		return this.avecSelectionService &&
			MethodesObjet_1.MethodesObjet.isNumeric(this.idSelectionService)
			? `<div class="field-contain">\n        <label id="${this.idLabelSelectionService}">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Service")} </label>\n        <div id="${this.getNomInstance(this.idSelectionService)}"></div>\n    </div>`
			: "";
	}
	initDisponibiliteQCM(aInstance) {
		aInstance.setOptionsAffichage({
			afficherSurUneSeuleLigne: true,
			chaines: [
				ObjetTraduction_1.GTraductions.getValeur("Le"),
				ObjetTraduction_1.GTraductions.getValeur("EtLe"),
			],
			avecHeureDebut: true,
			avecHeureFin: true,
		});
	}
	initFenetreParamExecutionQCM(aInstance) {
		aInstance.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDevoir.ParametresExeQCMDevoir",
			),
			largeur: 540,
			hauteur: null,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	initSelectionService(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 225,
			celluleAvecTexteHtml: true,
			avecTriListeElements: true,
			ariaLabelledBy: this.idLabelSelectionService,
		});
	}
	evntSurSelectionQCM(aNumeroBouton, aEltQCM) {}
	ouvrirFenetreParametresQCM() {
		if (
			!!this.devoir.service &&
			!!this.devoir.executionQCM &&
			this.devoir.executionQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
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
		this.devoir.execKiosque.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.getInstance(this.identDisponibiliteQCM).setDonnees({
			dateDebutPublication: this.devoir.execKiosque.dateDebutPublication,
			dateFinPublication: this.devoir.execKiosque.dateFinPublication,
			actif: true,
		});
	}
	evntSurDisponibiliteQCM(aDonnees) {
		$.extend(this.devoir.executionQCM, aDonnees);
		this.devoir.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		if (this.avecDetailPublicationQCM) {
			this.getInstance(this.identDisponibiliteQCM).setDonnees({
				dateDebutPublication: this.devoir.executionQCM.dateDebutPublication,
				dateFinPublication: this.devoir.executionQCM.dateFinPublication,
				actif: true,
				actifFin: !this.devoir.executionQCM.estUnTAF,
			});
			if (
				this.devoir.executionQCM.getEtat() ===
				Enumere_Etat_1.EGenreEtat.Creation
			) {
				UtilitaireQCM_1.UtilitaireQCM.verifierDateCorrection(
					this.devoir.executionQCM,
				);
			}
		}
	}
	evenementSurDateDevoir(aDate) {
		if (
			this.devoir.executionQCM &&
			this.devoir.executionQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0);
			const lDerniereHeure = ObjetDate_1.GDate.placeEnDateHeure(
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
	leDevoirEstSurUnePeriodeClotureePourEvaluation(aDevoir) {
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
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
				.selection: {
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
			this.devoir.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.actualiserQCM();
		}
	}
	actualiserKiosque() {
		if (this.devoir) {
			if (
				!!this.devoir.execKiosque &&
				this.devoir.execKiosque.getEtat() !==
					Enumere_Etat_1.EGenreEtat.Suppression
			) {
				ObjetHtml_1.GHtml.setDisabled(this.IdBareme, true);
				ObjetStyle_1.GStyle.setDisplay(this.identZoneKiosque, true);
				ObjetStyle_1.GStyle.setDisplay(this.identZoneKiosque_mirroir, true);
				ObjetHtml_1.GHtml.setDisplay(this.idBtnAssocierKiosque, false);
				const lLienRessource = ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: this.devoir.execKiosque,
					libelleEcran: this.devoir.execKiosque.ressource.getLibelle(),
					title: this.devoir.execKiosque.ressource.description,
				});
				const lLienStat = ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: this.devoir,
					libelleEcran: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.resultatKiosque",
					),
				});
				ObjetHtml_1.GHtml.setHtml(
					this.identLibelleAssociationKiosque,
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.AssocieAUnKiosque",
					) +
						" : " +
						lLienRessource +
						lLienStat,
				);
				ObjetStyle_1.GStyle.setDisplay(this.identDetailKiosque, true);
				this.getInstance(this.identDisponibiliteKiosque).setDonnees({
					dateDebutPublication: this.devoir.execKiosque.dateDebutPublication,
					dateFinPublication: this.devoir.execKiosque.dateFinPublication,
					actif: this.Actif && !this.devoir.verrouille,
				});
			} else {
				if (
					!this.Actif ||
					this.devoir.verrouille ||
					this.leDevoirAAuMoinsUNeNote() === true
				) {
					ObjetStyle_1.GStyle.setDisplay(this.identZoneKiosque, false);
					ObjetStyle_1.GStyle.setDisplay(this.identZoneKiosque_mirroir, false);
				} else {
					ObjetStyle_1.GStyle.setDisplay(
						this.identZoneKiosque,
						!this.devoir.executionQCM ||
							this.devoir.executionQCM.getEtat() ===
								Enumere_Etat_1.EGenreEtat.Suppression,
					);
					ObjetStyle_1.GStyle.setDisplay(this.identZoneKiosque_mirroir, true);
					ObjetHtml_1.GHtml.setHtml(
						this.identLibelleAssociationKiosque,
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.AssocierAUnKiosque",
						),
					);
					ObjetStyle_1.GStyle.setDisplay(this.identDetailKiosque, false);
					ObjetHtml_1.GHtml.setDisplay(this.idBtnAssocierKiosque, true);
				}
			}
		}
	}
	actualiserQCM() {
		if (this.avecQCM && this.devoir) {
			if (this.devoir.executionQCM && this.devoir.executionQCM.existeNumero()) {
				ObjetHtml_1.GHtml.setDisabled(this.IdBareme, true);
				const lExecQCM = this.devoir.executionQCM;
				ObjetStyle_1.GStyle.setDisplay(this.identZoneQCM, true);
				if (this.avecModifQCM) {
					ObjetHtml_1.GHtml.setDisplay(
						this.idBtnAssocierQCM,
						lExecQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation,
					);
				}
				ObjetHtml_1.GHtml.setHtml(
					this.identLibelleAssociationQCM,
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.AssocieAUnQCM",
					) +
						" : " +
						lExecQCM.QCM.getLibelle(),
				);
				if (this.avecDetailPublicationQCM && !lExecQCM.estUnTAF) {
					ObjetStyle_1.GStyle.setDisplay(this.identDetailQCM, true);
					this.getInstance(this.identDisponibiliteQCM).setDonnees({
						dateDebutPublication: lExecQCM.dateDebutPublication,
						dateFinPublication: lExecQCM.dateFinPublication,
						actif: this.Actif && !this.devoir.verrouille,
						actifFin: !lExecQCM.estUnTAF,
					});
				} else {
					ObjetStyle_1.GStyle.setDisplay(this.identDetailQCM, false);
				}
			} else {
				if (
					!this.Actif ||
					this.devoir.verrouille ||
					this.leDevoirAAuMoinsUNeNote() === true
				) {
					ObjetStyle_1.GStyle.setDisplay(this.identZoneQCM, false);
				} else {
					ObjetStyle_1.GStyle.setDisplay(
						this.identZoneQCM,
						!this.devoir.execKiosque ||
							this.devoir.execKiosque.getEtat() ===
								Enumere_Etat_1.EGenreEtat.Suppression,
					);
					if (this.avecModifQCM) {
						ObjetHtml_1.GHtml.setDisplay(this.idBtnAssocierQCM, true);
					}
					ObjetHtml_1.GHtml.setHtml(
						this.identLibelleAssociationQCM,
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.AssocierAUnQCM",
						),
					);
					ObjetStyle_1.GStyle.setDisplay(this.identDetailQCM, false);
				}
			}
		}
	}
	composeFacultatif() {
		const T = [];
		T.push(
			`<ie-checkbox ie-model="cbFacultatif"><span id="${this.idLabelComboFacultatif}">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Facultatif")}</span></ie-checkbox>\n              <span ie-style="getStyleCarreFacultatif" class="carre-facultatif"></span>\n              <div id="${this.getNomInstance(this.idComboFacultatif)}"></div>\n              <ie-btnicon ie-model="btnMrFiche('${this.TypeMrFiche.Facultatif}')" class="m-left icon_question bt-activable"></ie-btnicon>`,
		);
		return T.join("");
	}
}
exports.ObjetFenetre_Devoir = ObjetFenetre_Devoir;
function _composeLibelleCategorie(aElement) {
	const T = [];
	T.push('<div ie-ellipsis class="cat-devoir-conteneur">');
	if (aElement.couleur) {
		T.push(
			'<span class="categorie-devoir" style="',
			ObjetStyle_1.GStyle.composeCouleurFond(aElement.couleur),
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
