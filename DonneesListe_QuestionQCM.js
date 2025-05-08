exports.DonneesListe_QuestionQCM = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const MethodesObjet_1 = require("MethodesObjet");
const UtilitaireAudio_1 = require("UtilitaireAudio");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetHtml_1 = require("ObjetHtml");
const TypeGenreExerciceDeQuestionnaire_1 = require("TypeGenreExerciceDeQuestionnaire");
class DonneesListe_QuestionQCM extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.typeNumerotationQCM = aParams.typeNumerotationQCM;
		this.evenementMenuContext = aParams.evenementMenuContext;
		this.ajoutItemsTypeQuestion = aParams.ajoutItemsTypeQuestion;
		this.ajouterALaSelection = aParams.ajouterALaSelection;
		this.surDeplacementLigne = aParams.surDeplacementLigne;
		this.optionsListeQuestionQCM = Object.assign(
			{
				avecEdition: false,
				avecGestionBareme: false,
				envoieVers: false,
				nombreQuestionsSoumises: null,
			},
			aParams.optionsListeQuestionQCM,
		);
		this.setOptions({
			avecEvnt_SelectionClick: true,
			avecLigneDroppable: this.optionsListeQuestionQCM.avecEdition,
		});
	}
	getControleur(aInstance, aListe) {
		return $.extend(true, super.getControleur(aInstance, aListe), {
			chipsAudio: {
				event() {
					const lElemAudioConcerne = $(this.node).find("audio")[0];
					if (!lElemAudioConcerne) {
						return;
					}
					if (
						UtilitaireAudio_1.UtilitaireAudio.estEnCoursDeLecture(
							lElemAudioConcerne,
						)
					) {
						UtilitaireAudio_1.UtilitaireAudio.stopAudio(lElemAudioConcerne);
						return;
					}
					try {
						const lTousLesElementsAudios = $(
							"#" + aListe.getNom().escapeJQ(),
						).find("audio");
						for (let i = 0; i < lTousLesElementsAudios.length; i++) {
							const lElemAudio = lTousLesElementsAudios.get(i);
							if (lElemAudio !== lElemAudioConcerne) {
								UtilitaireAudio_1.UtilitaireAudio.stopAudio(lElemAudio);
							}
						}
						UtilitaireAudio_1.UtilitaireAudio.jouerAudio(lElemAudioConcerne);
					} catch (error) {
						if (
							error ===
							UtilitaireAudio_1.UtilitaireAudio.ExceptionFichierNonValide
						) {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"ExecutionQCM.FichierSonNonValide",
								),
							});
						}
					}
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
			preventDefault() {
				$(this.node)
					.find("input")
					.on("click change", (aEvent) => {
						aEvent.preventDefault();
						aEvent.stopImmediatePropagation();
						return false;
					});
			},
		});
	}
	avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
		var _a;
		return !(
			((_a = aParamsCellule.article.pere) === null || _a === void 0
				? void 0
				: _a.getNumero()) === aParamsCellulePrec.article.getNumero()
		);
	}
	getTitreZonePrincipale(aParams) {
		if (aParams.article.estUnDeploiement) {
			return super.getTitreZonePrincipale(aParams);
		}
		return "";
	}
	getInfosSuppZonePrincipale(aParams) {
		var _a, _b;
		if (
			aParams.article.estUnDeploiement &&
			!aParams.article.estDeploye &&
			((_b =
				(_a = aParams.article) === null || _a === void 0
					? void 0
					: _a.enonce) === null || _b === void 0
				? void 0
				: _b.length)
		) {
			const lEnonceAvecBaliseHtml = UtilitaireQCM_1.UtilitaireQCM.composeEnonce(
				aParams.article,
			);
			const lDOMAvecEnonce = ObjetHtml_1.GHtml.htmlToDOM(lEnonceAvecBaliseHtml);
			const lEnonceSansBaliseHtml = ObjetHtml_1.GHtml.getTextesDeNode(
				lDOMAvecEnonce,
			)
				.join("")
				.trim()
				.ajouterEntites();
			return IE.jsx.str("div", { "ie-ellipsis": true }, lEnonceSansBaliseHtml);
		}
		return IE.jsx.str("div", null);
	}
	estCocheSelonFilsSurLigneDeploiement(aArticle) {
		return false;
	}
	getZoneComplementaire(aParams) {
		var _a;
		if (!aParams.article.estUnDeploiement) {
			return "";
		}
		const lAvecInfosCompetences =
			this.optionsListeQuestionQCM.avecAffichageInfosCompetences &&
			!!((_a = aParams.article) === null || _a === void 0
				? void 0
				: _a.infoCompetences);
		return IE.jsx.str(
			"div",
			{ class: ["flex-contain", "cols", "flex-gap"] },
			this.composeNumeroationQuestion(aParams),
			this.optionsListeQuestionQCM.avecGestionBareme &&
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur("QCM.BaremePts", [
						aParams.article.note,
					]),
				),
			lAvecInfosCompetences &&
				IE.jsx.str("p", null, aParams.article.infoCompetences),
		);
	}
	composeNumeroationQuestion(aParams) {
		const lNumeroQuestion = aParams.article.indice + 1;
		return IE.jsx.str(
			"p",
			null,
			IE.jsx.str(
				"span",
				null,
				ObjetTraduction_1.GTraductions.getValeur("QCM.QuestionLibelle"),
			),
			" ",
			IE.jsx.str(
				"span",
				null,
				UtilitaireQCM_1.UtilitaireQCM.composeNumerotation(
					this.typeNumerotationQCM,
					lNumeroQuestion,
				),
			),
		);
	}
	avecCB(aParams) {
		return aParams.article.estUnDeploiement && this.options.avecCB;
	}
	avecBoutonActionLigne(aParams) {
		return (
			aParams.article.estUnDeploiement && this.avecCommandeDansMenuContextuel()
		);
	}
	evenementMenuContextuel(aParams) {
		this.ajouterALaSelection(
			new ObjetListeElements_1.ObjetListeElements().add(aParams.article),
		);
		this.evenementMenuContext(aParams.ligneMenu);
		return false;
	}
	getIconeGaucheContenuFormate(aParams) {
		if (!aParams.article.estUnDeploiement) {
			return "";
		}
		const lGenre = aParams.article.getGenre();
		if (MethodesObjet_1.MethodesObjet.isNumber(lGenre)) {
			return TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaireUtil.getClasseImage(
				lGenre,
			);
		}
		return "";
	}
	autoriserDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		if (!aParamsSource.article) {
			return;
		}
		const lEstDeplacementPereSurFils =
			aParamsLigneDestination.article.pere &&
			aParamsLigneDestination.article.pere.getNumero() ===
				aParamsSource.article.getNumero();
		const lEstDeplacementFilsSurPere =
			aParamsSource.article.pere &&
			aParamsSource.article.pere.getNumero() ===
				aParamsLigneDestination.article.getNumero();
		return (
			super.autoriserDeplacementElementSurLigne(
				aParamsLigneDestination,
				aParamsSource,
			) &&
			!lEstDeplacementPereSurFils &&
			!lEstDeplacementFilsSurPere
		);
	}
	getZoneMessage(aParams) {
		var _a, _b, _c, _d, _e, _f;
		if (aParams.article.estUnDeploiement) {
			return "";
		}
		const lEnonce = UtilitaireQCM_1.UtilitaireQCM.composeEnonce(
			aParams.article,
		);
		const lQuestion = aParams.article;
		const lAvecInfosCompetences =
			this.optionsListeQuestionQCM.avecAffichageInfosCompetences &&
			!!(lQuestion === null || lQuestion === void 0
				? void 0
				: lQuestion.infoCompetences);
		return IE.jsx.str(
			"section",
			{
				class: [
					"flex-contain",
					"cols",
					"flex-gap-l",
					"white-space-initial",
					"m-top-l",
					"question",
				],
			},
			lEnonce && IE.jsx.str("article", { class: "tiny-view" }, lEnonce),
			((_a =
				lQuestion === null || lQuestion === void 0
					? void 0
					: lQuestion.image) === null || _a === void 0
				? void 0
				: _a.length) > 0 &&
				IE.jsx.str(
					"article",
					null,
					IE.jsx.str("img", {
						alt: "",
						src: `data:image/png;base64,${lQuestion.image}`,
						onerror:
							"$(this).parent().html(GTraductions.getValeur(\\'ExecutionQCM.ImageNonSupportee\\'));",
					}),
				),
			((_b =
				lQuestion === null || lQuestion === void 0
					? void 0
					: lQuestion.mp3name) === null || _b === void 0
				? void 0
				: _b.length) > 0 &&
				((_c =
					lQuestion === null || lQuestion === void 0
						? void 0
						: lQuestion.mp3) === null || _c === void 0
					? void 0
					: _c.length) > 0 &&
				IE.jsx.str(
					"article",
					null,
					UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
						base64Audio: lQuestion.mp3,
						libelle: lQuestion.mp3name,
						idChips: this.getIdBaliseAudio(aParams.article.getNumero()),
						ieModel: "chipsAudio",
						argsIEModel: [lQuestion.getNumero()],
					}),
				),
			((_d =
				lQuestion === null || lQuestion === void 0 ? void 0 : lQuestion.url) ===
				null || _d === void 0
				? void 0
				: _d.length) > 0 &&
				IE.jsx.str(
					"article",
					null,
					IE.jsx.str(
						"ie-chips",
						{ class: "iconic icon_globe", href: lQuestion.url },
						lQuestion.url,
					),
				),
			IE.jsx.str(
				"article",
				{
					"ie-node": "preventDefault",
					class: "cursor-default PageCorrigeQuestion",
				},
				UtilitaireQCM_1.UtilitaireQCM.composeReponsesCorrigeesDeQuestion(
					lQuestion,
					aParams.article.indice,
					{ ieModelAudio: "chipsAudio" },
				),
			),
			lQuestion.editeur &&
				lQuestion.editeur.existeNumero() &&
				IE.jsx.str(
					"article",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.CopyRightEditeur2013",
						[lQuestion.editeur.getLibelle()],
					),
				),
			lAvecInfosCompetences &&
				((_f =
					(_e =
						lQuestion === null || lQuestion === void 0
							? void 0
							: lQuestion.listeEvaluations) === null || _e === void 0
						? void 0
						: _e.count) === null || _f === void 0
					? void 0
					: _f.call(_e)) > 0 &&
				IE.jsx.str(
					"article",
					{ class: [lAvecInfosCompetences && "ctn-droite"] },
					IE.jsx.str(
						"ul",
						{ class: ["listeEvaluations"] },
						lQuestion.listeEvaluations.getTableau((aCompetence) => {
							var _a;
							const lCodeCompetences =
								aCompetence === null || aCompetence === void 0
									? void 0
									: aCompetence.codeAvecPrefixe;
							return IE.jsx.str(
								"li",
								null,
								(_a =
									aCompetence === null || aCompetence === void 0
										? void 0
										: aCompetence.getLibelle) === null || _a === void 0
									? void 0
									: _a.call(aCompetence),
								" ",
								(lCodeCompetences === null || lCodeCompetences === void 0
									? void 0
									: lCodeCompetences.length) > 0 &&
									IE.jsx.str(IE.jsx.fragment, null, "[", lCodeCompetences, "]"),
							);
						}),
					),
				),
		);
	}
	surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		this.surDeplacementLigne(aParamsLigneDestination, aParamsSource);
	}
	getLibelleDraggable(aParams) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			this.getTitreZonePrincipale(aParams) ||
				this.composeNumeroationQuestion(aParams),
		);
	}
	avecLigneDraggable(aParams) {
		return (
			aParams.article.estUnDeploiement &&
			this.optionsListeQuestionQCM.avecEdition
		);
	}
	initialisationObjetContextuel(aParams) {
		if (this.optionsListeQuestionQCM.avecEdition) {
			aParams.menuContextuel.addCommande(
				DonneesListe_QuestionQCM.GenreCommandeMenuContextuel.Modifier,
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.UpdateQuestion"),
				true,
				{ indiceElement: aParams.article.indice },
			);
			if (this.optionsListeQuestionQCM.avecGestionBareme) {
				aParams.menuContextuel.addCommande(
					DonneesListe_QuestionQCM.GenreCommandeMenuContextuel
						.ModifierPonderation,
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.UpdateBareme"),
					this.optionsListeQuestionQCM.nombreQuestionsSoumises === 0,
				);
			}
			aParams.menuContextuel.addSeparateur();
			aParams.menuContextuel.addSousMenu(
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.NouvelleQuestion"),
				(aInstanceSousMenu) => {
					this.ajoutItemsTypeQuestion(aInstanceSousMenu);
				},
			);
			aParams.menuContextuel.addSeparateur();
			aParams.menuContextuel.addCommande(
				DonneesListe_QuestionQCM.GenreCommandeMenuContextuel.Dupliquer,
				ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.DuplicateQuestion",
				),
				true,
			);
			aParams.menuContextuel.addCommande(
				DonneesListe_QuestionQCM.GenreCommandeMenuContextuel.Supprimer,
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.DeleteQuestion"),
				true,
			);
			aParams.menuContextuel.addSeparateur();
			aParams.menuContextuel.addCommande(
				DonneesListe_QuestionQCM.GenreCommandeMenuContextuel.SavoirPlus,
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.EnSavoirPlus"),
				true,
			);
		}
		if (this.optionsListeQuestionQCM.envoieVers) {
			aParams.menuContextuel.addCommande(
				DonneesListe_QuestionQCM.GenreCommandeMenuContextuel.CopierQuestion,
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.CopierQuestion"),
				true,
			);
		}
		aParams.menuContextuel.setDonnees();
	}
	getIdBaliseAudio(aNumeroQuestion) {
		return `audio-${aNumeroQuestion}`;
	}
	avecCommandeDansMenuContextuel() {
		return (
			this.optionsListeQuestionQCM.avecEdition ||
			this.optionsListeQuestionQCM.envoieVers
		);
	}
}
exports.DonneesListe_QuestionQCM = DonneesListe_QuestionQCM;
(function (DonneesListe_QuestionQCM) {
	let GenreCommandeMenuContextuel;
	(function (GenreCommandeMenuContextuel) {
		GenreCommandeMenuContextuel[(GenreCommandeMenuContextuel["Modifier"] = 0)] =
			"Modifier";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Dupliquer"] = 1)
		] = "Dupliquer";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Supprimer"] = 2)
		] = "Supprimer";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_SingleChoice"] = 3)
		] = "Ajout_GEQ_SingleChoice";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_MultiChoice"] = 4)
		] = "Ajout_GEQ_MultiChoice";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_ShortAnswer"] = 5)
		] = "Ajout_GEQ_ShortAnswer";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_Matching"] = 6)
		] = "Ajout_GEQ_Matching";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_ClozeField"] = 7)
		] = "Ajout_GEQ_ClozeField";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_ClozeFixed"] = 8)
		] = "Ajout_GEQ_ClozeFixed";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_ClozeVariable"] = 9)
		] = "Ajout_GEQ_ClozeVariable";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["ModifierPonderation"] = 10)
		] = "ModifierPonderation";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["SavoirPlus"] = 11)
		] = "SavoirPlus";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["CopierQuestion"] = 12)
		] = "CopierQuestion";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_NumericalAnswer"] = 15)
		] = "Ajout_GEQ_NumericalAnswer";
		GenreCommandeMenuContextuel[
			(GenreCommandeMenuContextuel["Ajout_GEQ_SpellAnswer"] = 16)
		] = "Ajout_GEQ_SpellAnswer";
	})(
		(GenreCommandeMenuContextuel =
			DonneesListe_QuestionQCM.GenreCommandeMenuContextuel ||
			(DonneesListe_QuestionQCM.GenreCommandeMenuContextuel = {})),
	);
})(
	DonneesListe_QuestionQCM ||
		(exports.DonneesListe_QuestionQCM = DonneesListe_QuestionQCM = {}),
);
