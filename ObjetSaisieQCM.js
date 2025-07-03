exports.ObjetSaisieQCM = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const TypeGenreExerciceDeQuestionnaire_1 = require("TypeGenreExerciceDeQuestionnaire");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const MethodesObjet_1 = require("MethodesObjet");
const DonneesListe_QuestionQCM_1 = require("DonneesListe_QuestionQCM");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetElement_1 = require("ObjetElement");
const AccessApp_1 = require("AccessApp");
class ObjetSaisieQCM extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
		this.nombreQuestionsSoumises = null;
		this.options = { avecGestionBareme: true, avecCB: false };
	}
	setOptions(aOptions) {
		Object.assign(this.options, aOptions);
		return this;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.eventListe.bind(this),
			this.initListe.bind(this),
		);
	}
	setDonnees(aParam) {
		this.donneesRecues = true;
		this.qcm = aParam.contenuQCM;
		this.avecEdition = aParam.avecEdition;
		this.deployeParDefaut = aParam.deployeParDefaut === true;
		this.envoieVers = aParam.envoieVers === true;
		this.nombreQuestionsSoumises = aParam.nombreQuestionsSoumises;
		this.afficher();
		this.listeQuestions = MethodesObjet_1.MethodesObjet.dupliquer(
			this.qcm.listeQuestions,
		);
		if (this.deployeParDefaut) {
			for (const lQuestion of this.listeQuestions) {
				lQuestion.estDeploye = true;
			}
		}
		this.listeQuestions.setTri([
			ObjetTri_1.ObjetTri.init("nouvellePosition"),
			ObjetTri_1.ObjetTri.init("Position"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		this.listeQuestions.trier();
		this.numeroterQuestion();
		this.afficherListe();
	}
	afficherListe() {
		const lTypeNumerotationQCM =
			this.qcm.typeNumerotation !== undefined
				? this.qcm.typeNumerotation
				: this.qcm.contenuQCM.typeNumerotation;
		const lInstanceListe = this.getInstance(this.identListe);
		this.initListe(lInstanceListe);
		const lDonneesListe =
			new DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM(
				this._composeListeAvecFils(this.listeQuestions),
				{
					typeNumerotationQCM: lTypeNumerotationQCM,
					evenementMenuContext: this.evenementMenuContext.bind(this),
					ajoutItemsTypeQuestion: this._ajoutItemsTypeQuestion.bind(this),
					ajouterALaSelection: this.ajouterALaSelection.bind(this),
					surDeplacementLigne: this.surDeplacementLigne.bind(this),
					optionsListeQuestionQCM: {
						avecEdition: this.avecEdition,
						avecGestionBareme: this.options.avecGestionBareme,
						nombreQuestionsSoumises: this.nombreQuestionsSoumises,
						envoieVers: this.envoieVers,
						avecAffichageInfosCompetences: true,
					},
				},
			);
		lDonneesListe.setOptions({ avecCB: !!this.options.avecCB });
		lInstanceListe.setDonnees(lDonneesListe);
	}
	actualiserAffichage() {
		this.afficherListe();
	}
	construireAffichage() {
		if (this.donneesRecues) {
			return this.construireListeSaisie();
		}
		return "";
	}
	construireListeSaisie() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "full-height ObjetSaisieQCM" },
					IE.jsx.str("div", {
						class: "full-height",
						id: this.getInstance(this.identListe).getNom(),
					}),
				),
			),
		);
		return lHtml.join("");
	}
	ajouterALaSelection(aSelection) {
		const lListeQuestions = new ObjetListeElements_1.ObjetListeElements();
		if (MethodesObjet_1.MethodesObjet.isArray(aSelection)) {
			for (const { article: lQuestion } of aSelection) {
				lListeQuestions.add(lQuestion);
			}
		}
		if (
			aSelection instanceof ObjetListeElements_1.ObjetListeElements ||
			aSelection instanceof ObjetElement_1.ObjetElement
		) {
			lListeQuestions.add(aSelection);
		}
		this.callback.appel({
			action: ObjetSaisieQCM.TypeCallback.Selection,
			listeQuestions: lListeQuestions,
		});
	}
	_ajoutItemsTypeQuestion(aItemParent) {
		let lElement;
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_SingleChoice,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceChoixUnique",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_SingleChoice,
			);
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_MultiChoice,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceChoixMultiple",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_MultiChoice,
			);
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_NumericalAnswer,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceReponseNumerique",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_NumericalAnswer,
			);
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_ShortAnswer,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceReponseASaisir",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ShortAnswer,
			);
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_SpellAnswer,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceEpellation",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_SpellAnswer,
			);
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_Matching,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceAssociation",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_Matching,
			);
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_ClozeField,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceClozeField",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeField,
			);
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_ClozeFixed,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceClozeFixed",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeFixed,
			);
		lElement = aItemParent.addCommande(
			DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
				.GenreCommandeMenuContextuel.Ajout_GEQ_ClozeVariable,
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.GenreExerciceClozeVariable",
			),
			true,
		);
		lElement.image =
			TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeVariable,
			);
	}
	ouvrirMenuContextuelCreation() {
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			evenement: (aLigne) => {
				this.evenementMenuContext(aLigne);
			},
			initCommandes: (aInstance) => {
				this._ajoutItemsTypeQuestion(aInstance);
				aInstance.addSeparateur();
				aInstance.addCommande(
					DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
						.GenreCommandeMenuContextuel.SavoirPlus,
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.EnSavoirPlus"),
					true,
				);
			},
		});
	}
	numeroterQuestion() {
		for (const lQuestion of this.qcm.listeQuestions) {
			lQuestion.nouvellePosition = lQuestion.getPosition();
		}
	}
	surDeplacementLigne(aParamsLigneDestination, aParamsSource) {
		const lArticleSource = aParamsSource.article;
		const lArticleDestination =
			aParamsLigneDestination.article.pere || aParamsLigneDestination.article;
		if (
			aParamsLigneDestination.article.pere &&
			aParamsLigneDestination.article.pere.getNumero() ===
				aParamsSource.article.getNumero()
		) {
			return;
		}
		const lPositionSource = lArticleSource.getPosition();
		const lPositionDestination = lArticleDestination.getPosition();
		lArticleSource.nouvellePosition = lPositionDestination;
		if (lPositionSource < lPositionDestination) {
			this.qcm.listeQuestions.parcourir((aQuestion) => {
				const lPositionQuestion = aQuestion.getPosition();
				if (lPositionQuestion === lPositionSource) {
					aQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aQuestion.nouvellePosition = lPositionDestination;
					return;
				}
				if (lPositionQuestion === lPositionDestination) {
					aQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aQuestion.nouvellePosition = lPositionDestination - 1;
					return;
				}
				if (
					lPositionQuestion > lPositionSource &&
					lPositionQuestion < lPositionDestination
				) {
					aQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aQuestion.nouvellePosition = lPositionQuestion - 1;
					return;
				}
				if (
					lPositionQuestion !== lArticleSource.nouvellePosition &&
					lPositionQuestion !== lPositionSource
				) {
					aQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aQuestion.nouvellePosition = lPositionQuestion;
					return;
				}
			});
		} else {
			this.qcm.listeQuestions.parcourir((aQuestion) => {
				const lPositionQuestion = aQuestion.getPosition();
				if (lPositionQuestion === lPositionSource) {
					aQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aQuestion.nouvellePosition = lPositionDestination;
					return;
				}
				if (lPositionQuestion === lPositionDestination) {
					aQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aQuestion.nouvellePosition = lPositionDestination + 1;
					return;
				}
				if (
					lPositionQuestion > lPositionDestination &&
					lPositionQuestion < lPositionSource
				) {
					aQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aQuestion.nouvellePosition = lPositionQuestion + 1;
					return;
				}
				if (
					lPositionQuestion !== lArticleSource.nouvellePosition &&
					lPositionQuestion !== lPositionSource
				) {
					aQuestion.nouvellePosition = lPositionQuestion;
					return;
				}
			});
		}
		this.callback.appel({
			action: ObjetSaisieQCM.TypeCallback.DeplacerQuestion,
		});
	}
	initListe(aInstance) {
		aInstance.setOptionsListe({
			avecLigneCreation: this.avecEdition,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
	eventListe(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.ouvrirMenuContextuelCreation();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ModificationCBLigne: {
				const lSelection = this.options.avecCB
					? this.getInstance(this.identListe).getListeArticlesCochees()
					: aParams.article;
				this.ajouterALaSelection(lSelection);
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (!this.options.avecCB) {
					this.ajouterALaSelection(aParams.article);
				}
				if (this.avecEdition) {
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.OuvrirEdition,
						indice: aParams.article.indice,
					});
				}
				break;
		}
	}
	evenementMenuContext(aElement) {
		if (aElement) {
			switch (aElement.getNumero()) {
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Modifier:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.OuvrirEdition,
						indice: aElement.data.indiceElement,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Dupliquer:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.DupliquerQuestion,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Supprimer:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.SupprimerQuestion,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.ModifierPonderation:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.ModifierPonderation,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_SingleChoice:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_SingleChoice,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_MultiChoice:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_MultiChoice,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_NumericalAnswer:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_NumericalAnswer,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_ShortAnswer:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_ShortAnswer,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_SpellAnswer:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_SpellAnswer,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_Matching:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_Matching,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_ClozeField:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_ClozeField,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_ClozeFixed:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_ClozeFixed,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.Ajout_GEQ_ClozeVariable:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.AjouterQuestion,
						genre:
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_ClozeVariable,
					});
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.SavoirPlus:
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({ idRessource: "SaisieQCM.MFicheTypeDeQuestions" });
					break;
				case DonneesListe_QuestionQCM_1.DonneesListe_QuestionQCM
					.GenreCommandeMenuContextuel.CopierQuestion:
					this.callback.appel({
						action: ObjetSaisieQCM.TypeCallback.CopierQuestion,
					});
					break;
			}
		}
	}
	_composeListeAvecFils(aListe) {
		const lListeRetour = new ObjetListeElements_1.ObjetListeElements();
		MethodesObjet_1.MethodesObjet.dupliquer(aListe).parcourir(
			(aQuestion, aIndice) => {
				aQuestion.indice = aIndice;
				const lFils = MethodesObjet_1.MethodesObjet.dupliquer(aQuestion);
				lFils.pere = aQuestion;
				lFils.Numero = -1;
				aQuestion.estUnDeploiement = true;
				aQuestion.estDeploye =
					"estDeploye" in aQuestion ? aQuestion.estDeploye : false;
				aQuestion.fils = lFils;
				lListeRetour.add(aQuestion);
				lListeRetour.add(lFils);
			},
		);
		return lListeRetour;
	}
}
exports.ObjetSaisieQCM = ObjetSaisieQCM;
(function (ObjetSaisieQCM) {
	let TypeCallback;
	(function (TypeCallback) {
		TypeCallback["Selection"] = "selection";
		TypeCallback["DeplacerQuestion"] = "moveQuestion";
		TypeCallback["OuvrirEdition"] = "openEdition";
		TypeCallback["DupliquerQuestion"] = "dupliQuestion";
		TypeCallback["SupprimerQuestion"] = "delQuestion";
		TypeCallback["ModifierPonderation"] = "pondeQuestion";
		TypeCallback["AjouterQuestion"] = "ajoutQuestion";
		TypeCallback["CopierQuestion"] = "copieQuestion";
	})(
		(TypeCallback =
			ObjetSaisieQCM.TypeCallback || (ObjetSaisieQCM.TypeCallback = {})),
	);
})(ObjetSaisieQCM || (exports.ObjetSaisieQCM = ObjetSaisieQCM = {}));
