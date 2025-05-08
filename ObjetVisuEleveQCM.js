exports.TypeCallbackVisuEleveQCM =
	exports.TypeActionVisuEleveQCM =
	exports.ObjetVisuEleve =
		void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
const TypeGenreExerciceDeQuestionnaire_1 = require("TypeGenreExerciceDeQuestionnaire");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const TypeQualificatifReponse_1 = require("TypeQualificatifReponse");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireAudio_1 = require("UtilitaireAudio");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDate_1 = require("ObjetDate");
const LocalStorage_1 = require("LocalStorage");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const ToucheClavier_1 = require("ToucheClavier");
const TypeNote_1 = require("TypeNote");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_Action_1 = require("Enumere_Action");
var TypeCallbackVisuEleveQCM;
(function (TypeCallbackVisuEleveQCM) {
	TypeCallbackVisuEleveQCM["get"] = "get";
	TypeCallbackVisuEleveQCM["set"] = "set";
	TypeCallbackVisuEleveQCM["close"] = "close";
	TypeCallbackVisuEleveQCM["croixFermeture"] = "croixFermeture";
})(
	TypeCallbackVisuEleveQCM ||
		(exports.TypeCallbackVisuEleveQCM = TypeCallbackVisuEleveQCM = {}),
);
var TypeActionVisuEleveQCM;
(function (TypeActionVisuEleveQCM) {
	TypeActionVisuEleveQCM["Valider"] = "submit";
	TypeActionVisuEleveQCM["Commencer"] = "start";
	TypeActionVisuEleveQCM["Recommencer"] = "restart";
	TypeActionVisuEleveQCM["Precedent"] = "prev";
	TypeActionVisuEleveQCM["Suivant"] = "next";
})(
	TypeActionVisuEleveQCM ||
		(exports.TypeActionVisuEleveQCM = TypeActionVisuEleveQCM = {}),
);
var TypeAffichageContenu;
(function (TypeAffichageContenu) {
	TypeAffichageContenu["PageModalite"] = "PageModalite";
	TypeAffichageContenu["PagePresentationCorrige"] = "PagePresentationCorrige";
	TypeAffichageContenu["PageQCMNonDemarre"] = "PageQCMNonDemarre";
	TypeAffichageContenu["PageQuestion"] = "PageQuestion";
	TypeAffichageContenu["PageCorrigeQuestion"] = "PageCorrigeQuestion";
	TypeAffichageContenu["PageMessageErreur"] = "PageMessageErreur";
	TypeAffichageContenu["PageRessenti"] = "PageRessenti";
	TypeAffichageContenu["PageFinQCM"] = "PageFinQCM";
	TypeAffichageContenu["PageCorrigeComplet"] = "PageCorrigeComplet";
	TypeAffichageContenu["PageCloture"] = "PageCloture";
})(TypeAffichageContenu || (TypeAffichageContenu = {}));
class ObjetVisuEleve {
	constructor(aNom, aEvenement) {
		this.Nom = aNom;
		this.Evenement = aEvenement;
		this.modeProf = false;
		this.modeVisuQuestion = false;
		this.idContenu = null;
		this.numeroExecution = null;
		this.executionQCM = null;
		this.indiceQuestion = -1;
		this.listeQuestions = null;
		this.question = null;
		this.nbQuestions = null;
		this.typeNumerotation = null;
		this.etatCloture = null;
		this.start = null;
		this.intervalChrono = null;
		this.evaluationNote = [];
		this.enActualisation = false;
		this.typeAffichageCourant = null;
		const aInstance = this;
		this.controleur = {
			instance: this,
			Timeline: {
				avecTimeline() {
					return aInstance.avecTimeLine();
				},
				nodeElemNavQuestion(aIndiceQuestion) {
					if (
						aInstance.executionQCM &&
						aInstance.executionQCM.autoriserLaNavigation
					) {
						$(this.node).eventValidation(() => {
							aInstance.indiceQuestion = aIndiceQuestion;
							aInstance.recupererQuestion();
						});
					}
				},
				getClasseElemNavQuestion(aIndiceQuestion) {
					let lEstQuestionCourante = false;
					if (aInstance.estEnCours()) {
						lEstQuestionCourante = aInstance.indiceQuestion === aIndiceQuestion;
					}
					const lClasses = [];
					if (
						aInstance.executionQCM &&
						aInstance.executionQCM.autoriserLaNavigation
					) {
						lClasses.push("AvecMain");
					}
					if (lEstQuestionCourante) {
						lClasses.push("is-current");
					}
					if (
						aInstance.evaluationNote &&
						aInstance.evaluationNote[aIndiceQuestion]
					) {
						const lEvalNote = aInstance.evaluationNote[aIndiceQuestion];
						const lQuestionEstValidee = lEvalNote.validee;
						if (lQuestionEstValidee) {
							lClasses.push("is-done");
							let lClasseEvaluationQuestion;
							if (
								lEvalNote.nbBonnesReponses &&
								lEvalNote.nbReponsesJustes >= 0
							) {
								if (
									lEvalNote.question &&
									lEvalNote.question.qualif !== undefined
								) {
									const lQualificationReponse = lEvalNote.question.qualif;
									if (
										lQualificationReponse ===
										TypeQualificatifReponse_1.TypeQualificatifReponse.qrBonne
									) {
										lClasseEvaluationQuestion = "is-ok";
									} else if (
										lQualificationReponse ===
										TypeQualificatifReponse_1.TypeQualificatifReponse
											.qrBonnePartielle
									) {
										lClasseEvaluationQuestion = "is-medium";
									} else {
										lClasseEvaluationQuestion = "is-ko";
									}
								} else {
									if (lEvalNote.nbReponsesJustes === 0) {
										lClasseEvaluationQuestion = "is-ko";
									} else if (
										lEvalNote.nbReponsesJustes === lEvalNote.nbBonnesReponses
									) {
										lClasseEvaluationQuestion = "is-ok";
									} else if (
										lEvalNote.nbReponsesJustes < lEvalNote.nbBonnesReponses
									) {
										lClasseEvaluationQuestion = "is-medium";
									}
								}
							}
							if (lClasseEvaluationQuestion) {
								lClasses.push(lClasseEvaluationQuestion);
							}
						}
					}
					return lClasses.join(" ");
				},
				avecAffichageChrono() {
					return aInstance.executionQCM && aInstance.executionQCM.dureeMaxQCM;
				},
			},
			Footer: {
				btnPrincipal: {
					event() {
						const lTypePage = aInstance.getTypePage();
						switch (lTypePage) {
							case TypeAffichageContenu.PagePresentationCorrige:
								if (
									!aInstance.executionQCM.estRejouable ||
									!GEtatUtilisateur.estEspaceEleve()
								) {
									if (
										aInstance.estUnCorrigePublieFuture() &&
										!aInstance.modeProf
									) {
										aInstance.fermetureFenetre();
									} else {
										aInstance.surEvenement({
											action: TypeActionVisuEleveQCM.Commencer,
										});
									}
								} else {
									aInstance.surEvenement({
										action: TypeActionVisuEleveQCM.Commencer,
									});
								}
								break;
							case TypeAffichageContenu.PageQCMNonDemarre:
							case TypeAffichageContenu.PageMessageErreur:
							case TypeAffichageContenu.PageCorrigeComplet:
								aInstance.fermetureFenetre();
								break;
							default: {
								let lTypeEvenementBoutonPrincipal =
									TypeActionVisuEleveQCM.Valider;
								switch (lTypePage) {
									case TypeAffichageContenu.PageModalite:
										lTypeEvenementBoutonPrincipal =
											TypeActionVisuEleveQCM.Commencer;
										break;
								}
								aInstance.surEvenement({
									action: lTypeEvenementBoutonPrincipal,
								});
								break;
							}
						}
					},
					getLibelle() {
						let lLibelleBoutonPrincipal = "";
						const lTypePage = aInstance.getTypePage();
						switch (lTypePage) {
							case TypeAffichageContenu.PageModalite:
								lLibelleBoutonPrincipal =
									ObjetTraduction_1.GTraductions.getValeur(
										"ExecutionQCM.CommencerQCM",
									);
								break;
							case TypeAffichageContenu.PageQuestion:
								lLibelleBoutonPrincipal = aInstance.estEnCours()
									? ObjetTraduction_1.GTraductions.getValeur(
											"ExecutionQCM.Valider",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"ExecutionQCM.Terminer",
										);
								break;
							case TypeAffichageContenu.PageCorrigeQuestion:
								lLibelleBoutonPrincipal =
									ObjetTraduction_1.GTraductions.getValeur(
										"ExecutionQCM.Valider",
									);
								break;
							case TypeAffichageContenu.PageFinQCM:
							case TypeAffichageContenu.PageCloture:
								lLibelleBoutonPrincipal =
									ObjetTraduction_1.GTraductions.getValeur(
										"ExecutionQCM.Terminer",
									);
								if (
									aInstance.executionQCM &&
									aInstance.executionQCM.modeDiffusionCorrige ===
										TypeModeCorrectionQCM_1.TypeModeCorrectionQCM
											.FBQ_CorrigeALaFin
								) {
									lLibelleBoutonPrincipal =
										ObjetTraduction_1.GTraductions.getValeur(
											"ExecutionQCM.presentationCorrige.VisualiserCorrige",
										);
								}
								break;
							case TypeAffichageContenu.PageCorrigeComplet:
							case TypeAffichageContenu.PageQCMNonDemarre:
							case TypeAffichageContenu.PageRessenti:
							case TypeAffichageContenu.PageMessageErreur:
								lLibelleBoutonPrincipal =
									ObjetTraduction_1.GTraductions.getValeur(
										"ExecutionQCM.Terminer",
									);
								break;
							case TypeAffichageContenu.PagePresentationCorrige:
								if (
									!aInstance.executionQCM ||
									!aInstance.executionQCM.estRejouable ||
									!GEtatUtilisateur.estEspaceEleve()
								) {
									if (
										aInstance.estUnCorrigePublieFuture() &&
										!aInstance.modeProf
									) {
										lLibelleBoutonPrincipal =
											ObjetTraduction_1.GTraductions.getValeur(
												"ExecutionQCM.Terminer",
											);
									} else {
										lLibelleBoutonPrincipal =
											ObjetTraduction_1.GTraductions.getValeur(
												"ExecutionQCM.presentationCorrige.Continuer",
											);
									}
								} else {
									lLibelleBoutonPrincipal =
										ObjetTraduction_1.GTraductions.getValeur(
											"ExecutionQCM.presentationCorrige.VisualiserCorrige",
										);
								}
								break;
						}
						return lLibelleBoutonPrincipal;
					},
					getDisabled() {
						let lBtnPrincipalDisabled = false;
						const lTypePage = aInstance.getTypePage();
						switch (lTypePage) {
							case TypeAffichageContenu.PageCorrigeQuestion:
								lBtnPrincipalDisabled = true;
								break;
							case TypeAffichageContenu.PageRessenti:
								lBtnPrincipalDisabled = aInstance.ressenti === null;
								break;
						}
						return lBtnPrincipalDisabled;
					},
				},
				avecBoutonPrecedent() {
					let lAvecBoutonPrecedent = false;
					const lTypePage = aInstance.getTypePage();
					switch (lTypePage) {
						case TypeAffichageContenu.PageQuestion:
						case TypeAffichageContenu.PageCorrigeQuestion:
							if (!aInstance.modeVisuQuestion) {
								lAvecBoutonPrecedent =
									aInstance.executionQCM &&
									aInstance.executionQCM.autoriserLaNavigation &&
									aInstance.indiceQuestion > 0;
							}
							break;
					}
					return lAvecBoutonPrecedent;
				},
				avecBoutonPrincipal() {
					const lTypePage = aInstance.getTypePage();
					return lTypePage !== TypeAffichageContenu.PageCorrigeQuestion;
				},
				avecBoutonSuivant() {
					let lAvecBoutonSuivant = false;
					const lTypePage = aInstance.getTypePage();
					switch (lTypePage) {
						case TypeAffichageContenu.PageQuestion:
							if (!aInstance.modeVisuQuestion) {
								lAvecBoutonSuivant =
									aInstance.executionQCM &&
									aInstance.executionQCM.autoriserLaNavigation &&
									aInstance.estEnCours();
							}
							break;
						case TypeAffichageContenu.PageCorrigeQuestion:
							lAvecBoutonSuivant = true;
							break;
						case TypeAffichageContenu.PagePresentationCorrige:
							if (
								!aInstance.executionQCM ||
								!aInstance.executionQCM.estRejouable ||
								!GEtatUtilisateur.estEspaceEleve()
							) {
								lAvecBoutonSuivant = false;
							} else {
								lAvecBoutonSuivant = true;
							}
							break;
					}
					return lAvecBoutonSuivant;
				},
				btnPrecedent: {
					event() {
						aInstance.surEvenement({
							action: TypeActionVisuEleveQCM.Precedent,
						});
					},
					getLibelle() {
						return ObjetTraduction_1.GTraductions.getValeur(
							"ExecutionQCM.JeReviens",
						);
					},
				},
				btnSuivant: {
					event() {
						let lTypeEvenementBoutonSuivant = TypeActionVisuEleveQCM.Suivant;
						const lTypePage = aInstance.getTypePage();
						switch (lTypePage) {
							case TypeAffichageContenu.PagePresentationCorrige:
								lTypeEvenementBoutonSuivant =
									TypeActionVisuEleveQCM.Recommencer;
								break;
						}
						aInstance.surEvenement({ action: lTypeEvenementBoutonSuivant });
					},
					getLibelle() {
						let lLibelleBoutonSuivant =
							ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.JePasse");
						const lTypePage = aInstance.getTypePage();
						switch (lTypePage) {
							case TypeAffichageContenu.PageCorrigeQuestion:
								lLibelleBoutonSuivant =
									ObjetTraduction_1.GTraductions.getValeur(
										"ExecutionQCM.JeContinue",
									);
								break;
							case TypeAffichageContenu.PagePresentationCorrige:
								lLibelleBoutonSuivant =
									ObjetTraduction_1.GTraductions.getValeur(
										"ExecutionQCM.presentationCorrige.RecommencerQCM",
									);
								break;
						}
						return lLibelleBoutonSuivant;
					},
				},
			},
			modelChipsAudio: {
				event(e) {
					e.stopPropagation();
					const lElemAudioConcerne = $(this.node).find("audio")[0];
					const lTousLesElementsAudios = $(this.node)
						.closest(".contenu-question")
						.find("audio");
					for (let i = 0; i < lTousLesElementsAudios.length; i++) {
						const lElemAudio = lTousLesElementsAudios.get(i);
						if (lElemAudio !== lElemAudioConcerne) {
							UtilitaireAudio_1.UtilitaireAudio.stopAudio(lElemAudio);
						}
					}
					UtilitaireAudio_1.UtilitaireAudio.executeClicChipsParDefaut(
						this.node,
					);
				},
				node() {
					const $chips = $(this.node);
					const $audio = $chips.find("audio");
					$audio.on("play", () => {
						$chips
							.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture)
							.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop);
					});
					$audio.on("pause", () => {
						$chips
							.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop)
							.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture);
					});
				},
			},
			Question: {
				getClasseScoreReponse(aIndiceQuestion) {
					const lClasses = [];
					if (
						aInstance.evaluationNote &&
						aInstance.evaluationNote[aIndiceQuestion]
					) {
						const lEvalNote = aInstance.evaluationNote[aIndiceQuestion];
						const lTypePage = aInstance.getTypePage();
						switch (lTypePage) {
							case TypeAffichageContenu.PageCorrigeQuestion:
							case TypeAffichageContenu.PageCorrigeComplet:
								if (
									lEvalNote.nbBonnesReponses &&
									lEvalNote.nbReponsesJustes >= 0 &&
									lEvalNote.question
								) {
									let lClasseEvaluationQuestion;
									if (lEvalNote.question.reponsesRepondant) {
										if (lEvalNote.question.qualif !== undefined) {
											const lQualificationReponse = lEvalNote.question.qualif;
											if (
												lQualificationReponse ===
												TypeQualificatifReponse_1.TypeQualificatifReponse
													.qrBonne
											) {
												lClasseEvaluationQuestion = "is-ok";
											} else if (
												lQualificationReponse ===
												TypeQualificatifReponse_1.TypeQualificatifReponse
													.qrBonnePartielle
											) {
												lClasseEvaluationQuestion = "is-medium";
											} else {
												lClasseEvaluationQuestion = "is-ko";
											}
										} else {
											if (lEvalNote.nbReponsesJustes === 0) {
												lClasseEvaluationQuestion = "is-ko";
											} else if (
												lEvalNote.nbReponsesJustes ===
												lEvalNote.nbBonnesReponses
											) {
												lClasseEvaluationQuestion = "is-ok";
											} else if (
												lEvalNote.nbReponsesJustes < lEvalNote.nbBonnesReponses
											) {
												lClasseEvaluationQuestion = "is-medium";
											}
										}
									} else {
										lClasseEvaluationQuestion = "is-ko";
									}
									if (lClasseEvaluationQuestion) {
										lClasses.push(lClasseEvaluationQuestion);
									}
								}
								break;
						}
					}
					return lClasses.join(" ");
				},
				getHtmlScore(aIndiceQuestion) {
					const lHtmlCompletScore = [];
					if (
						aInstance.evaluationNote &&
						aInstance.evaluationNote[aIndiceQuestion]
					) {
						const lEvalNote = aInstance.evaluationNote[aIndiceQuestion];
						const lQuestion = lEvalNote.question;
						const lEstQuestionAvecAffichageNote =
							aInstance.executionQCM &&
							(aInstance.executionQCM.estLieADevoir ||
								(aInstance.executionQCM.estUnTAF &&
									!!aInstance.executionQCM.afficherResultatNote));
						const lBaremeQuestion = [];
						if (lEstQuestionAvecAffichageNote) {
							if (lQuestion && lQuestion.note) {
								lBaremeQuestion.push(
									IE.jsx.str(
										IE.jsx.fragment,
										null,
										IE.jsx.str(
											"span",
											{ class: "nbr-point" },
											lQuestion.note,
											" ",
											lQuestion.note === 1
												? ObjetTraduction_1.GTraductions.getValeur(
														"ExecutionQCM.Point",
													)
												: ObjetTraduction_1.GTraductions.getValeur(
														"ExecutionQCM.Points",
													),
										),
									),
								);
							}
						}
						const lTypePage = aInstance.getTypePage();
						switch (lTypePage) {
							case TypeAffichageContenu.PageCorrigeQuestion:
							case TypeAffichageContenu.PageCorrigeComplet:
								if (lEvalNote.validee) {
									if (lQuestion) {
										if (!!lQuestion.noteEleve) {
											if (lEstQuestionAvecAffichageNote) {
												lHtmlCompletScore.push(lQuestion.noteEleve.toString());
												if (lQuestion.estAnnotee) {
													lHtmlCompletScore.push(" *");
												}
												lHtmlCompletScore.push(
													'<span class="separateur">/</span>',
												);
												lHtmlCompletScore.push(lBaremeQuestion);
											}
										} else {
											if (!lQuestion.reponsesRepondant) {
												lHtmlCompletScore.push(
													new TypeNote_1.TypeNote(0).toString(),
												);
											}
											if (lEstQuestionAvecAffichageNote) {
												lHtmlCompletScore.push(
													'<span class="separateur">/</span>',
												);
												lHtmlCompletScore.push(lBaremeQuestion);
											}
										}
									}
								}
								break;
							case TypeAffichageContenu.PageQuestion:
								lHtmlCompletScore.push(lBaremeQuestion);
								break;
						}
					}
					return lHtmlCompletScore.join("");
				},
				Epellation: {
					getNodeInput() {
						$(this.node).on({
							keyup(event) {
								const $this = $(this);
								if ($this.val() !== "" && $this.next("input")) {
									if (
										!(
											event.keyCode === ToucheClavier_1.ToucheClavier.Tab &&
											event.shiftKey
										) &&
										event.keyCode !== ToucheClavier_1.ToucheClavier.Shift
									) {
										$this.next("input").trigger("focus");
									}
								}
							},
							keydown(event) {
								const $this = $(this);
								if (
									event.keyCode === ToucheClavier_1.ToucheClavier.Backspace &&
									$this.val() === "" &&
									$this.prev("input")
								) {
									$this.prev("input").trigger("focus").val("");
								}
							},
							focus() {
								const $this = $(this);
								if ($this.val() !== "") {
									$this.trigger("select");
								}
							},
						});
					},
					nodeBtnEffacerSaisie() {
						const $this = $(this.node);
						$this.eventValidation((e) => {
							const $allInputs = $this.closest(".zone-reponse").find("input");
							$allInputs.val("");
							$($allInputs.get(0)).trigger("focus");
						});
					},
				},
				Associations: {
					nodeAssociationItem(aIndiceQuestion, aIndiceReponseDestination) {
						$(this.node).eventValidation(() => {
							const lFenetreChoixAssociation =
								ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
									ObjetFenetreChoixAssociation,
									{
										pere: aInstance,
										evenement(aNumeroBouton, aParametresSelection) {
											if (
												aNumeroBouton === Enumere_Action_1.EGenreAction.Valider
											) {
												const lElementAssociationBAAssocier =
													aParametresSelection.elementAssociationBAAssocier;
												const lHashReponseBAAssocier =
													lElementAssociationBAAssocier.hashContenu;
												let lEstBesoinDesaffecterReponse =
													!aInstance.estQuestionMatchingASymetrique(
														aInstance.question,
													) &&
													aInstance.estElementAssociationBDejaAffecte(
														lElementAssociationBAAssocier,
													);
												if (lEstBesoinDesaffecterReponse) {
													$(
														'[id^="' +
															aInstance
																.getPrefixeIdZoneReponseAssociee(
																	aInstance.indiceQuestion,
																)
																.escapeJQ() +
															'"]',
													).each(function () {
														if (
															$(this).data("hash") === lHashReponseBAAssocier
														) {
															$(this).data("hash", "").html("");
														}
													});
												}
												let lIndiceReponseAAssocier = -1;
												let lIndex = 0;
												for (const lReponse of aInstance.question
													.listeReponses) {
													if (
														lReponse.associationB &&
														lReponse.associationB.hashContenu ===
															lHashReponseBAAssocier
													) {
														lIndiceReponseAAssocier = lIndex;
														break;
													}
													lIndex++;
												}
												const lLibelleAssocB =
													UtilitaireQCM_1.UtilitaireQCM.getStringAffichageReponseMatching(
														lElementAssociationBAAssocier,
														true,
														{
															indiceReponse: lIndiceReponseAAssocier,
															ieModelAudio: "modelChipsAudio",
														},
													);
												const lIdReponseAssociee =
													aInstance.getIdZoneReponseAssociee(
														aIndiceQuestion,
														aIndiceReponseDestination,
													);
												$("#" + lIdReponseAssociee.escapeJQ())
													.data("hash", lHashReponseBAAssocier)
													.ieHtml(lLibelleAssocB, {
														controleur: aInstance.controleur,
													});
											}
										},
										initialiser(aInstanceFenetre) {
											aInstanceFenetre.setOptionsFenetre({
												largeur: 400,
												hauteur: 400,
												avecRetaillage: true,
											});
										},
									},
								);
							const lEstQuestionAsymetrique =
								aInstance.estQuestionMatchingASymetrique(aInstance.question);
							const lReponseDestination = aInstance.question.listeReponses.get(
								aIndiceReponseDestination,
							);
							const lHashesDejaAffiches = [];
							const lListeElementsAssociationB = [];
							for (const lReponse of aInstance.question.listeReponses) {
								const lHashContenuTemp = lReponse.associationB.hashContenu;
								if (!lHashesDejaAffiches.includes(lHashContenuTemp)) {
									lHashesDejaAffiches.push(lHashContenuTemp);
									let lEstDejaAffecte = lEstQuestionAsymetrique
										? false
										: aInstance.estElementAssociationBDejaAffecte(
												lReponse.associationB,
											);
									lListeElementsAssociationB.push({
										elementAssociationB: lReponse.associationB,
										estAffecte: lEstDejaAffecte,
									});
								}
							}
							lFenetreChoixAssociation.afficherListeReponsesAAssocier(
								lReponseDestination.associationA,
								aIndiceReponseDestination,
								lListeElementsAssociationB,
							);
						});
					},
					avecBoutonSupprimerReponseAssociee(
						aIndiceQuestion,
						aIndiceReponseDestination,
					) {
						let lZoneReponseAssocieeEstVide = true;
						const lIdReponseAssociee = aInstance.getIdZoneReponseAssociee(
							aIndiceQuestion,
							aIndiceReponseDestination,
						);
						if (lIdReponseAssociee) {
							const $zoneReponseAssociee = $(
								"#" + lIdReponseAssociee.escapeJQ(),
							);
							if ($zoneReponseAssociee && $zoneReponseAssociee.length > 0) {
								lZoneReponseAssocieeEstVide = $zoneReponseAssociee.is(":empty");
							}
						}
						return !lZoneReponseAssocieeEstVide;
					},
					btnSupprimerReponseAssociee: {
						event(aIndiceQuestion, aIndiceReponseDestination, event) {
							event.stopPropagation();
							const lIdReponseAssociee = aInstance.getIdZoneReponseAssociee(
								aIndiceQuestion,
								aIndiceReponseDestination,
							);
							if (lIdReponseAssociee) {
								const $zoneReponseAssociee = $(
									"#" + lIdReponseAssociee.escapeJQ(),
								);
								if ($zoneReponseAssociee) {
									$zoneReponseAssociee.data("hash", "").html("");
								}
							}
						},
					},
				},
			},
			CorrigeQuestion: {
				getClasseCSSLibelleComplementaire(aIndiceQuestion) {
					const lClassesLibelleComplementaireScore = [
						"libelle-complementaire-score",
					];
					const lInfos =
						aInstance.getInfosLibelleComplementaireDeScoreSurPageCorrige(
							aIndiceQuestion,
						);
					if (lInfos && lInfos.estBonneReponse) {
						lClassesLibelleComplementaireScore.push("reponse-ok");
					} else if (lInfos && lInfos.estReponsePartielle) {
						lClassesLibelleComplementaireScore.push("reponse-partielle");
					}
					return lClassesLibelleComplementaireScore.join(" ");
				},
				getLibelleComplementaireScoreDeQuestion(aIndiceQuestion) {
					if (
						[
							TypeAffichageContenu.PageCorrigeQuestion,
							TypeAffichageContenu.PageCorrigeComplet,
						].includes(aInstance.typeAffichageCourant)
					) {
						const lInfos =
							aInstance.getInfosLibelleComplementaireDeScoreSurPageCorrige(
								aIndiceQuestion,
							);
						return lInfos ? lInfos.libelle : "";
					}
					return "";
				},
				avecAffichageLibelleComplementaireScoreDeQuestion(aIndiceQuestion) {
					return (
						[
							TypeAffichageContenu.PageCorrigeQuestion,
							TypeAffichageContenu.PageCorrigeComplet,
						].includes(aInstance.typeAffichageCourant) &&
						!!aInstance.getInfosLibelleComplementaireDeScoreSurPageCorrige(
							aIndiceQuestion,
						)
					);
				},
				avecAffichageCommentaireQuestionAnnotee(aIndiceQuestion) {
					let lAffichageAnnotation = false;
					if (
						aInstance.evaluationNote &&
						aInstance.evaluationNote[aIndiceQuestion] &&
						aInstance.evaluationNote[aIndiceQuestion].validee
					) {
						const lEvalNote = aInstance.evaluationNote[aIndiceQuestion];
						const lQuestionCorrigee = lEvalNote.question;
						lAffichageAnnotation = !!(
							lQuestionCorrigee && lQuestionCorrigee.estAnnotee
						);
					}
					return lAffichageAnnotation;
				},
			},
			PageRessenti: {
				radioRessentiEleve: {
					setValue(aValeurRessenti) {
						aInstance.ressenti = aValeurRessenti;
					},
					getValue(aValeurRessenti) {
						return aInstance.ressenti === aValeurRessenti;
					},
				},
			},
		};
	}
	avecTimeLine() {
		let lAvecAffichageTimeline = false;
		const lExecQCM = this.executionQCM;
		if (lExecQCM && !lExecQCM.message) {
			switch (this.getTypePage()) {
				case TypeAffichageContenu.PageQuestion:
				case TypeAffichageContenu.PageCorrigeQuestion:
					if (!this.modeVisuQuestion) {
						lAvecAffichageTimeline = true;
					}
					break;
			}
		}
		return lAvecAffichageTimeline;
	}
	getInfosLibelleComplementaireDeScoreSurPageCorrige(aIndiceQuestion) {
		if (
			this.evaluationNote &&
			this.evaluationNote[aIndiceQuestion] &&
			this.evaluationNote[aIndiceQuestion].validee
		) {
			const lEvalNote = this.evaluationNote[aIndiceQuestion];
			if (lEvalNote.question) {
				if (lEvalNote.question && lEvalNote.question.reponsesRepondant) {
					let lEstBonneReponse = false;
					let lEstPartiel = false;
					if (lEvalNote.question.noteEleve) {
						lEstBonneReponse =
							lEvalNote.question.qualif ===
							TypeQualificatifReponse_1.TypeQualificatifReponse.qrBonne;
						lEstPartiel =
							lEvalNote.question.qualif ===
							TypeQualificatifReponse_1.TypeQualificatifReponse
								.qrBonnePartielle;
					} else if (lEvalNote.nbBonnesReponses !== undefined) {
						lEstBonneReponse =
							lEvalNote.nbBonnesReponses === lEvalNote.nbReponsesJustes;
					}
					if (lEstBonneReponse) {
						return {
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"ExecutionQCM.BonneReponse",
							),
							estBonneReponse: true,
						};
					} else if (lEstPartiel) {
						return {
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"ExecutionQCM.ReponsePartielle",
							),
							estReponsePartielle: true,
						};
					} else {
						return {
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"ExecutionQCM.MauvaiseReponse",
							),
						};
					}
				} else {
					return {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"ExecutionQCM.NonRepondu",
						),
					};
				}
			}
		}
		return null;
	}
	estElementAssociationBDejaAffecte(aReponseAssociationB) {
		let lEstAffecte = false;
		if (aReponseAssociationB && aReponseAssociationB.hashContenu) {
			const lListeHashesAffectes = this.recupererReponses();
			if (lListeHashesAffectes) {
				for (const lHashAffecte of lListeHashesAffectes) {
					if (lHashAffecte === aReponseAssociationB.hashContenu) {
						lEstAffecte = true;
						break;
					}
				}
			}
		}
		return lEstAffecte;
	}
	setParametres(aObjet) {
		this.idContenu = aObjet.idContenu;
		this.numeroExecution = aObjet.numeroExecution;
		this.modeProf = aObjet.modeProf;
		this.modeVisuQuestion = false;
		this.executionQCM = null;
		this.indiceQuestion = -1;
		this.listeQuestions = null;
		this.question = null;
		this.nbQuestions = null;
		this.typeNumerotation = null;
		this.etatCloture = null;
		this.start = null;
		clearInterval(this.intervalChrono);
		this.intervalChrono = null;
		this.evaluationNote = [];
		this.enActualisation = false;
		this.ressenti = null;
	}
	actualiser() {
		const lTypePage = this.getTypePage();
		if (lTypePage === TypeAffichageContenu.PageQuestion) {
			if (!this.evaluationNote[this.indiceQuestion]) {
				this.evaluationNote[this.indiceQuestion] = {
					validee: false,
					question: this.question,
				};
			}
		}
		const lHtml = [];
		lHtml.push('<div class="qcm-viewer">');
		lHtml.push('<div class="global-contain">');
		lHtml.push('<div class="main-contain ', lTypePage, '">');
		switch (lTypePage) {
			case TypeAffichageContenu.PageModalite:
				lHtml.push(this.composePageModalite());
				break;
			case TypeAffichageContenu.PagePresentationCorrige:
				lHtml.push(this.composePagePresentationCorrige());
				break;
			case TypeAffichageContenu.PageQuestion:
				lHtml.push(this.composePageQuestion(this.indiceQuestion));
				break;
			case TypeAffichageContenu.PageCorrigeQuestion:
				lHtml.push(
					this.composePageCorrigeQuestion(this.indiceQuestion, this.question),
				);
				break;
			case TypeAffichageContenu.PageFinQCM:
				lHtml.push(this.composePageFinQCM());
				break;
			case TypeAffichageContenu.PageRessenti:
				lHtml.push(this.composePageRessenti());
				break;
			case TypeAffichageContenu.PageCorrigeComplet:
				lHtml.push(this.composePageCorrigeComplet());
				break;
			case TypeAffichageContenu.PageQCMNonDemarre:
				lHtml.push(this.composePageNonDemarre());
				break;
			case TypeAffichageContenu.PageMessageErreur:
				lHtml.push(this.composePageMessageErreur());
				break;
			case TypeAffichageContenu.PageCloture:
				lHtml.push(this.composePageCloture());
				break;
			default:
				break;
		}
		lHtml.push("</div>");
		lHtml.push(this.composeBarreTimeline());
		lHtml.push("</div>");
		lHtml.push(this.composeFooterNavigation());
		lHtml.push("</div>");
		const lThis = this;
		$("#" + this.idContenu).ieHtml(lHtml.join(""), {
			controleur: this.controleur,
		});
		if (lTypePage === TypeAffichageContenu.PageCorrigeComplet) {
			this.enActualisation = false;
			return;
		} else if (lTypePage === TypeAffichageContenu.PageQuestion) {
			if (this.question && this.question.reponsesRepondant) {
				this.appliquerReponsesRepondant(this.question, this.indiceQuestion);
			}
		}
		$("#" + this.idContenu).ready(() => {
			lThis.formaterLien();
			lThis.enActualisation = false;
		});
		if (this.estEnCours() && this.executionQCM.dureeMaxQCM) {
			this.majValeurTempsRestant();
			if (!this.intervalChrono) {
				this.dureeInterval = 5000;
				this.intervalChrono = setInterval(
					this.majValeurTempsRestant.bind(this),
					this.dureeInterval,
				);
			}
		} else if (this.intervalChrono && !this.estEnCours()) {
			clearInterval(this.intervalChrono);
		}
		if (
			[
				TypeAffichageContenu.PageQuestion,
				TypeAffichageContenu.PageCorrigeQuestion,
			].includes(lTypePage) &&
			this.avecTimeLine()
		) {
			const lTLID = this.getIdQuestionTimeLine(this.indiceQuestion);
			document
				.getElementById(lTLID)
				.scrollIntoView({
					block: "nearest",
					inline: "nearest",
					behavior: "instant",
				});
		}
	}
	_determinerTypeAffichageCourant() {
		let lTypePage = TypeAffichageContenu.PageMessageErreur;
		if (this.executionQCM) {
			if (
				!this.executionQCM.message &&
				this.estEnInitialisation() &&
				(!this.estEnCloture() || this.peutEtreRefait())
			) {
				lTypePage = TypeAffichageContenu.PageModalite;
			} else if (
				!this.executionQCM.message &&
				this.estEnInitialisation() &&
				this.estEnCloture()
			) {
				if (this.executionQCM.estDemarre) {
					lTypePage = TypeAffichageContenu.PagePresentationCorrige;
				} else {
					lTypePage = TypeAffichageContenu.PageQCMNonDemarre;
				}
			} else if (
				this.estEnCours() &&
				this.question &&
				!this.estDureeMaxDepasse()
			) {
				if (
					this.question.reponsesRepondant &&
					this.executionQCM &&
					this.executionQCM.modeDiffusionCorrige ===
						TypeModeCorrectionQCM_1.TypeModeCorrectionQCM
							.FBQ_CorrigeApresQuestion
				) {
					lTypePage = TypeAffichageContenu.PageCorrigeQuestion;
				} else {
					lTypePage = TypeAffichageContenu.PageQuestion;
				}
			} else if (
				this.estEnCours() &&
				this.question &&
				this.estDureeMaxDepasse()
			) {
				lTypePage = TypeAffichageContenu.PageCloture;
				this.indiceQuestion = this.indiceQuestion =
					this.nbQuestions + Number(this.executionQCM.ressentiRepondant);
			} else if (this.executionQCM.message) {
				lTypePage = TypeAffichageContenu.PageMessageErreur;
			} else if (this.estEnRessenti()) {
				lTypePage = TypeAffichageContenu.PageRessenti;
			} else if (
				this.estPageCorrigeAutorise() ||
				this.estCorrigePendantExecutionEleve()
			) {
				lTypePage = TypeAffichageContenu.PageCorrigeComplet;
			} else if (this.estEnFin()) {
				lTypePage = TypeAffichageContenu.PageFinQCM;
			}
		}
		return lTypePage;
	}
	getTypePage() {
		return this.typeAffichageCourant;
	}
	composePageModalite() {
		const H = [];
		H.push('<section class="content">');
		H.push(
			'<header><h2 tabindex="0">',
			ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.LisezIndications"),
			"</h2></header>",
		);
		if (this.executionQCM.consigne) {
			H.push(
				'<div class="consigne-wrapper" tabindex="0">',
				this.executionQCM.consigne,
				"</div>",
			);
		}
		H.push("<ul>");
		function _creerLI(aNomIcone, aLibelle) {
			const LI = [];
			LI.push('<li tabindex="0">');
			LI.push('<i class="', aNomIcone, '"></i>');
			LI.push("<div>", aLibelle, "</div>");
			LI.push("</li>");
			return LI.join("");
		}
		let lTrad = "";
		let lClassesIcone = [];
		if (
			this.executionQCM.estLieADevoir &&
			this.executionQCM.estLieAEvaluation
		) {
			lTrad = "ExecutionQCM.notation.evaluationEtDevoir";
		} else if (this.executionQCM.estLieADevoir) {
			lTrad = "ExecutionQCM.notation.devoir";
		} else if (this.executionQCM.estLieAEvaluation) {
			lTrad = "ExecutionQCM.notation.evaluation";
		} else if (this.executionQCM.estUnTAF) {
			lTrad = "ExecutionQCM.notation.taf";
		} else {
			lTrad = "ExecutionQCM.notation.contenuCours";
		}
		if (lTrad !== "") {
			H.push(
				_creerLI(
					this._getIconeTypeExecutionQCM(this.executionQCM),
					ObjetTraduction_1.GTraductions.getValeur(lTrad, [
						this.executionQCM.nombreDePoints,
					]),
				),
			);
		}
		lTrad = "";
		lClassesIcone = ["icon_edt_permanence"];
		if (this.executionQCM.dureeMaxQCM) {
			lTrad = "ExecutionQCM.presentation.limite_temps";
		} else {
			lTrad = "ExecutionQCM.presentation.sans_limite_temps";
			lClassesIcone.push("mix-icon_remove", "i-top", "i-red");
		}
		if (lTrad !== "") {
			const lMinutes = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
				this.executionQCM.dureeMaxQCM,
			);
			const lMinutesSupplementaire =
				!this.modeProf &&
				this.executionQCM.dureeMaxQCM > 0 &&
				this.executionQCM.dureeSupplementaire > 0
					? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
							this.executionQCM.dureeSupplementaire,
						)
					: 0;
			H.push(
				_creerLI(
					lClassesIcone.join(" "),
					ObjetTraduction_1.GTraductions.getValeur(lTrad, [
						lMinutes +
							lMinutesSupplementaire +
							" " +
							ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.Minutes"),
					]),
				),
			);
		}
		lTrad = "";
		lClassesIcone = ["icon_arrow_left"];
		const lAvecNavigationPossible = this.executionQCM.autoriserLaNavigation;
		if (!lAvecNavigationPossible) {
			lTrad = "ExecutionQCM.presentation.sans_retour_precedent";
			lClassesIcone.push("mix-icon_remove", "i-top", "i-red");
		} else {
			lTrad = "ExecutionQCM.presentation.retour_precedent";
		}
		if (lTrad !== "") {
			let lLibelleNavigationQCM =
				ObjetTraduction_1.GTraductions.getValeur(lTrad);
			if (lAvecNavigationPossible) {
				lLibelleNavigationQCM +=
					'<span class="important" tabindex="0">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.presentation.RS_IlFautCliquerSurValider",
					) +
					"</span>";
			}
			H.push(_creerLI(lClassesIcone.join(" "), lLibelleNavigationQCM));
		}
		let lInfoCorrige = "";
		lClassesIcone = ["icon_ul"];
		if (
			this.executionQCM.modeDiffusionCorrige ===
			TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans
		) {
			lInfoCorrige = ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.corrige.aucun",
			);
			lClassesIcone.push("mix-icon_remove", "i-top", "i-red");
		} else if (
			this.executionQCM.modeDiffusionCorrige ===
			TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeApresQuestion
		) {
			lInfoCorrige = ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.corrige.chaque_question",
			);
		} else if (
			this.executionQCM.modeDiffusionCorrige ===
			TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin
		) {
			lInfoCorrige = ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.corrige.fin_qcm",
			);
		} else if (
			this.executionQCM.modeDiffusionCorrige ===
			TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate
		) {
			lInfoCorrige = ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.presentationCorrige.corrigeALaDate",
				[
					ObjetDate_1.GDate.formatDate(
						this.executionQCM.dateCorrige,
						"%JJJ %J %MMM %AAAA",
					),
				],
			);
		}
		if (lTrad !== "") {
			H.push(_creerLI(lClassesIcone.join(" "), lInfoCorrige));
		}
		const lAfficherNbTentativesPossibles = this.modeProf
			? this.estUnQCMAvecTentativesPossibles()
			: this.peutEtreRefait();
		if (lAfficherNbTentativesPossibles) {
			let lLibelleNbTentatives = ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.tentatives.max",
				[this.executionQCM.nbMaxTentative],
			);
			if (this.executionQCM.nbTentatives) {
				const lNrRest =
					this.executionQCM.nbMaxTentative - this.executionQCM.nbTentatives;
				lLibelleNbTentatives +=
					'<span class="important" tabindex="0">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.tentatives.xRestants",
						[lNrRest, this.executionQCM.nbMaxTentative],
					) +
					"</span>";
			}
			H.push(_creerLI("icon_repeat", lLibelleNbTentatives));
		}
		H.push("</ul>");
		H.push("</section>");
		return H.join("");
	}
	composePagePresentationCorrige() {
		const lPossedeCopieCacheeDejaJouee =
			!!this.executionQCM.dateExecCopieCachee;
		const lInformationsResultatsDejaEu = [];
		if (this._estUnIDevoir(this.executionQCM) && lPossedeCopieCacheeDejaJouee) {
			const lStrTypeQCMGarde = ["<strong>"];
			if (!!this.executionQCM.garderMeilleureNote) {
				lStrTypeQCMGarde.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.presentationCorrige.MeilleurResultat",
					),
				);
			} else {
				lStrTypeQCMGarde.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.presentationCorrige.DernierResultat",
					),
				);
			}
			lStrTypeQCMGarde.push("</strong>");
			const lFnCreerExecutionPassee = function (
				aDateExec,
				aNote,
				aMessageSuppl,
			) {
				const lResult = [];
				lResult.push("<li>");
				lResult.push(ObjetDate_1.GDate.formatDate(aDateExec, "%JJJ %JJ %MMM"));
				if (!!aNote) {
					lResult.push(" :&nbsp;");
					lResult.push("<strong>", aNote.toString(), "</strong>");
				}
				if (!!aMessageSuppl) {
					lResult.push(aMessageSuppl);
				}
				lResult.push("</li>");
				return lResult.join("");
			};
			const lDateExecCopieCachee = this.executionQCM.dateExecCopieCachee;
			const lDateExecCopieVisible = this.executionQCM.dateExecCopieVisible;
			lInformationsResultatsDejaEu.push('<div class="recap-wrapper">');
			lInformationsResultatsDejaEu.push(
				"<p>",
				ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.presentationCorrige.QCMDejaRealise",
					[lStrTypeQCMGarde.join("")],
				),
				"</p>",
			);
			lInformationsResultatsDejaEu.push("<ul>");
			lInformationsResultatsDejaEu.push(
				lFnCreerExecutionPassee(
					lDateExecCopieCachee,
					this.executionQCM.noteCopieCachee,
				),
			);
			if (!!lDateExecCopieVisible) {
				let lInfoEncours = "";
				if (
					!!this.executionQCM.estCopieCachee &&
					this.executionQCM.etatClotureAutre ===
						TypeEtatExecutionQCMPourRepondant_1
							.TypeEtatExecutionQCMPourRepondant.EQR_EnCours &&
					this.modeProf
				) {
					lInfoEncours = ` ${ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.EnCours")}`;
				}
				lInformationsResultatsDejaEu.push(
					lFnCreerExecutionPassee(
						lDateExecCopieVisible,
						this.executionQCM.noteCopieVisible,
						lInfoEncours,
					),
				);
			}
			lInformationsResultatsDejaEu.push("</ul>");
			lInformationsResultatsDejaEu.push("</div>");
		}
		const lIconeTypeExecutionQCM = this._getIconeTypeExecutionQCM(
			this.executionQCM,
		);
		let lIconeTypeExecQCMAEteAjoute = false;
		const lCorrigeFuture = [];
		const lNoteObtenue = [];
		const lCartoucheCompetences = [];
		const lReponsesDonnees = [];
		const lLimiteTemps = [];
		if (this.estUnCorrigePublieFuture()) {
			lCorrigeFuture.push('<li tabindex="0">');
			if (!lIconeTypeExecQCMAEteAjoute) {
				lCorrigeFuture.push('<i class="', lIconeTypeExecutionQCM, '"></i>');
				lIconeTypeExecQCMAEteAjoute = true;
			}
			lCorrigeFuture.push(
				"<p>",
				ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.presentationCorrige.corrigeALaDate",
					[
						ObjetDate_1.GDate.formatDate(
							this.executionQCM.dateCorrige,
							"%JJJ %J %MMM %AAAA",
						),
					],
				),
				"</p>",
			);
			lCorrigeFuture.push("</li>");
		}
		const lEstAffichageCopieCachee =
			!!lPossedeCopieCacheeDejaJouee && !!this.executionQCM.estCopieCachee;
		if (!lEstAffichageCopieCachee) {
			if (
				this.executionQCM.estLieADevoir ||
				(this.executionQCM.estUnTAF && !!this.executionQCM.afficherResultatNote)
			) {
				const lNote = this.executionQCM.noteQCM || this.executionQCM.note;
				lNoteObtenue.push('<li tabindex="0">');
				if (!lIconeTypeExecQCMAEteAjoute) {
					lNoteObtenue.push('<i class="', lIconeTypeExecutionQCM, '"></i>');
					lIconeTypeExecQCMAEteAjoute = true;
				}
				lNoteObtenue.push(
					"<p>",
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.presentationCorrige.noteObtenue",
						[lNote ? lNote.toString() : "", this.executionQCM.nombreDePoints],
					),
					"</p>",
				);
				lNoteObtenue.push("</li>");
			}
		}
		if (!lEstAffichageCopieCachee) {
			if (
				this.executionQCM.estLieAEvaluation ||
				(this.executionQCM.estUnTAF &&
					!!this.executionQCM.afficherResultatNiveauMaitrise)
			) {
				if (
					!!this.executionQCM.listeCompetences &&
					this.executionQCM.listeCompetences.count() > 0
				) {
					lCartoucheCompetences.push('<li tabindex="0" class="competences">');
					if (!lIconeTypeExecQCMAEteAjoute) {
						lCartoucheCompetences.push(
							'<i class="',
							lIconeTypeExecutionQCM,
							'"></i>',
						);
						lIconeTypeExecQCMAEteAjoute = true;
					}
					lCartoucheCompetences.push("<ul>");
					this.executionQCM.listeCompetences.parcourir((D) => {
						let lPastilleNiveauAcqui;
						if (!!D.niveauAcqui) {
							lPastilleNiveauAcqui =
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
									D.niveauAcqui,
								);
						}
						lCartoucheCompetences.push(
							"<li>",
							"<span>",
							lPastilleNiveauAcqui || "",
							"</span>",
							'<span class="titre">',
							D.getLibelle(),
							"</span>",
							"<p>",
							D.strPrefixes || "",
							"</p>",
							"</li>",
						);
					});
					lCartoucheCompetences.push("</ul>");
					lCartoucheCompetences.push("</li>");
				}
			}
		}
		let lNbQuestionsTotal =
			this.nbQuestions ||
			(!!this.executionQCM.QCM ? this.executionQCM.QCM.nbQuestionsTotal : 0);
		if (!lNbQuestionsTotal) {
			lNbQuestionsTotal = this.executionQCM.nbQuestRepondues;
		}
		lReponsesDonnees.push('<li tabindex="0">');
		if (!lIconeTypeExecQCMAEteAjoute) {
			lReponsesDonnees.push('<i class="', lIconeTypeExecutionQCM, '"></i>');
			lIconeTypeExecQCMAEteAjoute = true;
		}
		lReponsesDonnees.push(
			"<p>",
			ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.presentationCorrige.reponsesDonnees",
				[
					this.executionQCM.nbQuestRepondues,
					lNbQuestionsTotal,
					this.executionQCM.nbQuestBonnes,
				],
			),
			"</p>",
		);
		lReponsesDonnees.push("</li>");
		let lTrad = "";
		let lClassesIcone = ["icon_edt_permanence"];
		if (this.executionQCM.dureeMaxQCM) {
			lTrad = "ExecutionQCM.presentationCorrige.limite_temps";
		} else {
			lTrad = "ExecutionQCM.presentationCorrige.sans_limite_temps";
			lClassesIcone.push("mix-icon_remove", "i-top", "i-red");
		}
		if (lTrad !== "") {
			const lMinutes = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
				this.executionQCM.dureeMaxQCM,
			);
			const lMinutesSupplementaires =
				this.executionQCM.dureeMaxQCM > 0 &&
				this.executionQCM.dureeSupplementaire > 0
					? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
							this.executionQCM.dureeSupplementaire,
						)
					: 0;
			lLimiteTemps.push('<li tabindex="0">');
			lLimiteTemps.push('<i class="', lClassesIcone.join(" "), '"></i>');
			lLimiteTemps.push(
				"<p>",
				ObjetTraduction_1.GTraductions.getValeur(lTrad, [
					lMinutes +
						lMinutesSupplementaires +
						" " +
						ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.Minutes"),
				]),
				"</p>",
			);
			lLimiteTemps.push("</li>");
		}
		let lTitrePage;
		if (this._estUnIDevoir(this.executionQCM)) {
			lTitrePage = ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.presentationCorrige.CorrigeIdevoirExecute",
			);
		} else {
			lTitrePage = ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.presentationCorrige.CorrigeQCMExecute",
			);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"section",
					{ class: "content" },
					lInformationsResultatsDejaEu.join(""),
					IE.jsx.str(
						"header",
						null,
						IE.jsx.str("h2", { tabindex: "0" }, lTitrePage),
					),
					IE.jsx.str(
						"ul",
						null,
						lCorrigeFuture.join(""),
						lNoteObtenue.join(""),
						lCartoucheCompetences.join(""),
						lReponsesDonnees.join(""),
						lLimiteTemps.join(""),
					),
				),
			),
		);
		return H.join("");
	}
	composeBarreTimeline() {
		const H = [];
		if (this.executionQCM) {
			H.push('<aside ie-if="Timeline.avecTimeline">');
			H.push('<div ie-if="Timeline.avecAffichageChrono" class="chrono-view">');
			H.push("</div>");
			H.push('<ul class="timeline-nav">');
			for (let i = 0; i < this.nbQuestions; i++) {
				const lTLID = this.getIdQuestionTimeLine(i);
				H.push(
					'<li id="',
					lTLID,
					'" ie-node="Timeline.nodeElemNavQuestion(',
					i,
					')" ie-class="Timeline.getClasseElemNavQuestion(',
					i,
					')" aria-label="',
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.QuestionXSurY",
						[i + 1, this.nbQuestions],
					),
					'"></li>',
				);
			}
			H.push("</ul>");
			H.push("</aside>");
		}
		return H.join("");
	}
	composeFooterNavigation() {
		const lClassesBtnPrecedent = [
			Type_ThemeBouton_1.TypeThemeBouton.secondaire,
			"prev",
		];
		const lClassesBtnPrincipal = [
			Type_ThemeBouton_1.TypeThemeBouton.primaire,
			"primary",
		];
		const lClassesBtnSuivant = [
			Type_ThemeBouton_1.TypeThemeBouton.secondaire,
			"next",
		];
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"footer",
					{ class: "ie-shadow-top" },
					IE.jsx.str(
						"div",
						{ class: "group-btn" },
						IE.jsx.str("ie-bouton", {
							"ie-model": "Footer.btnPrecedent",
							"ie-if": "Footer.avecBoutonPrecedent",
							class: lClassesBtnPrecedent.join(" "),
							tabindex: "0",
						}),
						IE.jsx.str("ie-bouton", {
							"ie-model": "Footer.btnPrincipal",
							class: lClassesBtnPrincipal.join(" "),
							tabindex: "0",
						}),
						IE.jsx.str("ie-bouton", {
							"ie-model": "Footer.btnSuivant",
							"ie-if": "Footer.avecBoutonSuivant",
							class: lClassesBtnSuivant.join(" "),
							tabindex: "0",
						}),
					),
				),
			),
		);
		return H.join("");
	}
	getIdContenuQuestion(aIndiceQuestion) {
		return this.Nom + "_contenuQuestion_q" + aIndiceQuestion;
	}
	getIdQuestionTimeLine(aIndiceQuestion) {
		return this.Nom + "_TLQuestion_q" + aIndiceQuestion;
	}
	getIdZoneReponsesDeQuestion(aIndiceQuestion) {
		return this.Nom + "_q" + aIndiceQuestion;
	}
	getPrefixeIdZoneReponseAssociee(aIndiceQuestion) {
		return this.getIdZoneReponsesDeQuestion(aIndiceQuestion) + "_assoc_";
	}
	getIdZoneReponseAssociee(aIndiceQuestion, aIndiceReponse) {
		return (
			this.getPrefixeIdZoneReponseAssociee(aIndiceQuestion) + aIndiceReponse
		);
	}
	composePageQuestion(aIndiceQuestion) {
		const H = [];
		H.push(
			this._composeContenuQuestion(
				aIndiceQuestion,
				this.question,
				this.composeReponsesDeQuestion(this.question, aIndiceQuestion),
			),
		);
		return H.join("");
	}
	_composeContenuQuestion(aIndiceQuestion, aQuestion, aHtmlZoneReponse) {
		const lQuestionNumero =
			ObjetTraduction_1.GTraductions.getValeur("QCM.QuestionLibelle") +
			" " +
			UtilitaireQCM_1.UtilitaireQCM.composeNumerotation(
				this.typeNumerotation,
				aIndiceQuestion + 1,
			);
		const H = [];
		H.push('<section class="content">');
		H.push("<header>");
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"h2",
					{ tabindex: "0" },
					IE.jsx.str("span", { class: "quest-num" }, lQuestionNumero, " :"),
					" ",
					aQuestion.getLibelle(),
				),
			),
		);
		const lElementsResultatRepondant = [];
		lElementsResultatRepondant.push(
			'<span ie-class="CorrigeQuestion.getClasseCSSLibelleComplementaire(',
			aIndiceQuestion,
			')" ie-html="CorrigeQuestion.getLibelleComplementaireScoreDeQuestion(',
			aIndiceQuestion,
			')" ie-if="CorrigeQuestion.avecAffichageLibelleComplementaireScoreDeQuestion(',
			aIndiceQuestion,
			')"></span>',
		);
		lElementsResultatRepondant.push(
			'<span class="score" ie-class="Question.getClasseScoreReponse(',
			aIndiceQuestion,
			')" ie-html="Question.getHtmlScore(',
			aIndiceQuestion,
			')"></span>',
		);
		lElementsResultatRepondant.push(
			'<p ie-if="CorrigeQuestion.avecAffichageCommentaireQuestionAnnotee(',
			aIndiceQuestion,
			')">* ',
			ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.presentationCorrige.PointsRectifies",
			),
			"</p>",
		);
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "compteur", tabindex: "0" },
					lElementsResultatRepondant.join(""),
				),
			),
		);
		H.push("</header>");
		H.push(
			'<div class="contenu-question" id="',
			this.getIdContenuQuestion(aIndiceQuestion),
			'">',
		);
		const lArrEnonce = [];
		const lStrEnonce = UtilitaireQCM_1.UtilitaireQCM.composeEnonce(aQuestion);
		if (!!lStrEnonce) {
			lArrEnonce.push(IE.jsx.str("div", { class: "tiny-view" }, lStrEnonce));
		}
		if (!!aQuestion.image) {
			let lCleTrad = "ExecutionQCM.ImageNonSupportee";
			lArrEnonce.push('<div tabindex="0" class="media-contain">');
			lArrEnonce.push(
				'<img alt="" ie-load-src="data:image/png;base64,',
				aQuestion.image,
				'" onerror="$(this).parent().ieHtml(GTraductions.getValeur(\'',
				lCleTrad,
				"'));\" />",
			);
			lArrEnonce.push("</div>");
		}
		if (
			!!aQuestion.mp3name &&
			aQuestion.mp3name !== "" &&
			aQuestion.mp3 &&
			aQuestion.mp3 !== ""
		) {
			lArrEnonce.push(
				UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
					base64Audio: aQuestion.mp3,
					libelle: aQuestion.mp3name,
					ieModel: "modelChipsAudio",
					classes: ["media-contain"],
				}),
			);
		}
		if (!!aQuestion.url && aQuestion.url !== "") {
			lArrEnonce.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ tabindex: "0", class: "media-contain" },
						IE.jsx.str(
							"ie-chips",
							{
								href: aQuestion.url,
								target: "_blank",
								class: "iconic icon_info_sondage_publier",
							},
							aQuestion.url,
						),
					),
				),
			);
		}
		if (lArrEnonce.length > 0) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{
							class: "wrapperEnonceQuestionQCM SansSelectionTexte",
							tabindex: "0",
						},
						lArrEnonce.join(""),
					),
				),
			);
		}
		H.push(aHtmlZoneReponse);
		H.push("</div>");
		if (aQuestion.editeur && aQuestion.editeur.existeNumero()) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ tabindex: "0", class: "partner-wrapper" },
						ObjetTraduction_1.GTraductions.getValeur(
							"ExecutionQCM.CopyRightEditeur2013",
							[aQuestion.editeur.getLibelle()],
						),
					),
				),
			);
		}
		H.push("</section>");
		return H.join("");
	}
	composePageFinQCM() {
		const lEstUnIDevoir = this._estUnIDevoir(this.executionQCM);
		let lCleTraductionPhraseFin;
		if (
			this.executionQCM.modeDiffusionCorrige ===
			TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin
		) {
			lCleTraductionPhraseFin = lEstUnIDevoir
				? "ExecutionQCM.phraseFinAvantCorrige"
				: "ExecutionQCM.phraseFinQCMAvantCorrige";
		} else {
			lCleTraductionPhraseFin = lEstUnIDevoir
				? "ExecutionQCM.phraseFin"
				: "ExecutionQCM.phraseFinQCM";
		}
		const H = [];
		H.push('<section class="content">');
		H.push('<div class="message-wrapper">');
		H.push(
			"<p>",
			ObjetTraduction_1.GTraductions.getValeur(lCleTraductionPhraseFin),
			"</p>",
		);
		H.push("</div>");
		H.push("</section>");
		return H.join("");
	}
	composePageRessenti() {
		const lValeursPossibles = [];
		lValeursPossibles.push({ valeurEnum: 3, valeurBase: 0 });
		lValeursPossibles.push({ valeurEnum: 1, valeurBase: 1 });
		const H = [];
		H.push('<section class="content">');
		H.push("<header>");
		H.push(
			'<h2 tabindex="0">',
			ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.TitreRessenti"),
			"</h2>",
		);
		H.push("</header>");
		H.push('<div class="message-wrapper">');
		H.push(
			"<p>",
			ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.phraseRessenti"),
			"</p>",
		);
		H.push("<ul>");
		for (const lValeurPossible of lValeursPossibles) {
			H.push(
				"<li>",
				'<ie-radio class="as-chips for-qcm" ie-model="PageRessenti.radioRessentiEleve(' +
					lValeurPossible.valeurBase +
					')">',
				ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.valeurRessenti")[
					lValeurPossible.valeurEnum
				],
				"</ie-radio>",
				"</li>",
			);
		}
		H.push("</ul>");
		H.push("</div>");
		H.push("</section>");
		return H.join("");
	}
	composePageCorrigeComplet() {
		const H = [];
		H.push('<div class="corrige-wrapper">');
		for (let i = 0; i < this.listeQuestions.count(); i++) {
			const lQuestion = this.listeQuestions.get(i);
			H.push(this.composePageCorrigeQuestion(i, lQuestion));
		}
		H.push("</div>");
		return H.join("");
	}
	composePageCloture() {
		const lChaine = this._estUnIDevoir(this.executionQCM)
			? ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.PhraseClotureDelaiMax",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.PhraseClotureQCMDelaiMax",
				);
		return this.composePageGenerique(lChaine);
	}
	composePageMessageErreur() {
		return this.composePageGenerique(this.executionQCM.message);
	}
	composePageNonDemarre() {
		return this.composePageGenerique(
			ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.phraseClotureNonDemarre",
			),
		);
	}
	composePageGenerique(aChaine) {
		const H = [];
		H.push('<section class="content">');
		H.push('<div class="message-wrapper">');
		H.push("<p>", aChaine, "</p>");
		H.push("</div>");
		H.push("</section>");
		return H.join("");
	}
	_estUnIDevoir(aExecutionQCM) {
		return aExecutionQCM.estLieADevoir || aExecutionQCM.estLieAEvaluation;
	}
	_getTitreExecutionQCM(aExecutionQCM) {
		let lTitre = "";
		if (!!aExecutionQCM) {
			if (this._estUnIDevoir(aExecutionQCM)) {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.typesQCM.IDevoir",
				);
			} else if (aExecutionQCM.estUnTAF) {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.typesQCM.QCMDeTaf",
				);
			} else {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.typesQCM.QCMDeContenu",
				);
			}
		}
		return lTitre;
	}
	_getIconeTypeExecutionQCM(aExecutionQCM) {
		return UtilitaireQCM_1.UtilitaireQCM.getIconeTypeExecutionQCM(
			aExecutionQCM,
		);
	}
	composeTitre() {
		const lHtmlTitle = [];
		if (this.executionQCM.getLibelle()) {
			lHtmlTitle.push(this.executionQCM.getLibelle());
		}
		lHtmlTitle.push(this._getTitreExecutionQCM(this.executionQCM));
		if (this.executionQCM.service && this.executionQCM.service.getLibelle()) {
			lHtmlTitle.push(this.executionQCM.service.getLibelle());
		}
		if (this.executionQCM.matiere && this.executionQCM.matiere.getLibelle()) {
			lHtmlTitle.push(this.executionQCM.matiere.getLibelle());
		}
		const lHtmlTitleProf = [];
		if (
			this.executionQCM.listeProfesseurs &&
			this.executionQCM.listeProfesseurs.count() > 0
		) {
			lHtmlTitleProf.push(
				this.executionQCM.listeProfesseurs.getTableauLibelles().join(", "),
			);
		}
		const lHtmlThemes = [];
		if (
			this.executionQCM.ListeThemes &&
			this.executionQCM.ListeThemes.count() > 0
		) {
			lHtmlThemes.push(
				ObjetTraduction_1.GTraductions.getValeur("Themes") +
					" : " +
					this.executionQCM.ListeThemes.getTableauLibelles().join(", "),
			);
		}
		let lResult = "";
		if (!IE.estMobile) {
			if (lHtmlTitleProf.length > 0) {
				lHtmlTitle.push(lHtmlTitleProf.join(""));
			}
			lResult = IE.jsx.str(
				IE.jsx.fragment,
				null,
				lHtmlTitle.join(" - "),
				IE.jsx.str("br", null),
				lHtmlThemes.length > 0
					? IE.jsx.str("span", { class: "ie-titre" }, lHtmlThemes.join(""))
					: "",
			);
		} else {
			lResult = IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("span", { class: "Texte12" }, lHtmlTitle.join(" - ")),
				IE.jsx.str("br", null),
				IE.jsx.str("span", { class: "Texte12" }, lHtmlTitleProf.join("")),
				lHtmlThemes.length > 0
					? IE.jsx.str("span", { class: "ie-titre" }, lHtmlThemes.join(""))
					: "",
			);
		}
		return lResult;
	}
	formaterLien() {
		$("#" + this.idContenu)
			.find("a[href]")
			.each(function () {
				let lUrl = $(this).attr("href");
				if (lUrl && lUrl.search(/^(ht|f)tp/gi) !== 0) {
					lUrl = "http://" + lUrl;
					$(this).prop("href", lUrl);
				}
			});
	}
	majValeurTempsRestant() {
		if (!this.executionQCM.dureeMaxQCM) {
			return;
		}
		const lMinRestantes = this._getMinutesTempsRestant();
		let lMin = lMinRestantes.min;
		let lTextTime = lMin.toString();
		let lLibelleTime = ObjetTraduction_1.GTraductions.getValeur(
			"ExecutionQCM.MinutesCourt",
		);
		if (lMin < 1) {
			if (this.dureeInterval !== 2500 && lMinRestantes.sec > 0) {
				this.dureeInterval = 2500;
				clearInterval(this.intervalChrono);
				this.intervalChrono = setInterval(
					this.majValeurTempsRestant.bind(this),
					this.dureeInterval,
				);
			}
			lTextTime = "&lt; 1";
			const lSecRestantes = this._getMsTempsRestant() / 1000;
			if (lSecRestantes <= 50) {
				lLibelleTime = ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.SecondesCourt",
				);
				lTextTime = "&lt; 50";
			}
			if (lSecRestantes <= 40) {
				lTextTime = "&lt; 40";
			}
			if (lSecRestantes <= 30) {
				lTextTime = "&lt; 30";
			}
			if (lSecRestantes <= 20) {
				lTextTime = "&lt; 20";
			}
			if (lSecRestantes <= 10) {
				lTextTime = "&lt; 10";
			}
			if (lSecRestantes <= 0) {
				lTextTime = "0";
			}
		}
		const lHtmlChrono = [];
		lHtmlChrono.push("<span>", lTextTime, "</span>", lLibelleTime);
		$(".chrono-view").html(lHtmlChrono.join(""));
	}
	_getMinutesTempsRestant() {
		const lSecRestantes = this._getMsTempsRestant();
		const lTpsRestant = new Date(lSecRestantes > 0 ? lSecRestantes : 0);
		const lMinutes =
			lTpsRestant.getUTCHours() * 60 + lTpsRestant.getUTCMinutes();
		const lSecondes = lTpsRestant.getUTCSeconds();
		return { min: lMinutes, sec: lSecondes };
	}
	_getMsTempsRestant() {
		const lMinutesSupplementaire =
			!this.modeProf &&
			this.executionQCM.dureeMaxQCM > 0 &&
			this.executionQCM.dureeSupplementaire > 0
				? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
						this.executionQCM.dureeSupplementaire,
					)
				: 0;
		const lSecRestantes =
			new Date(0).setUTCMinutes(
				UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
					this.executionQCM.dureeMaxQCM,
				) + lMinutesSupplementaire,
			) -
			(new Date().getTime() - this.start);
		return lSecRestantes;
	}
	composePageCorrigeQuestion(aIndiceQuestion, aQuestion) {
		const lHtmlZoneCorrige =
			UtilitaireQCM_1.UtilitaireQCM.composeReponsesCorrigeesDeQuestion(
				aQuestion,
				aIndiceQuestion,
				{
					acceptIncomplet: this.executionQCM.acceptIncomplet,
					tolererFausses: this.executionQCM.tolererFausses,
					ieModelAudio: "modelChipsAudio",
				},
				this.evaluationNote,
			);
		const H = [];
		H.push(
			this._composeContenuQuestion(
				aIndiceQuestion,
				aQuestion,
				lHtmlZoneCorrige,
			),
		);
		return H.join("");
	}
	appliquerReponsesRepondant(aQuestion, aIndiceQuestion) {
		if (
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_SingleChoice ||
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_MultiChoice
		) {
			this._appliquerReponsesRepondantSingleMulti(aQuestion, aIndiceQuestion);
		} else if (
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ShortAnswer ||
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_NumericalAnswer
		) {
			this._appliquerReponsesRepondantShort(aQuestion, aIndiceQuestion);
		} else if (
			aQuestion.getGenre() ===
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer
		) {
			this._appliquerReponsesRepondantSpell(aQuestion, aIndiceQuestion);
		} else if (
			aQuestion.getGenre() ===
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching
		) {
			this._appliquerReponsesRepondantMatching(aQuestion, aIndiceQuestion);
		} else if (
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeField ||
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeFixed ||
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeVariable
		) {
			this._appliquerReponsesRepondantCloze(aQuestion, aIndiceQuestion);
		}
	}
	_appliquerReponsesRepondantSingleMulti(aQuestion, aIndiceQuestion) {
		if (aQuestion.reponsesRepondant) {
			for (const x in aQuestion.reponsesRepondant) {
				if (aQuestion.reponsesRepondant[x] !== "") {
					const lIdInputReponseRepondant =
						this.getIdZoneReponsesDeQuestion(aIndiceQuestion) +
						"_r" +
						(parseInt(aQuestion.reponsesRepondant[x]) - 1);
					$("#" + lIdInputReponseRepondant.escapeJQ()).attr(
						"checked",
						"checked",
					);
				}
			}
		}
	}
	_appliquerReponsesRepondantShort(aQuestion, aIndiceQuestion) {
		if (aQuestion.reponsesRepondant && aQuestion.reponsesRepondant.length > 0) {
			const lReponseRepondant = aQuestion.reponsesRepondant[0];
			const lIdInputReponseRepondant =
				this.getIdZoneReponsesDeQuestion(aIndiceQuestion) + "_r0";
			$("#" + lIdInputReponseRepondant.escapeJQ()).val(lReponseRepondant);
		}
	}
	_appliquerReponsesRepondantSpell(aQuestion, aIndiceQuestion) {
		if (aQuestion.reponsesRepondant && aQuestion.reponsesRepondant.length > 0) {
			const lReponseRepondant = aQuestion.reponsesRepondant[0];
			const lArrLettresReponse = lReponseRepondant.split("");
			if (lArrLettresReponse.length > 0) {
				const lNameReponses =
					this.getIdZoneReponsesDeQuestion(aIndiceQuestion) + "_r";
				const lInputs = $('[name="' + lNameReponses.escapeJQ() + '"]');
				for (let i = 0; i < lArrLettresReponse.length; i++) {
					if (i < lInputs.length) {
						$(lInputs.get(i)).val(lArrLettresReponse[i]);
					}
				}
			}
		}
	}
	_appliquerReponsesRepondantMatching(aQuestion, aIndiceQuestion) {
		const lFnGetIndiceReponseDElementAssociationDeHash = function (
			aQuestion,
			aHash,
		) {
			let lIndiceReponse = null;
			let lIndiceTemp = 0;
			for (const aReponseDeQuestion of aQuestion.listeReponses) {
				if (
					aReponseDeQuestion &&
					aReponseDeQuestion.associationB &&
					aReponseDeQuestion.associationB.hashContenu === aHash
				) {
					lIndiceReponse = lIndiceTemp;
					break;
				}
				lIndiceTemp++;
			}
			return lIndiceReponse;
		};
		let lIndiceReponseRepondant = 0;
		for (const lReponseRepondant of aQuestion.reponsesRepondant) {
			if (!!lReponseRepondant || lReponseRepondant === 0) {
				const lIndiceReponseRetrouvee =
					lFnGetIndiceReponseDElementAssociationDeHash(
						aQuestion,
						lReponseRepondant,
					);
				const lElementAssociationRetrouvee = aQuestion.listeReponses.get(
					lIndiceReponseRetrouvee,
				).associationB;
				const lLibelleAssocB =
					UtilitaireQCM_1.UtilitaireQCM.getStringAffichageReponseMatching(
						lElementAssociationRetrouvee,
						true,
						{
							indiceReponse: lIndiceReponseRetrouvee,
							ieModelAudio: "modelChipsAudio",
						},
					);
				const lIdReponse = this.getIdZoneReponseAssociee(
					aIndiceQuestion,
					lIndiceReponseRepondant,
				);
				$("#" + lIdReponse.escapeJQ())
					.data("hash", lReponseRepondant)
					.ieHtml(lLibelleAssocB, { controleur: this.controleur });
			}
			lIndiceReponseRepondant++;
		}
	}
	_appliquerReponsesRepondantCloze(aQuestion, aIndiceQuestion) {
		$("#" + this.getIdContenuQuestion(aIndiceQuestion).escapeJQ())
			.find('select, input[type="text"]')
			.each(function (aIndex) {
				if (
					aQuestion.reponsesRepondant &&
					aQuestion.reponsesRepondant[aIndex] !== ""
				) {
					const lReponseRepondant = ObjetChaine_1.GChaine.enleverEntites(
						aQuestion.reponsesRepondant[aIndex],
					);
					$(this).val(lReponseRepondant);
				}
			});
	}
	recupererReponses() {
		const lReponses = [];
		let lJqInput;
		let lReponse;
		const lIdZoneReponses = this.getIdZoneReponsesDeQuestion(
			this.indiceQuestion,
		);
		if (
			this.question.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_SingleChoice ||
			this.question.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_MultiChoice
		) {
			$('[id^="' + lIdZoneReponses.escapeJQ() + '_r"]:checked').each(
				function () {
					const lIndice = this.id.match(/_r([0-9]+)$/i)[1];
					lReponses.push(parseInt(lIndice) + 1);
				},
			);
		} else if (
			this.question.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ShortAnswer ||
			this.question.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_NumericalAnswer
		) {
			lJqInput = $("#" + lIdZoneReponses.escapeJQ() + "_r0");
			const lStrReponse = lJqInput.val();
			lReponse = lStrReponse
				.replace(/^\s+/, "")
				.replace(/\s+$/, "")
				.replace(/\s+/gi, " ");
			lReponses.push(lReponse);
		} else if (
			this.question.getGenre() ===
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer
		) {
			lJqInput = $('input[name="' + lIdZoneReponses.escapeJQ() + '_r"]');
			lReponse = "";
			lJqInput.each(function () {
				lReponse += $(this).val();
			});
			lReponse = lReponse
				.replace(/^\s+/, "")
				.replace(/\s+$/, "")
				.replace(/\s+/gi, " ");
			lReponses.push(lReponse);
		} else if (
			this.question.getGenre() ===
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching
		) {
			$(
				'[id^="' +
					this.getPrefixeIdZoneReponseAssociee(this.indiceQuestion).escapeJQ() +
					'"]',
			).each(function () {
				let lDataHash = $(this).data("hash");
				if (!lDataHash) {
					lDataHash = "";
				}
				lReponses.push(lDataHash);
			});
		} else if (
			this.question.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeField ||
			this.question.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeFixed ||
			this.question.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeVariable
		) {
			$("#" + this.getIdContenuQuestion(this.indiceQuestion).escapeJQ())
				.find('select, input[type="text"]')
				.each(function () {
					lReponse = $(this).val().toString();
					if ($(this).is("input")) {
						lReponse = lReponse
							.replace(/^\s+/, "")
							.replace(/\s+$/, "")
							.replace(/\s+/gi, " ");
					}
					lReponses.push(lReponse);
				});
		}
		return lReponses;
	}
	setDonnees(aParam) {
		if (this.estEnInitialisation()) {
			this.executionQCM = aParam;
			let lNbQuestions = 0;
			if (this.executionQCM.QCM && this.executionQCM.QCM.nbQuestion) {
				lNbQuestions = this.executionQCM.QCM.nbQuestion;
			} else if (this.executionQCM.nombreQuestionsSoumises) {
				lNbQuestions = this.executionQCM.nombreQuestionsSoumises;
			} else if (
				this.executionQCM.QCM &&
				this.executionQCM.QCM.nbQuestionsTotal
			) {
				lNbQuestions = this.executionQCM.QCM.nbQuestionsTotal;
			} else {
				lNbQuestions = this.executionQCM.nbQuestionsTotal;
			}
			if (lNbQuestions > 1 && !!this.executionQCM.nombreQuestionsEnMoins) {
				lNbQuestions = lNbQuestions - this.executionQCM.nombreQuestionsEnMoins;
			}
			if (
				this.executionQCM.QCM &&
				this.executionQCM.QCM.nombreQuestObligatoires
			) {
				const lNbQuestionsObligatoires =
					this.executionQCM.QCM.nombreQuestObligatoires;
				if (!!lNbQuestionsObligatoires) {
					lNbQuestions = Math.max(lNbQuestionsObligatoires, lNbQuestions);
				}
			}
			this.nbQuestions = Math.max(1, lNbQuestions);
			if (!!this.executionQCM.listeCompetences) {
				this.executionQCM.listeCompetences.setTri([
					ObjetTri_1.ObjetTri.init("Libelle"),
				]);
				this.executionQCM.listeCompetences.trier();
			}
		}
		if (aParam.message) {
			this.executionQCM.message = aParam.message;
		}
		if (this.typeNumerotation === undefined || this.typeNumerotation === null) {
			this.typeNumerotation =
				aParam.QCM && aParam.QCM.typeNumerotation !== undefined
					? aParam.QCM.typeNumerotation
					: aParam.contenuQCM &&
							aParam.contenuQCM.typeNumerotation !== undefined
						? aParam.contenuQCM.typeNumerotation
						: aParam.typeNumerotation;
		}
		if (
			aParam &&
			((aParam.QCM && aParam.QCM.etatCloture >= 0) || aParam.etatCloture >= 0)
		) {
			this.etatCloture = aParam.etatCloture
				? aParam.etatCloture
				: aParam.QCM.etatCloture;
		}
		if (
			aParam.QCM &&
			aParam.modeVisuQuestion &&
			aParam.modeVisuQuestion === true &&
			MethodesObjet_1.MethodesObjet.isNumeric(aParam.questionEnVisu)
		) {
			this.indiceQuestion = aParam.questionEnVisu;
			this.modeVisuQuestion = aParam.modeVisuQuestion;
		} else {
			this.modeVisuQuestion = false;
		}
		if (aParam.QCM) {
			let lDecalageLS = LocalStorage_1.IELocalStorage.getItemJSON(
				"decalage" + GEtatUtilisateur.GenreEspace,
			);
			if (!lDecalageLS) {
				lDecalageLS = {};
				lDecalageLS.date = new Date().getTime();
			} else if (lDecalageLS.date) {
				lDecalageLS.date = new Date(lDecalageLS.date).getTime();
			}
			if (aParam.QCM.secEcoulees) {
				let lMilliSecEcoulees =
					aParam.QCM.dtServeur.getTime() - aParam.QCM.dtDemarrage.getTime();
				const lDecalage = aParam.QCM.decalage;
				if (lDecalageLS.sec === undefined || lDecalage < lDecalageLS.sec) {
					lDecalageLS.sec = lDecalage;
					lDecalageLS.date = new Date().getTime();
					LocalStorage_1.IELocalStorage.setItemJSON(
						"decalage" + GEtatUtilisateur.GenreEspace,
						lDecalageLS,
					);
				}
				lMilliSecEcoulees = lMilliSecEcoulees + lDecalageLS.sec * 1000;
				this.start = new Date().getTime() - lMilliSecEcoulees;
			} else if (!this.start && !this.estEnInitialisation()) {
				if (lDecalageLS) {
					const lDateValide = ObjetDate_1.GDate.getJourSuivant(new Date(), -1);
					if (
						!lDecalageLS.date ||
						ObjetDate_1.GDate.estAvantJour(
							new Date(lDecalageLS.date),
							lDateValide,
						)
					) {
						lDecalageLS = { date: new Date().getTime() };
						LocalStorage_1.IELocalStorage.setItemJSON(
							"decalage" + GEtatUtilisateur.GenreEspace,
							lDecalageLS,
						);
					}
				}
				this.start = new Date().getTime();
			}
			if (
				aParam.QCM.listeQuestions &&
				!this.modeProf &&
				$.inArray(this.etatCloture, [
					TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
						.EQR_EnCours,
					TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
						.EQR_ARefaire,
				]) > -1
			) {
				this.question = aParam.QCM.listeQuestions.get(0);
			} else if (aParam.QCM.listeQuestions) {
				this.listeQuestions = aParam.QCM.listeQuestions;
				this.question = aParam.QCM.listeQuestions.get(this.indiceQuestion);
			}
		}
		this.typeAffichageCourant = this._determinerTypeAffichageCourant();
		if (
			this.estEnInitialisation() ||
			!this.estEnCloture() ||
			this.estEnCorrigeFin()
		) {
			this.actualiser();
		}
	}
	setDonneesReponse(aParam) {
		if (aParam) {
			this.etatCloture = aParam.etatCloture;
			if (
				this.executionQCM.modeDiffusionCorrige ===
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM
						.FBQ_CorrigeApresQuestion &&
				aParam.listeQuestions &&
				aParam.listeQuestions.count() === 1
			) {
				$.extend(true, this.question, aParam.listeQuestions.get(0));
			}
		}
		if (
			this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin &&
			aParam &&
			aParam.listeQuestions &&
			aParam.listeQuestions.count() > 0
		) {
			this.listeQuestions = aParam.listeQuestions;
		}
		this.typeAffichageCourant = this._determinerTypeAffichageCourant();
		this.actualiser();
	}
	arreterTouteLectureAudio() {
		const lElementsAudio = $("audio");
		if (lElementsAudio) {
			lElementsAudio.each((aIndex, aElementAudio) => {
				if (
					aElementAudio &&
					UtilitaireAudio_1.UtilitaireAudio.estEnCoursDeLecture(aElementAudio)
				) {
					UtilitaireAudio_1.UtilitaireAudio.stopAudio(aElementAudio);
				}
			});
		}
	}
	surEvenement(aObjet) {
		if (this.enActualisation) {
			return;
		} else {
			this.enActualisation = true;
		}
		this.arreterTouteLectureAudio();
		if (
			this.estEnCloture() &&
			!this.estUnCorrigeVisibleApresCloture() &&
			!this.peutEtreRefait()
		) {
			this.fermetureFenetre();
			return;
		}
		if (this.modeProf) {
			this.surEvenementProf(aObjet);
		} else {
			this.surEvenementEleve(aObjet);
		}
	}
	surEvenementProf(aObjet) {
		if (
			aObjet.action === TypeActionVisuEleveQCM.Valider &&
			this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeApresQuestion
		) {
			this.typeAffichageCourant = TypeAffichageContenu.PageCorrigeQuestion;
			if (this.estEnCours()) {
				this.question.reponsesRepondant = this.recupererReponses();
				this.actualiser();
			} else {
				this.fermetureFenetre();
			}
		} else {
			if (this.modeVisuQuestion) {
				this.fermetureFenetre();
				return;
			}
			if (aObjet.action === TypeActionVisuEleveQCM.Precedent) {
				this.indiceQuestion--;
			} else {
				if (aObjet.action === TypeActionVisuEleveQCM.Valider) {
					if (this.estEnCours()) {
						this.evaluationNote[this.indiceQuestion].validee = true;
						this.question.reponsesRepondant = this.recupererReponses();
					} else if (this.estEnRessenti()) {
						$.noop();
					} else if (this.estEnFin()) {
						if (
							this.executionQCM.modeDiffusionCorrige !==
								TypeModeCorrectionQCM_1.TypeModeCorrectionQCM
									.FBQ_CorrigeALaFin ||
							this.estEnCorrigeFin()
						) {
							this.fermetureFenetre();
						} else {
							this.indiceQuestion++;
							this.typeAffichageCourant =
								TypeAffichageContenu.PageCorrigeComplet;
							this.actualiser();
						}
						return;
					}
				}
				if (
					this.estEnCloture() &&
					this.executionQCM.estRejouable &&
					aObjet.action === TypeActionVisuEleveQCM.Recommencer
				) {
					this.etatCloture = null;
				}
				if (this.estEnCloture()) {
					this.indiceQuestion =
						this.nbQuestions + Number(this.executionQCM.ressentiRepondant) + 1;
				} else {
					this.indiceQuestion++;
				}
			}
			this.recupererQuestionProf();
		}
	}
	surEvenementEleve(aObjet) {
		if (
			aObjet.action === TypeActionVisuEleveQCM.Valider &&
			this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeApresQuestion
		) {
			this.surEvenementValidationEleve();
			if (this.estEnRessenti()) {
				this.indiceQuestion++;
			}
		} else {
			if (aObjet.action === TypeActionVisuEleveQCM.Precedent) {
				this.indiceQuestion--;
			} else {
				if (aObjet.action === TypeActionVisuEleveQCM.Valider) {
					if (!this.surEvenementValidationEleve()) {
						return;
					}
				}
				if (
					this.estEnCloture() &&
					((this.executionQCM.estRejouable &&
						aObjet.action === TypeActionVisuEleveQCM.Recommencer) ||
						(aObjet.action === TypeActionVisuEleveQCM.Commencer &&
							this.peutEtreRefait()))
				) {
					this.etatCloture = null;
				}
				if (this.estEnInitialisation() && this.estUneExecutionDejaCommencee()) {
					this.indiceQuestion = this.executionQCM.indiceProchaineQuestion;
				} else if (this.estEnCloture()) {
					this.indiceQuestion =
						this.nbQuestions + Number(this.executionQCM.ressentiRepondant) + 1;
				} else {
					this.indiceQuestion++;
				}
			}
			this.recupererQuestionEleve();
		}
	}
	recupererQuestion() {
		this.arreterTouteLectureAudio();
		if (this.modeProf) {
			this.recupererQuestionProf();
		} else {
			this.recupererQuestionEleve();
		}
	}
	recupererQuestionProf() {
		if (this.listeQuestions && this.listeQuestions.count() > 0) {
			if (this.executionQCM.dureeMaxQCM && this._getMsTempsRestant() <= 0) {
				this.etatCloture =
					TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant.EQR_DureeMaxDepassee;
			}
			this.question = this.listeQuestions.get(this.indiceQuestion);
			this.typeAffichageCourant = this._determinerTypeAffichageCourant();
			this.actualiser();
		} else {
			const lParam = {
				action: TypeCallbackVisuEleveQCM.get,
				indiceQuestion: this.indiceQuestion,
				numeroExecution: this.numeroExecution,
				element: this.executionQCM,
				pourInitialisation: this.estRecuperationDeQuestionPourInitialisation(),
			};
			this.Evenement(lParam);
		}
	}
	recupererQuestionEleve() {
		const lParam = {
			action: TypeCallbackVisuEleveQCM.get,
			indiceQuestion: this.indiceQuestion,
			numeroExecution: this.numeroExecution,
			element: this.executionQCM,
			pourInitialisation: this.estRecuperationDeQuestionPourInitialisation(),
		};
		this.Evenement(lParam);
	}
	estRecuperationDeQuestionPourInitialisation() {
		let lEstPourInitialisation = false;
		if (this.indiceQuestion === 0 && !this.estEnCloture()) {
			lEstPourInitialisation = true;
			if (this.evaluationNote && this.evaluationNote.length > 0) {
				lEstPourInitialisation = false;
			}
		}
		return lEstPourInitialisation;
	}
	surEvenementValidationEleve() {
		let lParam;
		if (this.estEnCours()) {
			this.evaluationNote[this.indiceQuestion].validee = true;
			lParam = {
				action: TypeCallbackVisuEleveQCM.set,
				element: this.executionQCM,
				indiceQuestion: this.indiceQuestion,
				reponse: this.recupererReponses(),
			};
			this.Evenement(lParam);
		} else if (this.estEnRessenti()) {
			lParam = {
				action: TypeCallbackVisuEleveQCM.set,
				element: this.executionQCM,
				ressenti: this.ressenti,
			};
			this.Evenement(lParam);
		} else if (this.estEnFin()) {
			if (
				this.executionQCM.modeDiffusionCorrige !==
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin ||
				this.estEnCorrigeFin()
			) {
				this.fermetureFenetre(
					this.executionQCM.modeDiffusionCorrige !==
						TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin,
				);
			} else {
				lParam = {
					action: TypeCallbackVisuEleveQCM.set,
					element: this.executionQCM,
					pourCloture: true,
				};
				this.Evenement(lParam);
			}
			return false;
		}
		return true;
	}
	fermetureFenetre(aPourCloture = false) {
		const lParam = { action: TypeCallbackVisuEleveQCM.close };
		if (aPourCloture === true) {
			lParam.element = this.executionQCM;
			lParam.pourCloture = true;
		}
		this.Evenement(lParam);
	}
	estEnInitialisation() {
		return this.indiceQuestion === -1;
	}
	estEnRessenti() {
		return (
			this.indiceQuestion === this.nbQuestions &&
			this.executionQCM.ressentiRepondant
		);
	}
	estEnFin() {
		return this.indiceQuestion >= this.nbQuestions && !this.estEnRessenti();
	}
	estEnCorrigeFin() {
		return (
			(this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin ||
				(this.estEnCloture() && this.estUnCorrigeVisibleApresCloture())) &&
			this.indiceQuestion ===
				this.nbQuestions + Number(this.executionQCM.ressentiRepondant) + 1
		);
	}
	estCorrigePendantExecutionEleve() {
		return (
			this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin &&
			this.listeQuestions &&
			this.listeQuestions.count() > 0 &&
			this.etatCloture !==
				TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
					.EQR_DureeMaxDepassee
		);
	}
	estPageCorrigeAutorise() {
		return (
			this.estEnCloture() &&
			([
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeApresQuestion,
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin,
			].includes(this.executionQCM.modeDiffusionCorrige) ||
				(this.executionQCM.modeDiffusionCorrige ===
					TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate &&
					!this.estUnCorrigePublieFuture()) ||
				((this.executionQCM.estLieADevoir ||
					this.executionQCM.estLieAEvaluation) &&
					this.executionQCM.publierCorrige) ||
				this.modeProf)
		);
	}
	estEnCours() {
		return this.indiceQuestion > -1 && this.indiceQuestion < this.nbQuestions;
	}
	estEnCloture() {
		return (
			this.etatCloture !== undefined &&
			this.etatCloture !== null &&
			$.inArray(this.etatCloture, [
				TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
					.EQR_EnCours,
				TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
					.EQR_ARefaire,
			]) === -1
		);
	}
	estDureeMaxDepasse() {
		return (
			this.etatCloture !== undefined &&
			this.etatCloture !== null &&
			this.etatCloture ===
				TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
					.EQR_DureeMaxDepassee
		);
	}
	estUneExecutionDejaCommencee() {
		return (
			this.executionQCM.indiceProchaineQuestion >= 0 &&
			this.executionQCM.indiceProchaineQuestion < this.nbQuestions
		);
	}
	estUnCorrigeVisibleApresCloture() {
		return (
			this.executionQCM.publierCorrige ||
			this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaFin ||
			this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM
					.FBQ_CorrigeApresQuestion ||
			(this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate &&
				!this.estUnCorrigePublieFuture()) ||
			this.modeProf
		);
	}
	estUnCorrigePublieFuture() {
		return (
			this.executionQCM.modeDiffusionCorrige ===
				TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeALaDate &&
			!ObjetDate_1.GDate.estAvantJourCourant(this.executionQCM.dateCorrige) &&
			!ObjetDate_1.GDate.estJourCourant(this.executionQCM.dateCorrige)
		);
	}
	estQuestionMatchingASymetrique(aQuestion) {
		let lEstAsymetrique = false;
		if (
			!!aQuestion &&
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_Matching &&
			!!aQuestion.listeReponses
		) {
			const lHashesReponses = [];
			for (const lReponse of aQuestion.listeReponses) {
				if (!!lReponse.associationB) {
					if (
						$.inArray(lReponse.associationB.hashContenu, lHashesReponses) === -1
					) {
						lHashesReponses.push(lReponse.associationB.hashContenu);
					} else {
						lEstAsymetrique = true;
						break;
					}
				}
			}
		}
		return lEstAsymetrique;
	}
	estUnQCMAvecTentativesPossibles() {
		return this.executionQCM.nbMaxTentative > 1;
	}
	peutEtreRefait() {
		const lNrTentative = !this.executionQCM.nbTentatives
			? 0
			: this.executionQCM.nbTentatives;
		const lEnPublication =
			!!this.executionQCM.dateFinPublication &&
			!ObjetDate_1.GDate.estAvantJour(
				this.executionQCM.dateFinPublication,
				new Date(),
			);
		return (
			lEnPublication &&
			this.estUnQCMAvecTentativesPossibles() &&
			lNrTentative < this.executionQCM.nbMaxTentative &&
			!this.modeProf
		);
	}
	composeReponsesDeQuestion(aQuestion, aIndiceQuestion) {
		const lHtml = [];
		if (
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_SingleChoice ||
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_MultiChoice
		) {
			lHtml.push(
				this._composeReponsesDeQuestionSingleOuMulti(
					aQuestion,
					aIndiceQuestion,
				),
			);
		} else if (
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ShortAnswer ||
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_NumericalAnswer
		) {
			lHtml.push(
				this._composeReponsesDeQuestionShortOuNumeric(
					aQuestion,
					aIndiceQuestion,
				),
			);
		} else if (
			aQuestion.getGenre() ===
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer
		) {
			lHtml.push(
				this._composeReponsesDeQuestionSpell(aQuestion, aIndiceQuestion),
			);
		} else if (
			aQuestion.getGenre() ===
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching
		) {
			lHtml.push(
				'<div class="association-wrapper">',
				this._composeReponsesDeQuestionMatching(aQuestion, aIndiceQuestion),
				"</div>",
			);
		} else if (
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeField ||
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeFixed ||
			aQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeVariable
		) {
			lHtml.push(
				this._composeReponsesDeQuestionCloze(aQuestion, aIndiceQuestion),
			);
		}
		if (lHtml.length > 0) {
			lHtml.unshift('<div class="wrapperQuestionQCM">');
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	_composeReponsesDeQuestionSingleOuMulti(aQuestion, aIndiceQuestion) {
		const lHtml = [];
		let lAvecReponsesMisesEnForme =
			UtilitaireQCM_1.UtilitaireQCM.estReponsesSingleMultiAvecMiseEnForme(
				aQuestion,
			);
		lHtml.push('<ul class="cbr-group zone-reponse">');
		if (!!aQuestion.listeReponses) {
			for (let i = 0; i < aQuestion.listeReponses.count(); i++) {
				const lReponse = aQuestion.listeReponses.get(i);
				if (!lReponse) {
					continue;
				}
				if (!lReponse.existe()) {
					continue;
				}
				lHtml.push(
					this._composeReponseDeQuestionSingleOuMulti({
						indiceQuestion: aIndiceQuestion,
						genreQuestion: aQuestion.getGenre(),
						reponse: lReponse,
						avecReponseMiseEnForme: lAvecReponsesMisesEnForme,
						indiceReponse: i,
					}),
				);
			}
		}
		lHtml.push("</ul>");
		return lHtml.join("");
	}
	_composeReponseDeQuestionSingleOuMulti(aParams) {
		const lEstQuestionAChoixUnique =
			aParams.genreQuestion ===
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SingleChoice;
		const lTypeElement = lEstQuestionAChoixUnique ? "radio" : "checkbox";
		const lIdQuestion = this.getIdZoneReponsesDeQuestion(
			aParams.indiceQuestion,
		);
		const lIdReponse = lIdQuestion + "_r" + aParams.indiceReponse;
		const lNameGroupeElements = lIdQuestion;
		const lLibelleReponse = !aParams.reponse.editionAvancee
			? aParams.reponse.getLibelle()
			: aParams.reponse.libelleHtml;
		const lContenuCbrVisu = [];
		if (aParams.avecReponseMiseEnForme) {
			lContenuCbrVisu.push(
				'<div class="libelle tiny-view">',
				lLibelleReponse,
				"</div>",
			);
			if (aParams.reponse.image) {
				lContenuCbrVisu.push(
					'<div class="thumbnail"><img src="data:image/png;base64,' +
						aParams.reponse.image +
						'" ',
					!IE.estMobile ? "ie-imgviewer" : "",
					" /></div>",
				);
			}
		} else {
			lContenuCbrVisu.push(lLibelleReponse);
		}
		const lClassesLabel = ["cbr"];
		if (aParams.avecReponseMiseEnForme) {
			lClassesLabel.push("mis-en-forme");
		}
		const lHtml = [];
		lHtml.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"li",
					{ tabindex: "0" },
					IE.jsx.str(
						"label",
						{ class: lClassesLabel.join(" ") },
						IE.jsx.str("input", {
							id: lIdReponse,
							type: lTypeElement,
							name: lNameGroupeElements,
						}),
						IE.jsx.str("div", { class: "cbr-visu" }, lContenuCbrVisu.join("")),
					),
				),
			),
		);
		return lHtml.join("");
	}
	_composeReponsesDeQuestionShortOuNumeric(aQuestion, aIndiceQuestion) {
		const lUniquementReponseNumerique =
			aQuestion.getGenre() ===
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer;
		const lTypeChamp =
			lUniquementReponseNumerique && IE.estMobile ? "number" : "text";
		const lValeurMaskChampText = lUniquementReponseNumerique
			? ' ie-mask="/[^0-9,.+-]/i"'
			: "";
		const lPrefixeIdQuestion =
			this.getIdZoneReponsesDeQuestion(aIndiceQuestion);
		const lHtml = [];
		lHtml.push('<div class="fields-wrapper zone-reponse">');
		lHtml.push(
			'<label class="input-wrap" for="',
			lPrefixeIdQuestion,
			'_r0">',
			ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Reponse"),
			"</label>",
		);
		lHtml.push(
			'<input class="for-qcm" type="',
			lTypeChamp,
			'"',
			lValeurMaskChampText,
			' id="',
			lPrefixeIdQuestion,
			'_r0" maxlength="35" />',
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_composeReponsesDeQuestionSpell(aQuestion, aIndiceQuestion) {
		const lHtml = [];
		if (!!aQuestion.longueurReponseEpellation) {
			const lPrefixeIdQuestion =
				this.getIdZoneReponsesDeQuestion(aIndiceQuestion);
			lHtml.push('<div class="fields-wrapper zone-reponse spell">');
			lHtml.push('<div class="spell-contain">');
			for (let i = 0; i < aQuestion.longueurReponseEpellation; i++) {
				lHtml.push(
					'<input name="' +
						lPrefixeIdQuestion +
						'_r" type="text" maxlength="1" ie-node="Question.Epellation.getNodeInput" />',
				);
			}
			lHtml.push("</div>");
			lHtml.push(
				IE.jsx.str(
					"div",
					{
						tabindex: "0",
						role: "button",
						"ie-node": "Question.Epellation.nodeBtnEffacerSaisie",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.ToutEffacer",
						),
						class: "erase-all",
					},
					IE.jsx.str("i", { class: "icon_trash", role: "presentation" }),
				),
			);
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	_composeReponsesDeQuestionMatching(aQuestion, aIndiceQuestion) {
		const lHtml = [];
		for (let i = 0; i < aQuestion.listeReponses.count(); i++) {
			const lReponse = aQuestion.listeReponses.get(i);
			if (!lReponse) {
				continue;
			}
			if (!lReponse.existe()) {
				continue;
			}
			const lLibelleAssocA =
				UtilitaireQCM_1.UtilitaireQCM.getStringAffichageReponseMatching(
					lReponse.associationA,
					true,
					{ indiceReponse: i, ieModelAudio: "modelChipsAudio" },
				);
			const lIdReponseAssociee = this.getIdZoneReponseAssociee(
				aIndiceQuestion,
				i,
			);
			const lIENodeAssociationItem =
				"Question.Associations.nodeAssociationItem(" +
				aIndiceQuestion +
				"," +
				i +
				")";
			const lIEAvecBtnSupprimerAssociationItem =
				"Question.Associations.avecBoutonSupprimerReponseAssociee(" +
				aIndiceQuestion +
				"," +
				i +
				")";
			const lIEModelBoutonSupprimerAssociationItem =
				"Question.Associations.btnSupprimerReponseAssociee(" +
				aIndiceQuestion +
				"," +
				i +
				")";
			lHtml.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "asso-item", "ie-node": lIENodeAssociationItem },
						IE.jsx.str(
							"div",
							{ class: "choix-wrapper" },
							IE.jsx.str("div", null, lLibelleAssocA),
							IE.jsx.str("div", { class: "reponse", id: lIdReponseAssociee }),
						),
						IE.jsx.str(
							"div",
							{ class: "barre-laterale" },
							IE.jsx.str("i", { class: "icon_mesure_conservatoire" }),
							IE.jsx.str("ie-btnicon", {
								"ie-if": lIEAvecBtnSupprimerAssociationItem,
								"ie-model": lIEModelBoutonSupprimerAssociationItem,
								class: "icon_trash",
							}),
						),
					),
				),
			);
		}
		return lHtml.join("");
	}
	_composeReponsesDeQuestionCloze(aQuestion, aIndiceQuestion) {
		let lIndice = 0;
		const lPrefixeIdQuestion =
			this.getIdZoneReponsesDeQuestion(aIndiceQuestion);
		let lEnonceAvecElementsGraphiques = "";
		if (aQuestion.enonce) {
			lEnonceAvecElementsGraphiques = aQuestion.enonce.replace(
				/&#039;/gi,
				"&apos;",
			);
			if (
				aQuestion.getGenre() ===
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_ClozeField &&
				aQuestion.enonce.match(/{#}/gi)
			) {
				const lInputTextAMettre =
					'<label class="input-wrap"><input  class="for-qcm" type="text" id="' +
					lPrefixeIdQuestion +
					"_r" +
					lIndice++ +
					'" /></label>';
				lEnonceAvecElementsGraphiques = lEnonceAvecElementsGraphiques.replace(
					/{#}/gi,
					lInputTextAMettre,
				);
			} else if (
				aQuestion.listeReponses &&
				aQuestion.listeReponses.count() &&
				aQuestion.listeReponses.count() ===
					aQuestion.enonce.match(/{#}/gi).length
			) {
				for (let i = 0; i < aQuestion.listeReponses.count(); i++) {
					let lComboAMettre = "";
					lComboAMettre +=
						'<select class="for-qcm" id="' +
						lPrefixeIdQuestion +
						"_r" +
						i +
						'">';
					lComboAMettre += '<option value=""></option>';
					lComboAMettre += $.map(
						aQuestion.listeReponses.get(i).listeChoix,
						(val) => {
							return '<option value="' + val + '">' + val + "</option>";
						},
					).join("");
					lComboAMettre += "</select>";
					lEnonceAvecElementsGraphiques = lEnonceAvecElementsGraphiques.replace(
						"{#}",
						lComboAMettre,
					);
				}
			}
		}
		const lHtml = [];
		lHtml.push('<div class="fields-wrapper zone-reponse tiny-view">');
		lHtml.push(lEnonceAvecElementsGraphiques);
		lHtml.push("</div>");
		return lHtml.join("");
	}
}
exports.ObjetVisuEleve = ObjetVisuEleve;
class ObjetFenetreChoixAssociation extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeSelectionReponseDisponible(aIndiceReponse) {
				$(this.node).eventValidation(() => {
					aInstance.indiceReponseDisponibleSelectionnee = aIndiceReponse;
					aInstance.surValidation(Enumere_Action_1.EGenreAction.Valider);
				});
			},
			modelChipsAudio: {
				event(e) {
					e.stopPropagation();
					const lElemAudioConcerne = $(this.node).find("audio")[0];
					const lTousLesElementsAudios = $(
						".ObjetFenetreChoixAssociation_racine",
					).find("audio");
					for (let i = 0; i < lTousLesElementsAudios.length; i++) {
						const lElemAudio = lTousLesElementsAudios.get(i);
						if (lElemAudio !== lElemAudioConcerne) {
							UtilitaireAudio_1.UtilitaireAudio.stopAudio(lElemAudio);
						}
					}
					UtilitaireAudio_1.UtilitaireAudio.executeClicChipsParDefaut(
						this.node,
					);
				},
				node() {
					const $chips = $(this.node);
					const $audio = $chips.find("audio");
					$audio.on("play", () => {
						$chips
							.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture)
							.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop);
					});
					$audio.on("pause", () => {
						$chips
							.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop)
							.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture);
					});
				},
			},
		});
	}
	afficherListeReponsesAAssocier(
		aElementAssociationA,
		aIndiceReponseDestination,
		aListeElementsAssociationB,
	) {
		this.elementAssociationA = aElementAssociationA;
		this.indiceReponseDestination = aIndiceReponseDestination;
		this.listeElementsAssociationB = aListeElementsAssociationB;
		this.indiceReponseDisponibleSelectionnee = -1;
		this.afficher();
		this.actualiser();
	}
	afficherListeReponsesPossibles() {}
	getParametresValidation(aNumeroBouton) {
		let lElementAssociationBSelectionne = null;
		if (
			this.listeElementsAssociationB &&
			this.indiceReponseDisponibleSelectionnee > -1
		) {
			lElementAssociationBSelectionne =
				this.listeElementsAssociationB[this.indiceReponseDisponibleSelectionnee]
					.elementAssociationB;
		}
		let lParametres = super.getParametresValidation(aNumeroBouton);
		return $.extend(lParametres, {
			elementAssociationBAAssocier: lElementAssociationBSelectionne,
		});
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				this._composeReponseDestination(
					this.elementAssociationA,
					this.indiceReponseDestination,
				),
				this._composeListeReponsesDisponibles(this.listeElementsAssociationB),
			),
		);
		return H.join("");
	}
	_composeReponseDestination(aElementAssociationA, aIndiceReponseDestination) {
		const H = [];
		if (aElementAssociationA) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "rappel-reponse" },
						UtilitaireQCM_1.UtilitaireQCM.getStringAffichageReponseMatching(
							aElementAssociationA,
							true,
							{
								indiceReponse: aIndiceReponseDestination,
								ieModelAudio: "modelChipsAudio",
							},
						),
					),
				),
			);
		}
		return H.join("");
	}
	_composeListeReponsesDisponibles(aListeElementsAssociationB) {
		const lReponsesDisponibles = [];
		if (aListeElementsAssociationB) {
			let lIndex = 0;
			for (const lElementAssociationB of aListeElementsAssociationB) {
				const lNodeSelectionReponseDispo =
					"nodeSelectionReponseDisponible(" + lIndex + ")";
				const lClassesItem = ["reponse-item"];
				if (lElementAssociationB.estAffecte) {
					lClassesItem.push("affecte");
				}
				lReponsesDisponibles.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							{
								"ie-node": lNodeSelectionReponseDispo,
								class: lClassesItem.join(" "),
							},
							IE.jsx.str(
								"div",
								{ class: "element-container" },
								UtilitaireQCM_1.UtilitaireQCM.getStringAffichageReponseMatching(
									lElementAssociationB.elementAssociationB,
									true,
									{ indiceReponse: lIndex, ieModelAudio: "modelChipsAudio" },
								),
							),
							IE.jsx.str(
								"div",
								{ class: "barre-laterale" },
								IE.jsx.str("i", { class: "icon_check_fin" }),
							),
						),
					),
				);
				lIndex++;
			}
		}
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "liste-reponses" },
					lReponsesDisponibles.join(""),
				),
			),
		);
		return H.join("");
	}
}
