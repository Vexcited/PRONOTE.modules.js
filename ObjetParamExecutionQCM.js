exports.ObjetParamExecutionQCM = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const ObjetDisponibilite_1 = require("ObjetDisponibilite");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ModuleEditeurHtml_1 = require("ModuleEditeurHtml");
const TypeNote_1 = require("TypeNote");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const DonneesListe_PersonnalisationPA_1 = require("DonneesListe_PersonnalisationPA");
const DonneesListe_SelectionElevePersonnalisationPA_1 = require("DonneesListe_SelectionElevePersonnalisationPA");
const ObjetListe_1 = require("ObjetListe");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteListElevesDExecQCM extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"listElevesDExecQCM",
	ObjetRequeteListElevesDExecQCM,
);
var TypeMelangeQuestions;
(function (TypeMelangeQuestions) {
	TypeMelangeQuestions[(TypeMelangeQuestions["Global"] = 0)] = "Global";
	TypeMelangeQuestions[(TypeMelangeQuestions["ParNiveau"] = 1)] = "ParNiveau";
})(TypeMelangeQuestions || (TypeMelangeQuestions = {}));
class ObjetParamExecutionQCM extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.listeNbQuestionsParEleve =
			new ObjetListeElements_1.ObjetListeElements();
		this.listeNbQuestionsAEnlever =
			new ObjetListeElements_1.ObjetListeElements();
		this.ids = {
			labelNbQuest: GUID_1.GUID.getId(),
			labelTypeMelangeQuest: GUID_1.GUID.getId(),
			labelNbExec: GUID_1.GUID.getId(),
		};
	}
	construireInstances() {
		this.identDisponibiliteQCM = this.add(
			ObjetDisponibilite_1.ObjetDisponibilite,
			this.evntSurDisponibiliteQCM,
			this.initDisponibiliteQCM,
		);
		this.editeur = ObjetIdentite_1.Identite.creerInstance(
			ModuleEditeurHtml_1.ModuleEditeurHtml,
			{ pere: this },
		);
		this.editeur.setParametres({
			gererModeExclusif: true,
			strLabel: "",
			classLabel: "",
			heightEdition: 60,
			minHeightEdition: 30,
			sideBySide: true,
			modeQCM: true,
			placeholder: ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.AucuneConsigne",
			),
			surExitChange: (aValeur, aSurBoutonEditeurRiche) => {
				if (
					this.executionQCM &&
					this.executionQCM.consigne !== undefined &&
					!this.initConsigne &&
					!ObjetChaine_1.GChaine.estChaineHTMLEgal(
						aValeur,
						this.executionQCM.consigne,
					)
				) {
					this.executionQCM.consigne = aValeur;
					this.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				if (
					!aSurBoutonEditeurRiche &&
					this.executionQCM &&
					this.executionQCM.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
				) {
					this.surModification();
				}
			},
			optionsTiny: IE.estMobile
				? {
						autoresize_bottom_margin: 0,
						autoresize_on_init: true,
						min_height: 60,
						max_height: 0,
						height: "",
						plugins: ["autoresize"],
					}
				: null,
		});
		this.idateCorrige = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: (aDate) => {
					if (!!this.executionQCM) {
						this.executionQCM.dateCorrige = aDate;
						this.surModification();
					}
				},
			},
		);
		this.idateCorrige.setOptionsObjetCelluleDate({
			formatDate: "%JJJ %J %MMM",
		});
		this.idateCorrige.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			null,
			null,
			null,
			null,
			null,
		);
	}
	estExecutionQCMEditable() {
		let lEstEditable = false;
		if (!this.estEnModeConsultation() && !!this.executionQCM) {
			const lEstUneExecutionQCM = this.estUneExecution || this.estPourExecution;
			if (!lEstUneExecutionQCM) {
				lEstEditable = true;
			} else {
				lEstEditable =
					!this.executionQCM.estVerrouille &&
					!this.executionQCM.avecPeriodeCloture;
			}
		}
		return lEstEditable;
	}
	getNombreQuestionsPresenteesALEleve() {
		let lNbQuestions = 0;
		if (!!this.executionQCM && !!this.executionQCM.nombreQuestionsSoumises) {
			lNbQuestions = this.executionQCM.nombreQuestionsSoumises;
		} else {
			const lQCM = this.getQCM();
			if (!!lQCM) {
				lNbQuestions = lQCM.nbQuestionsTotal;
			}
		}
		const lNbQuestionsObligatoires = this.getNombreQuestionsObligatoires();
		if (lNbQuestionsObligatoires) {
			lNbQuestions = Math.max(lNbQuestionsObligatoires, lNbQuestions);
		}
		return lNbQuestions;
	}
	estToutesLesQuestionsAvecMemeNote() {
		let lEstMemeNote = true;
		const lListeQuestions = this.getListeQuestions();
		if (!!lListeQuestions && lListeQuestions.getNbrElementsExistes()) {
			lEstMemeNote = false;
			let lNoteReference = null;
			lListeQuestions.parcourir((aQuestion) => {
				if (aQuestion.existe()) {
					if (lNoteReference === null) {
						lNoteReference = aQuestion.note;
						lEstMemeNote = true;
					} else if (aQuestion.note !== lNoteReference) {
						lEstMemeNote = false;
						return true;
					}
				}
			});
		}
		return lEstMemeNote;
	}
	possedeDesQuestionsAvecEvaluations() {
		let lResult = false;
		const lListeQuestions = this.getListeQuestions();
		if (!!lListeQuestions && lListeQuestions.getNbrElementsExistes()) {
			lListeQuestions.parcourir((aQuestion) => {
				if (aQuestion.existe()) {
					if (
						!!aQuestion.listeEvaluations &&
						aQuestion.listeEvaluations.getNbrElementsExistes() > 0
					) {
						lResult = true;
						return true;
					}
				}
			});
		}
		return lResult;
	}
	getListeQuestions() {
		const lQcm = this.getQCM();
		return !!lQcm && !!lQcm.contenuQCM ? lQcm.contenuQCM.listeQuestions : null;
	}
	getNombreQuestionsObligatoires() {
		let lNbQuestionsObligatoires = 0;
		const lListeQuestions = this.getListeQuestions();
		if (!!lListeQuestions && lListeQuestions.getNbrElementsExistes()) {
			lListeQuestions.parcourir((aQuestion) => {
				if (aQuestion && aQuestion.estObligatoire) {
					lNbQuestionsObligatoires++;
				}
			});
		} else if (this.getQCM() && this.getQCM().nombreQuestObligatoires) {
			lNbQuestionsObligatoires = this.getQCM().nombreQuestObligatoires;
		}
		return lNbQuestionsObligatoires;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			Resultats: {
				cbAfficherResultatNote: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.afficherResultatNote
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.afficherResultatNote = aValeur;
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
				cbAfficherResultatNiveauxMaitrise: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.afficherResultatNiveauMaitrise
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.afficherResultatNiveauMaitrise = aValeur;
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
			},
			Consigne: {
				nodeEditeur() {
					aInstance.editeur.initialiser();
				},
			},
			DiffusionCorrige: {
				radioTypeCorrige: {
					getValue(aTypeCorrige) {
						return (
							!!aInstance.executionQCM &&
							aInstance.executionQCM.modeDiffusionCorrige === aTypeCorrige
						);
					},
					setValue(aTypeCorrige) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.modeDiffusionCorrige = aTypeCorrige;
							UtilitaireQCM_1.UtilitaireQCM.verifierDateCorrection(
								aInstance.executionQCM,
							);
							aInstance.controleVisibiliteDateCorrige();
							aInstance.surModification();
						}
					},
					getDisabled(aTypeCorrige) {
						return (
							!aInstance.estExecutionQCMEditable() ||
							(aTypeCorrige ===
								TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans &&
								!aInstance.autoriserSansCorrige) ||
							(aTypeCorrige ===
								TypeModeCorrectionQCM_1.TypeModeCorrectionQCM
									.FBQ_CorrigeALaDate &&
								!aInstance.autoriserCorrigerALaDate) ||
							(aTypeCorrige !==
								TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans &&
								aInstance.executionQCM.nbMaxTentative > 1)
						);
					},
				},
				getNodeSelecDate: function () {
					aInstance.idateCorrige.initialiser();
					aInstance.controleVisibiliteDateCorrige();
				},
				libelleCorrigeDate: function () {
					return aInstance.estUneExecution
						? ObjetTraduction_1.GTraductions.getValeur(
								"FenetreParamExecutionQCM.CorrigeALaDate",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreParamExecutionQCM.CorrigeAUneDate",
							);
				},
				avecSelecteurDate: function () {
					return !!aInstance.estUneExecution;
				},
			},
			PresentationQuestions: {
				radioAvecToutesLesQuestions: {
					getValue(aAvecToutesQuestions) {
						const lNbQuestionsSoumises = !!aInstance.executionQCM
							? aInstance.executionQCM.nombreQuestionsSoumises
							: -1;
						return (
							(!!aInstance.executionQCM &&
								lNbQuestionsSoumises === 0 &&
								!!aAvecToutesQuestions) ||
							(lNbQuestionsSoumises !== 0 && !aAvecToutesQuestions)
						);
					},
					setValue(aAvecToutesQuestions) {
						if (!!aInstance.executionQCM) {
							const lFuncActualisationEtSvgde = () => {
								aInstance.actualiserListeQuestionsParEleve();
								aInstance.actualiserListeQuestionsAEnlever();
								aInstance.surModification();
							};
							if (!!aAvecToutesQuestions) {
								aInstance.executionQCM.nombreQuestionsSoumises = 0;
								const lQCM = aInstance.getQCM();
								aInstance.executionQCM.nombreDePoints =
									lQCM.nombreDePointsTotal;
								lFuncActualisationEtSvgde();
							} else {
								if (
									!aInstance.estToutesLesQuestionsAvecMemeNote() ||
									aInstance.possedeDesQuestionsAvecEvaluations()
								) {
									const lMsg = [];
									if (!aInstance.estToutesLesQuestionsAvecMemeNote()) {
										lMsg.push(
											ObjetTraduction_1.GTraductions.getValeur(
												"FenetreParamExecutionQCM.msgBareme",
											),
										);
									}
									if (aInstance.possedeDesQuestionsAvecEvaluations()) {
										lMsg.push(
											ObjetTraduction_1.GTraductions.getValeur(
												"FenetreParamExecutionQCM.msgEvaluations",
											),
										);
									}
									(0, AccessApp_1.getApp)()
										.getMessage()
										.afficher({
											type: Enumere_BoiteMessage_1.EGenreBoiteMessage
												.Information,
											message: lMsg.join("<br />"),
										});
								} else {
									aInstance.executionQCM.nombreQuestionsSoumises =
										aInstance.getNombreQuestionsObligatoires() || 1;
									aInstance.executionQCM.nombreQuestionsEnMoins = 0;
									aInstance.controleSiUnElevePerdSaPersonnalisationDuNbDeQuestions(
										lFuncActualisationEtSvgde,
									);
								}
							}
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
				comboNbQuestionsParEleve: {
					init(aInstanceCombo) {
						aInstanceCombo.setOptionsObjetSaisie({
							mode: Enumere_Saisie_1.EGenreSaisie.Combo,
							longueur: 30,
							avecBouton: true,
							labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreParamExecutionQCM.NbQuestions",
							),
							ariaLabelledBy: aInstance.ids.labelNbQuest,
						});
					},
					getDonnees() {
						return aInstance.listeNbQuestionsParEleve;
					},
					getIndiceSelection() {
						let lIndice = -1;
						if (
							!!aInstance.executionQCM &&
							!!aInstance.listeNbQuestionsParEleve
						) {
							const lNbQuestionsParEleve =
								aInstance.executionQCM.nombreQuestionsSoumises || 0;
							lIndice =
								aInstance.listeNbQuestionsParEleve.getIndiceParNumeroEtGenre(
									null,
									lNbQuestionsParEleve,
								);
						}
						return Math.max(0, lIndice);
					},
					event(aParametres, aInstanceCombo) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element &&
							aInstanceCombo.estUneInteractionUtilisateur()
						) {
							aInstance.executionQCM.nombreQuestionsSoumises =
								aParametres.element.getGenre();
							if (aInstance.executionQCM.nombreQuestionsSoumises === 1) {
								aInstance.executionQCM.nombreQuestionsEnMoins = 0;
							}
							const lFncActualisationEtSvgde = () => {
								aInstance.actualiserListeQuestionsAEnlever();
								aInstance.surModification();
							};
							aInstance.controleSiUnElevePerdSaPersonnalisationDuNbDeQuestions(
								lFncActualisationEtSvgde,
							);
						}
					},
					getDisabled() {
						const lRadioCorrespondante =
							this.controleur.PresentationQuestions.radioAvecToutesLesQuestions;
						return (
							!lRadioCorrespondante ||
							lRadioCorrespondante.getDisabled.call(this, false, this.node) ||
							!lRadioCorrespondante.getValue.call(this, false)
						);
					},
				},
				radioJeuQuestionsFixe: {
					getValue(aJeuFixe) {
						if (!!aJeuFixe) {
							return (
								!!aInstance.executionQCM &&
								!!aInstance.executionQCM.jeuQuestionFixe
							);
						} else {
							return (
								!!aInstance.executionQCM &&
								!aInstance.executionQCM.jeuQuestionFixe
							);
						}
					},
					setValue(aJeuFixe) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.jeuQuestionFixe = aJeuFixe;
							aInstance.surModification();
						}
					},
					getDisabled() {
						const lRadioCorrespondante =
							this.controleur.PresentationQuestions.radioAvecToutesLesQuestions;
						return (
							!lRadioCorrespondante ||
							lRadioCorrespondante.getDisabled.call(this, false, this.node) ||
							!lRadioCorrespondante.getValue.call(this, false)
						);
					},
				},
				cbHomogeneiserNbQuestParNiveau: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.homogeneiserNbQuestParNiveau
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.homogeneiserNbQuestParNiveau = aValeur;
							aInstance.surModification();
						}
					},
					getDisabled() {
						const lRadioCorrespondante =
							this.controleur.PresentationQuestions.radioAvecToutesLesQuestions;
						return (
							!lRadioCorrespondante ||
							lRadioCorrespondante.getDisabled.call(this, false, this.node) ||
							!lRadioCorrespondante.getValue.call(this, false)
						);
					},
				},
				cbMelangerQuestions: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							(!!aInstance.executionQCM.melangerLesQuestionsGlobalement ||
								!!aInstance.executionQCM.melangerLesQuestionsParNiveau)
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.melangerLesQuestionsGlobalement = aValeur;
							aInstance.executionQCM.melangerLesQuestionsParNiveau = false;
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
				comboTypeMelangeQuestions: {
					init(aInstanceCombo) {
						aInstanceCombo.setOptionsObjetSaisie({
							mode: Enumere_Saisie_1.EGenreSaisie.Combo,
							longueur: 100,
							avecBouton: true,
							ariaLabelledBy: aInstance.ids.labelTypeMelangeQuest,
							labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreParamExecutionQCM.TypeOrdreAleatoire",
							),
						});
					},
					getDonnees(aDonnees) {
						if (!aDonnees) {
							aDonnees = new ObjetListeElements_1.ObjetListeElements();
							aDonnees.add(
								new ObjetElement_1.ObjetElement(
									ObjetTraduction_1.GTraductions.getValeur(
										"FenetreParamExecutionQCM.MelangerQuestionGlobalement",
									),
									TypeMelangeQuestions.Global,
									TypeMelangeQuestions.Global,
								),
							);
							aDonnees.add(
								new ObjetElement_1.ObjetElement(
									ObjetTraduction_1.GTraductions.getValeur(
										"FenetreParamExecutionQCM.MelangerQuestionParNiveau",
									),
									TypeMelangeQuestions.ParNiveau,
									TypeMelangeQuestions.ParNiveau,
								),
							);
							return aDonnees;
						}
					},
					getIndiceSelection(aInstanceCombo) {
						let lIndice = -1;
						if (aInstanceCombo.getListeElements() && aInstance.executionQCM) {
							let lTypeMelange = TypeMelangeQuestions.Global;
							if (
								aInstance.executionQCM.melangerLesQuestionsParNiveau &&
								!aInstance.executionQCM.melangerLesQuestionsGlobalement
							) {
								lTypeMelange = TypeMelangeQuestions.ParNiveau;
							}
							lIndice = aInstanceCombo
								.getListeElements()
								.getIndiceParNumeroEtGenre(lTypeMelange, lTypeMelange);
						}
						return Math.max(lIndice, 0);
					},
					event(aParametres, aInstanceCombo) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element &&
							aInstanceCombo.estUneInteractionUtilisateur()
						) {
							if (aInstance.executionQCM) {
								aInstance.executionQCM.melangerLesQuestionsGlobalement = false;
								aInstance.executionQCM.melangerLesQuestionsParNiveau = false;
								let lTypeMelangeSelectionne = aParametres.element.getGenre();
								if (lTypeMelangeSelectionne === TypeMelangeQuestions.Global) {
									aInstance.executionQCM.melangerLesQuestionsGlobalement = true;
								} else if (
									lTypeMelangeSelectionne === TypeMelangeQuestions.ParNiveau
								) {
									aInstance.executionQCM.melangerLesQuestionsParNiveau = true;
								}
								aInstance.surModification();
							}
						}
					},
					getDisabled() {
						const lCBCorrespondante =
							this.controleur.PresentationQuestions.cbMelangerQuestions;
						return (
							!lCBCorrespondante ||
							lCBCorrespondante.getDisabled.call(this, this.node) ||
							!lCBCorrespondante.getValue.call(this)
						);
					},
				},
				cbAutoriserNavigation: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.autoriserLaNavigation
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.autoriserLaNavigation = aValeur;
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
				cbMelangerReponses: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.melangerLesReponses
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.melangerLesReponses = aValeur;
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
			},
			ConditionsExecution: {
				cbLimiterTempsReponse: {
					getValue() {
						return (
							!!aInstance.executionQCM && aInstance.executionQCM.dureeMaxQCM > 0
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							let lLimiteTpsReponse = 0;
							if (!!aValeur) {
								lLimiteTpsReponse = 60;
							} else {
								aInstance.executionQCM.dureeSupplementaire = 0;
							}
							aInstance.executionQCM.dureeMaxQCM =
								UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(
									lLimiteTpsReponse,
								);
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
				inputDureeMax: {
					getNote() {
						let lDureeMax = 60;
						if (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.dureeMaxQCM &&
							aInstance.executionQCM.dureeMaxQCM > 0
						) {
							lDureeMax = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
								aInstance.executionQCM.dureeMaxQCM,
							);
						}
						return new TypeNote_1.TypeNote(lDureeMax);
					},
					setNote(aValue) {
						if (!!aInstance.executionQCM) {
							let lDureeMax = 0;
							if (
								aValue !== null &&
								aValue !== undefined &&
								!aValue.estUneNoteVide()
							) {
								lDureeMax = aValue.getValeur();
							}
							aInstance.executionQCM.dureeMaxQCM =
								UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(lDureeMax);
							aInstance.surModification();
						}
					},
					getOptionsNote() {
						return {
							avecVirgule: false,
							afficherAvecVirgule: false,
							avecAnnotation: false,
							sansNotePossible: false,
							min: 1,
							max: 120,
							htmlContexte: IE.jsx.str(
								"div",
								{ class: "Gras" },
								ObjetTraduction_1.GTraductions.getValeur(
									"FenetreParamExecutionQCM.Minutes",
								),
							),
						};
					},
					getDisabled() {
						const lCBCorrespondante =
							this.controleur.ConditionsExecution.cbLimiterTempsReponse;
						return (
							!lCBCorrespondante ||
							lCBCorrespondante.getDisabled.call(this, this.node) ||
							!lCBCorrespondante.getValue.call(this)
						);
					},
				},
				cbEssaisExecution: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							aInstance.executionQCM.nbMaxTentative > 1
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							let lNbMaxTentative = 0;
							if (!!aValeur && aInstance.executionQCM.nbMaxTentative < 2) {
								lNbMaxTentative = 2;
								if (
									!!aInstance.bu_nbMaxTentative &&
									aInstance.bu_nbMaxTentative > 2
								) {
									lNbMaxTentative = aInstance.bu_nbMaxTentative;
								} else if (
									!!aInstance.executionQCM.QCM &&
									!!aInstance.executionQCM.QCM.nbMaxTentative &&
									aInstance.executionQCM.QCM.nbMaxTentative > 2
								) {
									lNbMaxTentative = aInstance.executionQCM.QCM.nbMaxTentative;
								}
							} else if (
								!aValeur &&
								aInstance.executionQCM.nbMaxTentative > 1
							) {
								aInstance.bu_nbMaxTentative =
									aInstance.executionQCM.nbMaxTentative;
							}
							aInstance.executionQCM.nbMaxTentative = lNbMaxTentative;
							aInstance.surModification();
						}
					},
					getDisabled() {
						return (
							!aInstance.estExecutionQCMEditable() ||
							aInstance.executionQCM.modeDiffusionCorrige !==
								TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans
						);
					},
				},
				comboNbExecutions: {
					init(aInstanceCombo) {
						aInstanceCombo.setOptionsObjetSaisie({
							mode: Enumere_Saisie_1.EGenreSaisie.Combo,
							longueur: 30,
							avecBouton: true,
							labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreParamExecutionQCM.nbExecutions",
							),
							ariaLabelledBy: aInstance.ids.labelNbExec,
						});
						const lListe = new ObjetListeElements_1.ObjetListeElements();
						for (let index = 2; index < 11; index++) {
							const element = new ObjetElement_1.ObjetElement(
								index.toString(),
								null,
								index,
							);
							lListe.add(element);
						}
						let lIndice = -1;
						if (
							!!aInstance.executionQCM &&
							aInstance.executionQCM.nbMaxTentative > 1
						) {
							lIndice = lListe.getIndiceParNumeroEtGenre(
								null,
								aInstance.executionQCM.nbMaxTentative,
							);
						}
						aInstanceCombo.setDonnees(lListe, lIndice);
					},
					event(aParametres, aInstanceCombo) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element &&
							aInstanceCombo.estUneInteractionUtilisateur()
						) {
							aInstance.executionQCM.nbMaxTentative =
								aParametres.element.getGenre();
							aInstance.surModification();
						}
					},
					getDisabled() {
						const lCBCorrespondante =
							this.controleur.ConditionsExecution.cbEssaisExecution;
						return (
							!lCBCorrespondante ||
							lCBCorrespondante.getDisabled.call(this, this.node) ||
							!lCBCorrespondante.getValue.call(this)
						);
					},
				},
			},
			PersonnalisationPA: {
				QCM: {
					cbTempsSupplementaire: {
						getValue() {
							return (
								!!aInstance.executionQCM &&
								aInstance.executionQCM.dureeSupplementaire > 0
							);
						},
						setValue(aValeur) {
							if (!!aInstance.executionQCM) {
								let lDureeSupplementaire = 0;
								if (!!aValeur) {
									lDureeSupplementaire = 30;
								}
								aInstance.executionQCM.dureeSupplementaire =
									UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(
										lDureeSupplementaire,
									);
								aInstance.surModification();
							}
						},
						getDisabled() {
							const lAUnTempsLimite = !!aInstance.executionQCM
								? aInstance.executionQCM.dureeMaxQCM > 0
								: false;
							return !aInstance.estExecutionQCMEditable() || !lAUnTempsLimite;
						},
					},
					inputTempsSupplementaire: {
						getNote() {
							let lTpsSupplementaire = 30;
							if (
								!!aInstance.executionQCM &&
								!!aInstance.executionQCM.dureeSupplementaire &&
								aInstance.executionQCM.dureeSupplementaire > 0
							) {
								lTpsSupplementaire =
									UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
										aInstance.executionQCM.dureeSupplementaire,
									);
							}
							return new TypeNote_1.TypeNote(lTpsSupplementaire);
						},
						setNote(aValue) {
							if (!!aInstance.executionQCM) {
								let lTpsSupplementaire = 0;
								if (!aValue.estUneNoteVide()) {
									lTpsSupplementaire = aValue.getValeur();
								}
								aInstance.executionQCM.dureeSupplementaire =
									UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(
										lTpsSupplementaire,
									);
								aInstance.surModification();
							}
						},
						getOptionsNote() {
							return {
								avecVirgule: false,
								afficherAvecVirgule: false,
								avecAnnotation: false,
								sansNotePossible: false,
								min: 1,
								max: 120,
							};
						},
						getDisabled() {
							const lCBCorrespondante =
								this.controleur.PersonnalisationPA.QCM.cbTempsSupplementaire;
							return (
								!lCBCorrespondante ||
								lCBCorrespondante.getDisabled.call(this, this.node) ||
								!lCBCorrespondante.getValue.call(this)
							);
						},
					},
					cbEnleverQuestions: {
						getValue() {
							return (
								!!aInstance.executionQCM &&
								!!aInstance.executionQCM.nombreQuestionsEnMoins &&
								aInstance.executionQCM.nombreQuestionsEnMoins > 0
							);
						},
						setValue(aValeur) {
							if (!!aInstance.executionQCM) {
								let lNbQuestionsEnMoins = 0;
								if (aValeur) {
									lNbQuestionsEnMoins = 1;
								}
								aInstance.executionQCM.nombreQuestionsEnMoins =
									lNbQuestionsEnMoins;
								aInstance.actualiserListeQuestionsAEnlever();
								aInstance.surModification();
							}
						},
						getDisabled() {
							return (
								!aInstance.estExecutionQCMEditable() ||
								aInstance.listeNbQuestionsAEnlever.count() <= 1
							);
						},
					},
					comboNbQuestionsAEnlever: {
						init(aInstanceCombo) {
							aInstanceCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								longueur: 30,
								avecBouton: true,
								labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
									"FenetreParamExecutionQCM.NombreQuestionsAEnlever",
								),
							});
						},
						getDonnees() {
							return aInstance.listeNbQuestionsAEnlever;
						},
						getIndiceSelection() {
							let lIndice = -1;
							if (
								!!aInstance.executionQCM &&
								!!aInstance.listeNbQuestionsAEnlever
							) {
								const lNbQuestionsAEnlever =
									aInstance.executionQCM.nombreQuestionsEnMoins || 0;
								lIndice =
									aInstance.listeNbQuestionsAEnlever.getIndiceParNumeroEtGenre(
										null,
										lNbQuestionsAEnlever,
									);
							}
							return Math.max(0, lIndice);
						},
						event(aParametres, aInstanceCombo) {
							if (
								aParametres.genreEvenement ===
									Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
										.selection &&
								aParametres.element &&
								aInstanceCombo.estUneInteractionUtilisateur()
							) {
								aInstance.executionQCM.nombreQuestionsEnMoins =
									aParametres.element.getGenre();
								aInstance.surModification();
							}
						},
						getDisabled() {
							const lCBCorrespondante =
								this.controleur.PersonnalisationPA.QCM.cbEnleverQuestions;
							return (
								!lCBCorrespondante ||
								lCBCorrespondante.getDisabled.call(this, this.node) ||
								!lCBCorrespondante.getValue.call(this)
							);
						},
					},
				},
				ExecutionQCM: {
					btnPersonnalisation: {
						event() {
							if (aInstance.personnalisationPAPossible()) {
								const lOptions = aInstance.getOptionsPersonnalisationPA();
								aInstance.listeElevesPAEnEdition =
									new ObjetListeElements_1.ObjetListeElements();
								if (aInstance.executionQCM.listeElevesPA) {
									aInstance.listeElevesPAEnEdition =
										MethodesObjet_1.MethodesObjet.dupliquer(
											aInstance.executionQCM.listeElevesPA,
										);
									aInstance.listeElevesPAEnEdition.setTri([
										ObjetTri_1.ObjetTri.init("eleve.Position"),
									]);
									aInstance.listeElevesPAEnEdition.trier();
								}
								aInstance.fenetrePA =
									ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
										ObjetFenetre_Liste_1.ObjetFenetre_Liste,
										{
											pere: aInstance,
											initialiser(aInstanceFenetreListe) {
												const lColonnes = [];
												lColonnes.push({
													id: DonneesListe_PersonnalisationPA_1
														.DonneesListe_PersonnalisationPA.colonnes.nom,
													titre: ObjetTraduction_1.GTraductions.getValeur(
														"FenetreParamExecutionQCM.FenetrePersonnalisation.colonne.nom",
													),
													taille: 200,
												});
												lColonnes.push({
													id: DonneesListe_PersonnalisationPA_1
														.DonneesListe_PersonnalisationPA.colonnes.projet,
													titre: ObjetTraduction_1.GTraductions.getValeur(
														"FenetreParamExecutionQCM.FenetrePersonnalisation.colonne.projet",
													),
													taille: "100%",
												});
												lColonnes.push({
													id: DonneesListe_PersonnalisationPA_1
														.DonneesListe_PersonnalisationPA.colonnes
														.dureeSuppl,
													titre: {
														libelle: ObjetTraduction_1.GTraductions.getValeur(
															"FenetreParamExecutionQCM.FenetrePersonnalisation.colonne.dureeSuppl",
														),
														nbLignes: 3,
													},
													taille: 100,
												});
												lColonnes.push({
													id: DonneesListe_PersonnalisationPA_1
														.DonneesListe_PersonnalisationPA.colonnes
														.questEnMoins,
													titre: {
														libelle: ObjetTraduction_1.GTraductions.getValeur(
															"FenetreParamExecutionQCM.FenetrePersonnalisation.colonne.questEnMoins",
														),
														nbLignes: 2,
													},
													taille: 100,
												});
												const lColonnesCachees = [];
												if (!lOptions.avecTempsSupplementaire) {
													lColonnesCachees.push(
														DonneesListe_PersonnalisationPA_1
															.DonneesListe_PersonnalisationPA.colonnes
															.dureeSuppl,
													);
												}
												if (!lOptions.avecQuestionsEnMoins) {
													lColonnesCachees.push(
														DonneesListe_PersonnalisationPA_1
															.DonneesListe_PersonnalisationPA.colonnes
															.questEnMoins,
													);
												}
												const lParamsListe = {
													optionsListe: {
														colonnes: lColonnes,
														colonnesCachees: lColonnesCachees,
														boutons: [
															{
																genre:
																	ObjetListe_1.ObjetListe.typeBouton.supprimer,
															},
														],
														hauteurAdapteContenu: true,
														hauteurMaxAdapteContenu: 700,
													},
													avecLigneCreation:
														aInstance.estExecutionQCMEditable(),
													titreCreation:
														ObjetTraduction_1.GTraductions.getValeur(
															"FenetreParamExecutionQCM.FenetrePersonnalisation.ajouter",
														),
													callbckCreation:
														aInstance._evntSurAjout.bind(aInstance),
												};
												aInstanceFenetreListe.setOptionsFenetre({
													titre: ObjetTraduction_1.GTraductions.getValeur(
														"FenetreParamExecutionQCM.FenetrePersonnalisation.titre",
													),
													largeur: 720,
													hauteur: null,
													listeBoutons: [
														ObjetTraduction_1.GTraductions.getValeur("Annuler"),
														ObjetTraduction_1.GTraductions.getValeur("Valider"),
													],
												});
												aInstanceFenetreListe.paramsListe = lParamsListe;
											},
											evenement(aNumeroBouton) {
												if (aNumeroBouton === 1) {
													this.executionQCM.listeElevesPA =
														MethodesObjet_1.MethodesObjet.dupliquer(
															this.listeElevesPAEnEdition,
														);
													if (
														this.executionQCM.listeElevesPA.existeElementPourValidation()
													) {
														this.executionQCM.setEtat(
															Enumere_Etat_1.EGenreEtat.Modification,
														);
														this.surModification();
													}
												} else {
												}
												this.fenetrePA = null;
												this.listeElevesPAEnEdition = null;
											},
										},
									);
								const lNbQuestionsPresenteesALEleve =
									aInstance.getNombreQuestionsPresenteesALEleve();
								const lNbQuestionsObligatoires =
									aInstance.getNombreQuestionsObligatoires();
								let lMaxNbQuestionsAEnlever;
								if (lNbQuestionsObligatoires) {
									lMaxNbQuestionsAEnlever =
										lNbQuestionsPresenteesALEleve - lNbQuestionsObligatoires;
								} else {
									lMaxNbQuestionsAEnlever = lNbQuestionsPresenteesALEleve - 1;
								}
								aInstance.fenetrePA.setDonnees(
									new DonneesListe_PersonnalisationPA_1.DonneesListe_PersonnalisationPA(
										aInstance.listeElevesPAEnEdition,
										{
											avecEdition: aInstance.estExecutionQCMEditable(),
											avecSuppression: aInstance.estExecutionQCMEditable(),
											avecEvnt_Creation: aInstance.estExecutionQCMEditable(),
											maxNbrQuestions: lMaxNbQuestionsAEnlever,
										},
									),
								);
							}
						},
						getLibelle() {
							let lLibelle = "";
							if (aInstance.executionQCM) {
								if (aInstance.personnalisationPAPossible()) {
									const lNbrElevesPersonnalises = aInstance.executionQCM
										.listeElevesPA
										? aInstance.executionQCM.listeElevesPA.getNbrElementsExistes()
										: 0;
									if (lNbrElevesPersonnalises > 1) {
										lLibelle = ObjetTraduction_1.GTraductions.getValeur(
											"FenetreParamExecutionQCM.PersonnalisationPourNEleves",
											[lNbrElevesPersonnalises],
										);
									} else if (lNbrElevesPersonnalises === 1) {
										lLibelle = ObjetTraduction_1.GTraductions.getValeur(
											"FenetreParamExecutionQCM.PersonnalisationPourNEleve",
											[lNbrElevesPersonnalises],
										);
									} else {
										lLibelle = ObjetTraduction_1.GTraductions.getValeur(
											"FenetreParamExecutionQCM.PersonnalisationPour0Eleve",
										);
									}
								} else {
									lLibelle = ObjetTraduction_1.GTraductions.getValeur(
										"FenetreParamExecutionQCM.AucunePersonnalisationPAPossible",
									);
								}
							}
							return lLibelle;
						},
					},
				},
			},
			Assouplissement: {
				cbPointsSelonPourcentage: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.pointsSelonPourcentage
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.pointsSelonPourcentage = aValeur;
							if (!!aValeur) {
								aInstance.executionQCM.acceptIncomplet = false;
								aInstance.executionQCM.tolererFausses = false;
							}
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
				mrFicheReglesAssouplissement: {
					event() {
						const lElementControleur =
							aInstance.getTraductionMrFicheReglesAssouplissement();
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({ idRessource: lElementControleur.idRessource });
					},
					getTitle: function () {
						const lElementControleur =
							aInstance.getTraductionMrFicheReglesAssouplissement();
						return lElementControleur.titre;
					},
				},
				cbAccepterIncomplet: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.acceptIncomplet
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.acceptIncomplet = aValeur;
							if (!!aValeur) {
								aInstance.executionQCM.pointsSelonPourcentage = false;
							}
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
				cbTolererFausses: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.tolererFausses
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.tolererFausses = aValeur;
							if (!!aValeur) {
								aInstance.executionQCM.pointsSelonPourcentage = false;
							}
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
			},
			RessentiEleve: {
				cbPermettreRessenti: {
					getValue() {
						return (
							!!aInstance.executionQCM &&
							!!aInstance.executionQCM.ressentiRepondant
						);
					},
					setValue(aValeur) {
						if (!!aInstance.executionQCM) {
							aInstance.executionQCM.ressentiRepondant = aValeur;
							aInstance.surModification();
						}
					},
					getDisabled() {
						return !aInstance.estExecutionQCMEditable();
					},
				},
			},
		});
	}
	getTraductionMrFicheReglesAssouplissement() {
		const lCle = "FenetreParamExecutionQCM.MFicheAssouplissement";
		return {
			idRessource: lCle,
			titre: ObjetTraduction_1.GTraductions.getTitreMFiche(lCle),
		};
	}
	controleVisibiliteDateCorrige() {
		let lDate;
		let lActif = false;
		if (!!this.executionQCM) {
			lDate = this.executionQCM.dateCorrige;
		}
		if (
			!!this.executionQCM &&
			this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate
		) {
			lActif = this.estExecutionQCMEditable();
		}
		this.idateCorrige.setActif(lActif);
		this.idateCorrige.setDonnees(lDate);
	}
	controleSiUnElevePerdSaPersonnalisationDuNbDeQuestions(aFonctionCallback) {
		let lAuMoinsUnElevePerdSaPersonnalisationDeQuest = false;
		if (this.executionQCM.listeElevesPA) {
			this.executionQCM.listeElevesPA.parcourir((aElevePA) => {
				if (aElevePA.nombreQuestionsEnMoins > 0) {
					if (
						this.executionQCM.nombreQuestionsSoumises <=
						aElevePA.nombreQuestionsEnMoins
					) {
						lAuMoinsUnElevePerdSaPersonnalisationDeQuest = true;
						return false;
					}
				}
			});
		}
		if (lAuMoinsUnElevePerdSaPersonnalisationDeQuest) {
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.MessagePersonnalisationNonPriseEnCompte",
					),
					callback: aFonctionCallback,
				});
		} else {
			aFonctionCallback();
		}
	}
	personnalisationPAPossible() {
		const lOptions = this.getOptionsPersonnalisationPA();
		return lOptions.avecQuestionsEnMoins || lOptions.avecTempsSupplementaire;
	}
	getOptionsPersonnalisationPA() {
		const lNbrQuestions = this.getNombreQuestionsPresenteesALEleve();
		const lNbQuestionsObligatoires = this.getNombreQuestionsObligatoires();
		let lMaxNbQuestionsAEnlever;
		if (lNbQuestionsObligatoires) {
			lMaxNbQuestionsAEnlever = lNbrQuestions - lNbQuestionsObligatoires;
		} else {
			lMaxNbQuestionsAEnlever = lNbrQuestions - 1;
		}
		const lAvecQuestionsEnMoins = lMaxNbQuestionsAEnlever > 0;
		const lAvecTempsSupplementaire = this.executionQCM
			? this.executionQCM.dureeMaxQCM > 0
			: false;
		let lNbrQuestEnMoinsParDefaut = 0;
		let lDureeParDefaut = 0;
		if (!!lAvecQuestionsEnMoins && !!lAvecTempsSupplementaire) {
			lNbrQuestEnMoinsParDefaut =
				!this.executionQCM.nombreQuestionsEnMoins &&
				!this.executionQCM.dureeSupplementaire
					? 1
					: this.executionQCM.nombreQuestionsEnMoins;
			lDureeParDefaut = this.executionQCM.dureeSupplementaire;
		} else if (!!lAvecQuestionsEnMoins) {
			lNbrQuestEnMoinsParDefaut = !this.executionQCM.nombreQuestionsEnMoins
				? 1
				: this.executionQCM.nombreQuestionsEnMoins;
		} else if (!!lAvecTempsSupplementaire) {
			lDureeParDefaut = !this.executionQCM.dureeSupplementaire
				? UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(30)
				: this.executionQCM.dureeSupplementaire;
		}
		return {
			avecQuestionsEnMoins: lAvecQuestionsEnMoins,
			avecTempsSupplementaire: lAvecTempsSupplementaire,
			nbrQuestEnMoinsParDefault: lNbrQuestEnMoinsParDefaut,
			dureeParDefault: lDureeParDefaut,
		};
	}
	_evntSurAjout() {
		new ObjetRequeteListElevesDExecQCM(this)
			.lancerRequete({ executionQCM: this.executionQCM.toJSONAll() })
			.then((aReponse) => {
				this.actionApresListeEleves(aReponse);
			});
		return true;
	}
	estEnModeConsultation() {
		return !this.getActif();
	}
	initDisponibiliteQCM(aInstance) {
		aInstance.setOptionsAffichage({
			afficherSurUneSeuleLigne: true,
			afficherEnModeForm: this.afficherEnModeForm,
			chaines: [
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.DispoDu"),
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Au"),
			],
			avecHeureDebut: true,
			avecHeureFin: !!this.executionQCM,
		});
	}
	setDonnees(aDonnees) {
		this.estUneExecution = aDonnees.estUneExecution;
		this.estPourExecution = aDonnees.estPourExecution;
		this.avecConsigne = aDonnees.avecConsigne;
		this.avecPersonnalisationProjetAccompagnement =
			aDonnees.avecPersonnalisationProjetAccompagnement;
		this.afficherDatesPublication = aDonnees.afficherDatesPublication;
		this.afficherModeQuestionnaire = aDonnees.afficherModeQuestionnaire;
		this.afficherRessentiEleve = aDonnees.afficherRessentiEleve;
		this.afficherAssouplissement =
			aDonnees.afficherAssouplissement !== undefined
				? !!aDonnees.afficherAssouplissement
				: true;
		this.autoriserSansCorrige = aDonnees.autoriserSansCorrige;
		this.autoriserCorrigerALaDate = aDonnees.autoriserCorrigerALaDate;
		this.avecModeCorrigeALaDate = aDonnees.avecModeCorrigeALaDate;
		this.avecMultipleExecutions = aDonnees.avecMultipleExecutions;
		this.executionQCM = aDonnees.executionQCM;
		this.afficherEnModeForm =
			aDonnees.afficherEnModeForm !== null &&
			aDonnees.afficherEnModeForm !== undefined
				? aDonnees.afficherEnModeForm
				: false;
		if (aDonnees.ObjetFenetre_DetailsPIEleve) {
			DonneesListe_PersonnalisationPA_1.DonneesListe_PersonnalisationPA.setFenetreDetailsPIEleve(
				aDonnees.ObjetFenetre_DetailsPIEleve,
			);
		}
		this.actualiserListeQuestionsParEleve();
		this.actualiserListeQuestionsAEnlever();
		this.initConsigne = true;
		this.initDisponibiliteQCM(this.getInstance(this.identDisponibiliteQCM));
		if (this.avecModeCorrigeALaDate) {
			if (
				this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate
			) {
				this.idateCorrige.setDonnees(this.executionQCM.dateCorrige);
			}
		}
	}
	surModification() {
		this.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.callback.appel();
	}
	actualiser() {
		this.initConsigne = false;
		const lEnModeConsultation = this.estEnModeConsultation();
		if (this.executionQCM) {
			if (
				(this.estUneExecution || this.estPourExecution) &&
				this.afficherDatesPublication
			) {
				this.getInstance(this.identDisponibiliteQCM).setDonnees({
					dateDebutPublication: this.executionQCM.dateDebutPublication,
					dateFinPublication: this.executionQCM.dateFinPublication,
					actif: !lEnModeConsultation && !this.executionQCM.estUnProgression,
					actifFin:
						(!!this.executionQCM.estLieADevoir ||
							!!this.executionQCM.estLieAEvaluation) &&
						!this.executionQCM.estUnTAF &&
						!lEnModeConsultation,
				});
			}
			if (this.avecConsigne && this.executionQCM.consigne !== undefined) {
				const lConsigne = this.executionQCM.consigne || "";
				this.editeur.setDonnees(lConsigne);
				this.setEtatEditeur();
			}
			if (this.avecPersonnalisationProjetAccompagnement) {
			}
		}
	}
	setEtatEditeur() {
		if (this.avecConsigne && this.executionQCM.consigne !== undefined) {
			this.editeur.setActif(
				!this.estEnModeConsultation() &&
					(!this.estUneExecution || !this.executionQCM.estVerrouille),
			);
		}
	}
	getQCM() {
		return this.estUneExecution ? this.executionQCM.QCM : this.executionQCM;
	}
	actualiserListeQuestionsParEleve() {
		this.listeNbQuestionsParEleve.vider();
		if (this.getQCM()) {
			const lNbrQuestionsTotalQCM = this.getQCM().nbQuestionsTotal;
			if (!!this.executionQCM) {
				const lElementVide = new ObjetElement_1.ObjetElement("", null, 0);
				if (this.executionQCM.nombreQuestionsSoumises > 0) {
					lElementVide.Visible = false;
				}
				this.listeNbQuestionsParEleve.addElement(lElementVide);
			}
			let lIndexDepart = Math.max(this.getNombreQuestionsObligatoires(), 1);
			for (let i = lIndexDepart; i <= lNbrQuestionsTotalQCM; i++) {
				this.listeNbQuestionsParEleve.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetChaine_1.GChaine.cardinalToStr(i),
						null,
						i,
					),
				);
			}
		}
	}
	actualiserListeQuestionsAEnlever() {
		this.listeNbQuestionsAEnlever.vider();
		if (this.executionQCM) {
			const lNbQuestionsPresenteesALEleve =
				this.getNombreQuestionsPresenteesALEleve();
			const lNbQuestionsObligatoires = Math.max(
				1,
				this.getNombreQuestionsObligatoires(),
			);
			const lNbQuestionsMaxAEnlever =
				lNbQuestionsPresenteesALEleve - lNbQuestionsObligatoires;
			const lElementVide = new ObjetElement_1.ObjetElement("", null, 0);
			if (this.executionQCM.nombreQuestionsEnMoins > 0) {
				lElementVide.Visible = false;
			}
			this.listeNbQuestionsAEnlever.addElement(lElementVide);
			for (let i = 1; i <= lNbQuestionsMaxAEnlever; i++) {
				this.listeNbQuestionsAEnlever.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetChaine_1.GChaine.cardinalToStr(i),
						null,
						i,
					),
				);
			}
		}
	}
	evntSurDisponibiliteQCM(aDonnees, aSansMaj) {
		$.extend(this.executionQCM, aDonnees);
		if (!aSansMaj) {
			this.getInstance(this.identDisponibiliteQCM).setDonnees({
				dateDebutPublication: this.executionQCM.dateDebutPublication,
				dateFinPublication: this.executionQCM.dateFinPublication,
				actif: true,
				actifFin:
					(this.executionQCM.estLieADevoir ||
						this.executionQCM.estLieAEvaluation) &&
					!this.executionQCM.estUnTAF,
			});
		}
		this.surModification();
	}
	composeFieldset(aObj) {
		const T = [];
		if (aObj.modeForm) {
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "field-contain" },
						IE.jsx.str("label", { class: "active ie-titre-petit" }, aObj.titre),
						IE.jsx.str("div", { class: "flex-contain cols" }, aObj.contenu),
					),
				),
			);
		} else {
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "ZoneFieldset" },
						IE.jsx.str("div", { class: "TitreFieldset" }, aObj.titre),
						IE.jsx.str("div", { class: "ContenuFieldset" }, aObj.contenu),
					),
				),
			);
		}
		return T.join("");
	}
	composeIECheckbox(aNomIEModel, aLibelle, aClass = []) {
		const T = [];
		const lClass = aClass !== null && aClass !== undefined ? aClass : [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": aNomIEModel, class: lClass },
					aLibelle,
				),
			),
		);
		return T.join("");
	}
	composeFieldCheckbox(aParam) {
		const T = [];
		const lClass =
			aParam.class !== null && aParam.class !== undefined
				? aParam.class
				: ["m-top-xl"];
		T.push(this.composeIECheckbox(aParam.model, aParam.libelle, lClass));
		return T.join("");
	}
	composeFieldRadio(aParam) {
		const T = [];
		T.push(
			this.composeIERadio(aParam.nameGroup, aParam.model, aParam.libelle, [
				"m-top-xl",
			]),
		);
		return T.join("");
	}
	composeIERadio(aNameGroupeRadios, aNomIEModel, aLibelle, aClass = []) {
		const T = [];
		const lClass = aClass !== null && aClass !== undefined ? aClass : [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-radio",
					{ name: aNameGroupeRadios, "ie-model": aNomIEModel, class: lClass },
					aLibelle,
				),
			),
		);
		return T.join("");
	}
	composeContenu() {
		const T = [];
		if (this.executionQCM) {
			if (this.afficherEnModeForm) {
				T.push(this.composeContenuModeForm());
			} else {
				T.push(this.composeContenuDesktop());
			}
		}
		return T.join("");
	}
	composeContenuModeForm() {
		const lContenuObjParamExecution = [];
		if (this.estUneExecution || this.estPourExecution) {
			if (this.afficherDatesPublication) {
				lContenuObjParamExecution.push(this.composeDatesPublication(true));
			}
			lContenuObjParamExecution.push(this.composeVerrou());
		}
		if (this.avecConsigne) {
			lContenuObjParamExecution.push(this.composeConsigne(true));
		}
		lContenuObjParamExecution.push(this.composeFieldDiffusionCorriges());
		lContenuObjParamExecution.push(this.composeFieldPresentationQuestions());
		lContenuObjParamExecution.push(this.composeFieldConditionsExecution());
		if (this.afficherRessentiEleve) {
			lContenuObjParamExecution.push(this.composeFieldRessentiEleve());
		}
		lContenuObjParamExecution.push(this.composeInfoOptionsReduites());
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ id: this.Nom, class: "ObjetParamExecutionQCM" },
				lContenuObjParamExecution.join(""),
			),
		);
		return T.join("");
	}
	composeInfoOptionsReduites() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "ie-titre-petit m-top-xl" },
					"* ",
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.msgOptionsReduites",
					),
				),
			),
		);
		return T.join("");
	}
	composeVerrou() {
		const T = [];
		if (
			this.executionQCM.estVerrouille ||
			this.executionQCM.avecPeriodeCloture
		) {
			let lMsgVerrou = [
				ObjetChaine_1.GChaine.replaceRCToHTML(
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.ExecVerrouillee",
					),
				),
			];
			if (this.executionQCM.estVerrouille) {
				if (this.executionQCM.nbRepondu > 0) {
					lMsgVerrou.push(
						ObjetChaine_1.GChaine.replaceRCToHTML(
							ObjetTraduction_1.GTraductions.getValeur(
								"QCM_Divers.ExecDejaRepondu",
							),
						),
					);
				}
			}
			if (this.executionQCM.avecPeriodeCloture) {
				lMsgVerrou.push(
					ObjetChaine_1.GChaine.replaceRCToHTML(
						ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.ExecPeriodeCloture",
						),
					),
				);
			}
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "BlocMessageVerrou" },
						lMsgVerrou.join("<br />"),
					),
				),
			);
		}
		return T.join("");
	}
	composeContenuDesktop() {
		const T = [];
		T.push('<div id="', this.Nom, '" class="Espace ObjetParamExecutionQCM">');
		if (this.estUneExecution || this.estPourExecution) {
			if (this.afficherDatesPublication) {
				T.push(
					'<div class="BlocDatesPublication">',
					this.composeDatesPublication(),
					"</div>",
				);
			}
			if (
				this.executionQCM.estVerrouille ||
				this.executionQCM.avecPeriodeCloture
			) {
				T.push('<div class="BlocMessageVerrou">');
				T.push(
					ObjetChaine_1.GChaine.replaceRCToHTML(
						ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.ExecVerrouillee",
						),
					),
				);
				if (this.executionQCM.estVerrouille) {
					if (this.executionQCM.nbRepondu > 0) {
						T.push(
							"<br />",
							ObjetChaine_1.GChaine.replaceRCToHTML(
								ObjetTraduction_1.GTraductions.getValeur(
									"QCM_Divers.ExecDejaRepondu",
								),
							),
						);
					}
				}
				if (this.executionQCM.avecPeriodeCloture) {
					T.push(
						"<br />",
						ObjetChaine_1.GChaine.replaceRCToHTML(
							ObjetTraduction_1.GTraductions.getValeur(
								"QCM_Divers.ExecPeriodeCloture",
							),
						),
					);
				}
				T.push("</div>");
			}
			if (this.afficherModeQuestionnaire) {
				T.push("<div>", this.composeModeQuestionnaire(), "</div>");
			}
		}
		if (this.avecConsigne) {
			T.push("<div>", this.composeConsigne(), "</div>");
		}
		T.push("<div>", this.composeDiffusionCorriges(), "</div>");
		T.push("<div>", this.composePresentationQuestions(), "</div>");
		T.push("<div>", this.composeConditionsExecution(), "</div>");
		if (this.avecPersonnalisationProjetAccompagnement) {
			T.push(
				"<div>",
				this.composePersonnalisationProjetAccompagnement(),
				"</div>",
			);
		}
		if (this.afficherAssouplissement) {
			T.push("<div>", this.composeAssouplissement(), "</div>");
		}
		if (this.afficherRessentiEleve) {
			T.push("<div>", this.composeRessentiEleve(), "</div>");
		}
		T.push("</div>");
		return T.join("");
	}
	composeDatesPublication(aAvecModeForm = false) {
		let lClass = aAvecModeForm ? ["field-contain"] : [];
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identDisponibiliteQCM),
				class: lClass,
			}),
		);
	}
	composeModeQuestionnaire() {
		const T = [];
		if (this.executionQCM.estLieAEvaluation) {
			T.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.ResultatAvecEvaluationComptabilisee",
				),
			);
		}
		if (this.executionQCM.estLieADevoir) {
			if (T.length > 0) {
				T.push("<br/>");
			}
			T.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.ResultatAvecNoteComptabilisee",
				),
			);
			if (this.executionQCM.ramenerSur20) {
				const lBaremeParDefaut = !!this.executionQCM.baremeDevoirParDefaut
					? this.executionQCM.baremeDevoirParDefaut
					: GParametres.baremeNotation;
				if (!!lBaremeParDefaut) {
					T.push("&nbsp;/&nbsp;", lBaremeParDefaut.getValeur());
				}
			}
		}
		if (
			!this.executionQCM.estLieADevoir &&
			!this.executionQCM.estLieAEvaluation
		) {
			let lOnAfficheOptionCartoucheInformatif = false;
			if (
				!!!!this.executionQCM.QCM &&
				this.executionQCM.QCM.nbCompetencesTotal
			) {
				lOnAfficheOptionCartoucheInformatif = true;
				if (
					!!this.executionQCM.listeServices &&
					this.executionQCM.listeServices.count() > 0 &&
					!!this.executionQCM.QCM
						.listeServicesCompatiblesAvecCompetencesDuQCM &&
					this.executionQCM.QCM.listeServicesCompatiblesAvecCompetencesDuQCM.count() >
						0
				) {
					lOnAfficheOptionCartoucheInformatif = false;
					const lListeServicesQCMCompatibles =
						this.executionQCM.QCM.listeServicesCompatiblesAvecCompetencesDuQCM;
					this.executionQCM.listeServices.parcourir((aServiceExecQCM) => {
						if (
							!!aServiceExecQCM &&
							!!lListeServicesQCMCompatibles.getElementParElement(
								aServiceExecQCM,
							)
						) {
							lOnAfficheOptionCartoucheInformatif = true;
							return false;
						}
					});
				}
			}
			if (lOnAfficheOptionCartoucheInformatif) {
				T.push(
					'<div class="OptionParamExecution">',
					this.composeIECheckbox(
						"Resultats.cbAfficherResultatNiveauxMaitrise",
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.ResultatAfficherCartoucheInformatif",
						),
					),
					"</div>",
				);
			}
			T.push(
				'<div class="OptionParamExecution">',
				this.composeIECheckbox(
					"Resultats.cbAfficherResultatNote",
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.ResultatAfficherNoteInformatif",
					),
				),
				"</div>",
			);
		}
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.ResultatTitre",
			),
			contenu: T.join(""),
		});
	}
	composeConsigne(aAvecModeForm = false) {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("div", {
					class: "ObjetParamExecutionQCM_Editeur",
					id: this.editeur.getNom(),
					"ie-node": "Consigne.nodeEditeur",
				}),
			),
		);
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Consigne"),
			contenu: T.join(""),
			modeForm: aAvecModeForm,
		});
	}
	composeFieldDiffusionCorriges() {
		const T = [];
		const lNameGroupeRadio = "diffusionCorrige";
		const lIEModel = "DiffusionCorrige.radioTypeCorrige";
		T.push(
			this.composeFieldRadio({
				nameGroup: lNameGroupeRadio,
				model:
					lIEModel +
					"(" +
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans +
					")",
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.CorrigeSans",
				),
			}),
		);
		T.push(
			this.composeFieldRadio({
				nameGroup: lNameGroupeRadio,
				model:
					lIEModel +
					"(" +
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM
						.FBQ_CorrigeApresQuestion +
					")",
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.CorrigeApresChaqueQuestion",
				),
			}),
		);
		T.push(
			this.composeFieldRadio({
				nameGroup: lNameGroupeRadio,
				model:
					lIEModel +
					"(" +
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin +
					")",
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.CorrigeALaFin",
				),
			}),
		);
		if (this.avecModeCorrigeALaDate) {
			T.push(
				this.composeFieldRadio({
					nameGroup: lNameGroupeRadio,
					model:
						lIEModel +
						"(" +
						TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate +
						")",
					libelle:
						'<span ie-texte="DiffusionCorrige.libelleCorrigeDate"></span>',
				}),
			);
			T.push(
				IE.jsx.str("div", {
					id: this.idateCorrige.getNom(),
					"ie-if": "DiffusionCorrige.avecSelecteurDate",
					"ie-node": "DiffusionCorrige.getNodeSelecDate",
					class: "self-end m-top-l",
				}),
			);
		}
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.DiffusionCorriges",
			),
			contenu: T.join(""),
			modeForm: true,
		});
	}
	composeDiffusionCorriges() {
		const T = [];
		const lNameGroupeRadio = "diffusionCorrige";
		const lIEModel = "DiffusionCorrige.radioTypeCorrige";
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIERadio(
				lNameGroupeRadio,
				lIEModel +
					"(" +
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans +
					")",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.CorrigeSans",
				),
			),
			"</div>",
		);
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIERadio(
				lNameGroupeRadio,
				lIEModel +
					"(" +
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM
						.FBQ_CorrigeApresQuestion +
					")",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.CorrigeApresChaqueQuestion",
				),
			),
			"</div>",
		);
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIERadio(
				lNameGroupeRadio,
				lIEModel +
					"(" +
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin +
					")",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.CorrigeALaFin",
				),
			),
			"</div>",
		);
		if (this.avecModeCorrigeALaDate) {
			T.push(
				'<div class="OptionParamExecution modeAvecDate">',
				this.composeIERadio(
					lNameGroupeRadio,
					lIEModel +
						"(" +
						TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate +
						")",
					'<span ie-texte="DiffusionCorrige.libelleCorrigeDate"></span>',
				),
				'<div id="',
				this.idateCorrige.getNom(),
				'" ie-if="DiffusionCorrige.avecSelecteurDate" ie-node="DiffusionCorrige.getNodeSelecDate"></div>',
				"</div>",
			);
		}
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.DiffusionCorriges",
			),
			contenu: T.join(""),
		});
	}
	composeFieldPresentationQuestions() {
		return "";
	}
	composePresentationQuestions() {
		const T = [];
		const lNameGroupeRadio = "avecToutesLesQuestions";
		const lIEModel = "PresentationQuestions.radioAvecToutesLesQuestions";
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIERadio(
				lNameGroupeRadio,
				lIEModel + "(true)",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.ToutesLesQuestions",
				),
			),
			"</div>",
		);
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIERadio(
				lNameGroupeRadio,
				lIEModel + "(false)",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.SeulementQuestions",
				),
			),
		);
		T.push(
			'<ie-combo ie-model="PresentationQuestions.comboNbQuestionsParEleve" class="ComboNbQuestionsParEleve"></ie-combo>',
		);
		T.push(
			'<span class="iecb-texte-disabled">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.TQuestionsPrisesAuHasard",
			),
			"</span>",
		);
		T.push("</div>");
		T.push('<div class="ContenuAvecDecalage" role="group">');
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIERadio(
				"jeuFixe",
				"PresentationQuestions.radioJeuQuestionsFixe(true)",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.QuestionslesMemes",
				),
			),
			"</div>",
		);
		T.push(
			'<div class="OptionParamExecution with-m-bottom">',
			this.composeIERadio(
				"jeuFixe",
				"PresentationQuestions.radioJeuQuestionsFixe(false)",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.QuestionsprisesAuHasard",
				),
			),
			"</div>",
		);
		T.push("</div>");
		T.push(
			'<div class="OptionParamExecution ContenuAvecDecalage">',
			this.composeIECheckbox(
				"PresentationQuestions.cbHomogeneiserNbQuestParNiveau",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.HomogeneiserNbQuestionsParNiveau",
				),
			),
			"</div>",
		);
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIECheckbox(
				"PresentationQuestions.cbMelangerQuestions",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.OrdreQuestionAleatoire",
				),
			),
		);
		T.push(
			'<ie-combo ie-model="PresentationQuestions.comboTypeMelangeQuestions" class="ComboTypeMelangeQuestions"></ie-combo>',
		);
		T.push("</div>");
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIECheckbox(
				"PresentationQuestions.cbAutoriserNavigation",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.PresentationInterdirNavigation",
				),
			),
			"</div>",
		);
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIECheckbox(
				"PresentationQuestions.cbMelangerReponses",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.OrdreReponseAleatoire",
				),
			),
			"</div>",
		);
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.PresentationQuestions",
			),
			contenu: T.join(""),
		});
	}
	composeFieldConditionsExecution() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-switch",
					{ "ie-model": "ConditionsExecution.cbLimiterTempsReponse" },
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.LimiterTempsReponse",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain self-end m-top-xl taille-m" },
					IE.jsx.str("ie-inputnote", {
						"ie-model": "ConditionsExecution.inputDureeMax",
					}),
					IE.jsx.str(
						"span",
						{ class: "m-left-l" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.Minutes",
						),
					),
				),
			),
		);
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.ConditionsExecution",
			),
			contenu: T.join(""),
			modeForm: true,
		});
	}
	composeConditionsExecution() {
		const T = [];
		const lIdMinutes = GUID_1.GUID.getId();
		T.push(
			IE.jsx.str(
				"div",
				{ class: "OptionParamExecution" },
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": "ConditionsExecution.cbLimiterTempsReponse" },
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.LimiterTempsReponse",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain self-end taille-m" },
					IE.jsx.str("ie-inputnote", {
						class: "InputDureeMax m-left",
						"ie-model": "ConditionsExecution.inputDureeMax",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.LimiterTempsQuestionnaire",
						),
						"aria-describedby": lIdMinutes,
					}),
					IE.jsx.str(
						"span",
						{ id: lIdMinutes, class: "m-left-l m-top" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.Minutes",
						),
					),
				),
			),
		);
		if (this.avecMultipleExecutions) {
			T.push(
				'<div class="OptionParamExecution">',
				this.composeIECheckbox(
					"ConditionsExecution.cbEssaisExecution",
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.NbMaxTentative1",
					),
				),
			);
			T.push(
				IE.jsx.str("ie-combo", {
					"ie-model": "ConditionsExecution.comboNbExecutions",
					class: "NbQuestionsAEnlever",
				}),
			);
			T.push(
				IE.jsx.str(
					"span",
					{ class: "iecb-texte-disabled" },
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.NbMaxTentative2",
					),
				),
			);
			T.push("</div>");
		}
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.ConditionsExecution",
			),
			contenu: T.join(""),
		});
	}
	composePersonnalisationProjetAccompagnement() {
		const T = [];
		if (this.estUneExecution) {
			T.push(this.composePersonnalisationPAExecutionQCM());
		} else {
			T.push(this.composePersonnalisationPAQCM());
		}
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.PersonnalisationElevePA",
			),
			contenu: T.join(""),
		});
	}
	composePersonnalisationPAQCM() {
		const T = [];
		const lIdTempsSupp = GUID_1.GUID.getId();
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "OptionParamExecution" },
					this.composeIECheckbox(
						"PersonnalisationPA.QCM.cbTempsSupplementaire",
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.DonnerTempsSupplementaire",
						),
					),
					IE.jsx.str("ie-inputnote", {
						"ie-model": "PersonnalisationPA.QCM.inputTempsSupplementaire",
						"aria-labelledby": lIdTempsSupp,
						style: "width:30px;",
					}),
					IE.jsx.str(
						"span",
						{ id: lIdTempsSupp, class: "iecb-texte-disabled" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.minutesTempsSupplementaire",
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "OptionParamExecution" },
					this.composeIECheckbox(
						"PersonnalisationPA.QCM.cbEnleverQuestions",
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.EnleverQuestions",
						),
					),
					IE.jsx.str("ie-combo", {
						"ie-model": "PersonnalisationPA.QCM.comboNbQuestionsAEnlever",
						class: "NbQuestionsAEnlever",
					}),
					IE.jsx.str(
						"span",
						{ class: "iecb-texte-disabled" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.nbQuestionsAleatoirement",
						),
					),
				),
			),
		);
		return T.join("");
	}
	composePersonnalisationPAExecutionQCM() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("ie-bouton", {
					"ie-model": "PersonnalisationPA.ExecutionQCM.btnPersonnalisation",
					"ie-icon": "icon_star",
					"aria-haspopup": "dialog",
				}),
			),
		);
		return T.join("");
	}
	composeAssouplissement() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "OptionParamExecution" },
					this.composeIECheckbox(
						"Assouplissement.cbPointsSelonPourcentage",
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.attribuerPointsSelonPourcentage",
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "OptionParamExecution" },
					IE.jsx.str(
						"span",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.Assouplissement",
						),
					),
					IE.jsx.str("ie-btnicon", {
						"ie-model": "Assouplissement.mrFicheReglesAssouplissement",
						class: "icon_question bt-activable",
						"aria-haspopup": "dialog",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "ContenuAvecDecalage" },
					IE.jsx.str(
						"div",
						{ class: "OptionParamExecution" },
						this.composeIECheckbox(
							"Assouplissement.cbAccepterIncomplet",
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreParamExecutionQCM.tolererIncomplet",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "OptionParamExecution" },
						this.composeIECheckbox(
							"Assouplissement.cbTolererFausses",
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreParamExecutionQCM.tolererFausses",
							),
						),
					),
				),
			),
		);
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.ReglesPourCorrection",
			),
			contenu: T.join(""),
		});
	}
	composeFieldRessentiEleve() {
		const T = [];
		T.push(
			this.composeFieldCheckbox({
				model: "RessentiEleve.cbPermettreRessenti",
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.PermettreRessentiEleve",
				),
			}),
		);
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.RessentiEleve",
			),
			contenu: T.join(""),
			modeForm: true,
		});
	}
	composeRessentiEleve() {
		const T = [];
		T.push(
			'<div class="OptionParamExecution">',
			this.composeIECheckbox(
				"RessentiEleve.cbPermettreRessenti",
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreParamExecutionQCM.PermettreRessentiEleve",
				),
			),
			"</div>",
		);
		return this.composeFieldset({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreParamExecutionQCM.RessentiEleve",
			),
			contenu: T.join(""),
		});
	}
	initalisationListeEleves(aListeElevesPourSelection) {
		const lListeClasses = new ObjetListeElements_1.ObjetListeElements();
		if (aListeElevesPourSelection) {
			aListeElevesPourSelection.parcourir((aEleve) => {
				aEleve.cmsActif = false;
				aEleve.visible = true;
				const lClasse = aEleve.classe;
				if (!lListeClasses.getElementParNumero(lClasse.getNumero())) {
					lListeClasses.addElement(
						MethodesObjet_1.MethodesObjet.dupliquer(lClasse),
					);
				}
			});
		}
		return lListeClasses;
	}
	verifierVisibiliteEleves(aListeElevesPourSelection, aValeurFiltre) {
		aListeElevesPourSelection.parcourir((aEleve) => {
			aEleve.visible = true;
			if (!aEleve.estUnDeploiement) {
				let lEstDansLaSelection = false;
				for (
					let i = 0;
					i < this.listeElevesPAEnEdition.count() && !lEstDansLaSelection;
					i++
				) {
					const lElementPA = this.listeElevesPAEnEdition.get(i);
					if (lElementPA && lElementPA.existe() && lElementPA.eleve) {
						lEstDansLaSelection = lElementPA.eleve.egalParNumeroEtGenre(
							aEleve.getNumero(),
						);
					}
				}
				aEleve.visible =
					!lEstDansLaSelection &&
					(!aValeurFiltre || !!aEleve.projetsAccompagnement);
				if (aEleve.visible && aEleve.pere) {
					aEleve.pere.visible = true;
				}
			} else {
				aEleve.visible = false;
			}
		});
	}
	actionApresListeEleves(aJSON) {
		const lListeElevesPourSelection = aJSON.listeEleves;
		const lListeClasses = this.initalisationListeEleves(
			lListeElevesPourSelection,
		);
		const lAvecCumul = lListeClasses.count() > 1;
		if (lAvecCumul) {
			for (let i = 0; i < lListeClasses.count(); i++) {
				const lElementCumul = lListeClasses.get(i);
				lElementCumul.estUnDeploiement = true;
				lElementCumul.estDeploye = true;
				for (let j = 0; j < lListeElevesPourSelection.count(); j++) {
					const lEleve = lListeElevesPourSelection.get(j);
					if (
						lEleve.classe &&
						lEleve.classe.egalParNumeroEtGenre(lElementCumul.getNumero())
					) {
						lEleve.pere = lElementCumul;
					}
				}
				lListeElevesPourSelection.addElement(lElementCumul);
			}
			lListeElevesPourSelection.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.pere ? D.pere.getLibelle() : D.getLibelle();
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return !!D.pere;
				}),
				ObjetTri_1.ObjetTri.init("Position"),
			]);
			lListeElevesPourSelection.trier();
		}
		this.verifierVisibiliteEleves(lListeElevesPourSelection, false);
		const lFenetreListePA = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				initialiser: function (aInstance) {
					const lColonnes = [];
					lColonnes.push({
						id: DonneesListe_SelectionElevePersonnalisationPA_1
							.DonneesListe_SelectionElevePersonnalisationPA.colonnes.coche,
						titre: { estCoche: true },
						taille: 15,
					});
					lColonnes.push({
						id: DonneesListe_SelectionElevePersonnalisationPA_1
							.DonneesListe_SelectionElevePersonnalisationPA.colonnes.nom,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.FenetrePersonnalisation.colonne.nom",
						),
						taille: 180,
					});
					lColonnes.push({
						id: DonneesListe_SelectionElevePersonnalisationPA_1
							.DonneesListe_SelectionElevePersonnalisationPA.colonnes.projet,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.FenetrePersonnalisation.colonne.projet",
						),
						taille: "100%",
					});
					const lParamsListe = {
						optionsListe: {
							colonnes: lColonnes,
							hauteurAdapteContenu: true,
							hauteurMaxAdapteContenu: 500,
							avecLigneCreation: false,
							boutons: [],
						},
						avecLigneCreation: false,
						callbckFiltre: (aValeurFiltre, aInstance) => {
							this.verifierVisibiliteEleves(
								lListeElevesPourSelection,
								aValeurFiltre,
							);
							aInstance.actualiserListe();
						},
						labelFiltre: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.FenetrePersonnalisation.filtreUniquementProjetAcc",
						),
					};
					if (lAvecCumul) {
						lParamsListe.optionsListe.boutons.push({
							genre: ObjetListe_1.ObjetListe.typeBouton.deployer,
						});
					}
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreParamExecutionQCM.FenetrePersonnalisation.titreSelectionEleves",
						),
						largeur: 520,
						hauteur: null,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
					aInstance.paramsListe = lParamsListe;
				},
				evenement: (aNumeroBouton) => {
					if (aNumeroBouton === 1) {
						const lOptions = this.getOptionsPersonnalisationPA();
						const lListeActif = lListeElevesPourSelection.getListeElements(
							(aElement) => {
								return aElement.cmsActif && aElement.visible;
							},
						);
						if (
							this.listeElevesPAEnEdition &&
							this.fenetrePA &&
							this.executionQCM &&
							lListeActif &&
							lListeActif.count()
						) {
							lListeActif.parcourir((aEleve) => {
								const lEleve = new ObjetElement_1.ObjetElement(
									aEleve.getLibelle(),
									aEleve.getNumero(),
									aEleve.getGenre(),
									aEleve.getPosition(),
									aEleve.getActif(),
								);
								lEleve.projetsAccompagnement = aEleve.projetsAccompagnement;
								const lNewPA = new ObjetElement_1.ObjetElement("");
								lNewPA.eleve = lEleve;
								lNewPA.dureeSupplementaire = lOptions.dureeParDefault;
								lNewPA.nombreQuestionsEnMoins =
									lOptions.nbrQuestEnMoinsParDefault;
								lNewPA.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
								this.listeElevesPAEnEdition.addElement(lNewPA);
							});
							this.listeElevesPAEnEdition.trier();
							this.fenetrePA.actualiserListe(true, true);
						}
					}
					if (this.fenetrePA) {
						this.fenetrePA.annulerCreation();
					} else {
					}
				},
			},
		);
		lFenetreListePA.setDonnees(
			new DonneesListe_SelectionElevePersonnalisationPA_1.DonneesListe_SelectionElevePersonnalisationPA(
				lListeElevesPourSelection,
				{ avecDeploiement: lAvecCumul },
			),
		);
	}
}
exports.ObjetParamExecutionQCM = ObjetParamExecutionQCM;
