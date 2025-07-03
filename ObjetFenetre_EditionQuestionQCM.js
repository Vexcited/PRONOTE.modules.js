exports.ObjetFenetre_EditionQuestionQCM = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const TinyInit_1 = require("TinyInit");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const DonneesListe_ReponseAChoisir_1 = require("DonneesListe_ReponseAChoisir");
const DonneesListe_ReponseASaisir_1 = require("DonneesListe_ReponseASaisir");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetClass_1 = require("ObjetClass");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreExerciceDeQuestionnaire_1 = require("TypeGenreExerciceDeQuestionnaire");
const Enumere_Action_1 = require("Enumere_Action");
const TypeGenreAssociationQuestionQCM_1 = require("TypeGenreAssociationQuestionQCM");
const ObjetReponsesAssociationQCM_1 = require("ObjetReponsesAssociationQCM");
const UtilitaireTraitementImage_1 = require("UtilitaireTraitementImage");
const UtilitaireAudio_1 = require("UtilitaireAudio");
const TypeNote_1 = require("TypeNote");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetChaine_1 = require("ObjetChaine");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const ObjetStyle_1 = require("ObjetStyle");
class ObjetFenetre_EditionQuestionQCM extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idEditeurHTML = this.Nom + "_tiny";
		this.idZoneImage = this.Nom + "_ZoneImage";
		this.idZoneBoutonModif = this.Nom + "_ZoneBoutonModifier";
		this.idZoneBoutonApercu = this.Nom + "_ZoneBoutonApercu";
		this.idZoneSon = this.Nom + "_ZoneSon";
		this.idEditeurHTMLReponse = this.Nom + "_tinyReponse";
		this.idZoneLienExterne = this.Nom + "ZoneUrl";
		this.idLienExterne = this.Nom + "_url";
		this.idSpellValue = this.Nom + "_SpellValue";
		this.idSpellFeedB = this.Nom + "_SpellFeedB";
		this.dimensionsMaxResizeImages = { largeur: 320, hauteur: 240 };
		this.nbPointAutresQuestions = 0;
		this.avecMiseEnFormeReponses = false;
		this.hauteurEditeurTexte = 330;
		this.hauteurEditeur = 150;
		this.hauteurContenuDonneesListes = 30;
		this.hauteurListesReponses = 180;
		this.hauteurListesReponsesAssociation = 260;
		this.optionsFenetreEditionQuestion = {
			avecEvaluations: false,
			avecAffichageBareme: true,
			avecVerificationMatierePourEvaluations: false,
		};
	}
	setOptionsFenetreEditionQuestionQCM(aOptions) {
		$.extend(this.optionsFenetreEditionQuestion, aOptions);
	}
	construireInstances() {
		this.identListeReponseAChoisir = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListeReponseAChoisir,
			this.initialiserListeReponseAChoisir,
		);
		this.identListeReponseASaisir = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListeReponseASaisir,
			this.initialiserListeReponseASaisir,
		);
		this.identObjetReponsesAssociationQCM = this.add(
			ObjetReponsesAssociationQCM_1.ObjetReponsesAssociationQCM,
			this.evenementSurReponsesAssociation,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			txtIntitule: {
				getValue() {
					return aInstance.eltQuestion
						? aInstance.eltQuestion.getLibelle() || ""
						: "";
				},
				setValue(aValeur) {
					if (aInstance.eltQuestion) {
						aInstance.eltQuestion.setLibelle(aValeur);
						aInstance.setBoutonActif(1, true);
					}
				},
			},
			inputBareme: {
				getNote() {
					return new TypeNote_1.TypeNote(
						aInstance.eltQuestion ? aInstance.eltQuestion.note || 0 : 0,
					);
				},
				setNote(aValeur) {
					if (aValeur) {
						if (!aValeur.estUneNoteVide() && aInstance.eltQuestion) {
							aInstance.eltQuestion.note = aValeur.getValeur();
							aInstance.setBoutonActif(1, true);
						}
					}
				},
				getOptionsNote() {
					let lMinNote = GParametres.minBaremeQuestionQCM || 0;
					let lMaxNote = GParametres.maxBaremeQuestionQCM || 99;
					if (GParametres.maxNombrePointsQCM) {
						lMaxNote = Math.min(
							lMaxNote,
							GParametres.maxNombrePointsQCM - aInstance.nbPointAutresQuestions,
						);
					}
					return {
						avecVirgule: false,
						afficherAvecVirgule: false,
						hintSurErreur: true,
						avecAnnotation: false,
						sansNotePossible: false,
						min: lMinNote,
						max: lMaxNote,
					};
				},
				getDisabled() {
					return !aInstance.avecEditionBareme;
				},
			},
			radioQuestionObligatoire: {
				getValue(aEstObligatoire) {
					if (aInstance.eltQuestion) {
						return aEstObligatoire
							? !!aInstance.eltQuestion.estObligatoire
							: !aInstance.eltQuestion.estObligatoire;
					}
					return false;
				},
				setValue(aEstObligatoire) {
					if (aInstance.eltQuestion) {
						aInstance.eltQuestion.estObligatoire = !!aEstObligatoire;
						aInstance.setBoutonActif(1, true);
					}
				},
			},
			comboNiveau: {
				init(aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: "100%",
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.Tag_Niveau",
						),
					});
				},
				getDonnees(aDonnees) {
					if (!aDonnees) {
						const lListeNiveaux = new ObjetListeElements_1.ObjetListeElements();
						const lElement = new ObjetElement_1.ObjetElement("", 0, 0);
						lListeNiveaux.add(lElement);
						for (let i = 0; i < GParametres.maxNiveauQCM; i++) {
							const lValeur = i + 1;
							lListeNiveaux.add(
								new ObjetElement_1.ObjetElement("" + lValeur, lValeur, lValeur),
							);
						}
						return lListeNiveaux;
					}
				},
				getIndiceSelection(aInstanceCombo) {
					let lIndice = -1;
					if (
						aInstanceCombo.getListeElements() &&
						aInstance.eltQuestion &&
						aInstance.eltQuestion.niveauQuestion
					) {
						const lNiveauQuestion = aInstance.eltQuestion.niveauQuestion;
						lIndice = aInstanceCombo
							.getListeElements()
							.getIndiceParNumeroEtGenre(lNiveauQuestion, lNiveauQuestion);
					}
					return Math.max(lIndice, 0);
				},
				event(aParametres) {
					if (aParametres.estSelectionManuelle && aParametres.element) {
						if (aInstance.eltQuestion) {
							aInstance.eltQuestion.niveauQuestion =
								aParametres.element.getGenre();
							aInstance.setBoutonActif(1, true);
						}
					}
				},
			},
			txtIncorrectFeedback: {
				getValue() {
					return aInstance.eltQuestion &&
						aInstance.eltQuestion.incorrectFeedback
						? aInstance.eltQuestion.incorrectFeedback
						: "";
				},
				setValue(aValeur) {
					if (aInstance.eltQuestion) {
						aInstance.eltQuestion.incorrectFeedback = aValeur;
						aInstance.setBoutonActif(1, true);
					}
				},
			},
			chipsAudioMp3Question: {
				event() {
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
			getClassesIconeBtnUploadFichierQuestion(aEstFichierSon) {
				const lClasses = [];
				let lFichierEstPresent = false;
				if (aEstFichierSon) {
					lClasses.push("icon_volume_up");
					lFichierEstPresent =
						!!aInstance.eltQuestion && !!aInstance.eltQuestion.mp3;
				} else {
					lClasses.push("icon_picture");
					lFichierEstPresent =
						!!aInstance.eltQuestion && !!aInstance.eltQuestion.image;
				}
				if (lFichierEstPresent) {
					lClasses.push("mix-icon_remove", "i-red");
				} else {
					lClasses.push("mix-icon_plus", "i-green");
				}
				return lClasses.join(" ");
			},
			estVisibleBtnUploadFichierQuestion(aEstFichierSon, aEstBoutonAjout) {
				let lFichierEstPresent = false;
				if (aEstFichierSon) {
					lFichierEstPresent =
						!!aInstance.eltQuestion && !!aInstance.eltQuestion.mp3;
				} else {
					lFichierEstPresent =
						!!aInstance.eltQuestion && !!aInstance.eltQuestion.image;
				}
				return aEstBoutonAjout ? !lFichierEstPresent : lFichierEstPresent;
			},
			btnUploadFichierQuestion: {
				getOptionsSelecFile(aEstUploadSon) {
					return {
						accept: !aEstUploadSon
							? "image/*"
							: UtilitaireAudio_1.UtilitaireAudio.getTypeMimeAudio(),
						maxSize: aEstUploadSon ? 250 * 1024 : 0,
						avecResizeImage: true,
						largeurMaxImageResize: aInstance.dimensionsMaxResizeImages.largeur,
						hauteurMaxImageResize: aInstance.dimensionsMaxResizeImages.hauteur,
						avecTransformationFlux: false,
					};
				},
				addFiles(aEstUploadSon, aParamsSelecFile) {
					const lListeFichiers = aParamsSelecFile.listeFichiers;
					if (!!lListeFichiers) {
						const lThis = aInstance;
						lListeFichiers.parcourir((aFichier) => {
							const lNomFichier = aFichier.getLibelle();
							if (aFichier.file) {
								UtilitaireTraitementImage_1.UtilitaireTraitementImage.fileToDataUrlPromise(
									aFichier.file,
								).then((aB64ContenuCompletFichier) => {
									if (!!aB64ContenuCompletFichier) {
										const lB64ContenuFichier =
											aB64ContenuCompletFichier.split(",")[1];
										if (!aEstUploadSon) {
											lThis.eltQuestion.image = lB64ContenuFichier;
										} else {
											lThis.eltQuestion.mp3 = lB64ContenuFichier;
											lThis.eltQuestion.mp3name = lNomFichier || "";
										}
										lThis.$refreshSelf();
									}
								});
							}
						});
						aInstance.setBoutonActif(1, true);
					}
				},
				getTitle(aEstUploadSon) {
					const lCleTraduction = aEstUploadSon
						? "SaisieQCM.AjouterSon"
						: "SaisieQCM.AjouterImage";
					return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction);
				},
			},
			btnSupprimerFichierQuestion: {
				event(aEstFichierAudio) {
					if (aEstFichierAudio) {
						aInstance.eltQuestion.mp3 = "";
						aInstance.eltQuestion.mp3name = "";
					} else {
						aInstance.eltQuestion.image = "";
					}
					aInstance.setBoutonActif(1, true);
				},
				getTitle(aEstFichierAudio) {
					const lCleTraduction = aEstFichierAudio
						? "SaisieQCM.SupprimerSon"
						: "SaisieQCM.SupprimerImage";
					return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction);
				},
			},
			getHtmlChipsAudioFichierQuestion() {
				const H = [];
				if (aInstance.eltQuestion && aInstance.eltQuestion.mp3) {
					H.push(
						UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
							base64Audio: aInstance.eltQuestion.mp3,
							libelle: aInstance.eltQuestion.mp3name,
							ieModel: "chipsAudioMp3Question",
						}),
					);
				}
				return H.join("");
			},
			getHtmlImageFichierQuestion() {
				const H = [];
				if (aInstance.eltQuestion && aInstance.eltQuestion.image) {
					H.push(
						'<img alt="" src="data:image/png;base64,',
						ObjetChaine_1.GChaine.supprimerRC(aInstance.eltQuestion.image),
						'"',
						" onerror=\"$(this).parent().html(GTraductions.getValeur('ExecutionQCM.ImageNonSupportee'));\"",
						' onload="',
						aInstance.Nom,
						'.surFixerTaille()"',
						' style="width:100%;" />',
					);
				}
				return H.join("");
			},
			boutonApercu: {
				event() {
					aInstance.evenementBoutonApercu();
				},
			},
			cbCaseSensitive: {
				getValue() {
					return (
						!!aInstance.eltQuestion && !!aInstance.eltQuestion.casesensitive
					);
				},
				setValue(aValeur) {
					if (!!aInstance.eltQuestion) {
						aInstance.eltQuestion.casesensitive = aValeur;
						aInstance._actualiserListe();
						aInstance.setBoutonActif(1, true);
					}
				},
				estVisible() {
					let lEstVisible = false;
					if (!!aInstance.eltQuestion) {
						const lGenreQuestion = aInstance.eltQuestion.getGenre();
						lEstVisible =
							lGenreQuestion ===
								TypeGenreExerciceDeQuestionnaire_1
									.TypeGenreExerciceDeQuestionnaire.GEQ_ShortAnswer ||
							lGenreQuestion ===
								TypeGenreExerciceDeQuestionnaire_1
									.TypeGenreExerciceDeQuestionnaire.GEQ_SpellAnswer ||
							lGenreQuestion ===
								TypeGenreExerciceDeQuestionnaire_1
									.TypeGenreExerciceDeQuestionnaire.GEQ_ClozeField;
					}
					return lEstVisible;
				},
				getLibelle() {
					const lCleTraduction =
						!!aInstance.eltQuestion &&
						aInstance.eltQuestion.getGenre() ===
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_SpellAnswer
							? "SaisieQCM.ActiverCaseSensitiveEpellation"
							: "SaisieQCM.ActiverCaseSensitive";
					return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction);
				},
			},
			cbSaisieBonnesReponsesParPourcentage: {
				getValue() {
					const lUtilisationFractions = !!aInstance.eltQuestion
						? !!aInstance.eltQuestion.utiliseFractionsPourSaisie
						: false;
					return lUtilisationFractions;
				},
				setValue(aValeur) {
					if (!!aInstance.eltQuestion) {
						const lFnExecuteChangementBooleen = function (aAvecReset = false) {
							aInstance.eltQuestion.utiliseFractionsPourSaisie = aValeur;
							aInstance.actualiserColonnesCacheesListeReponsesAChoisir();
							const lInstanceListe = aInstance.getInstance(
								aInstance.identListeReponseAChoisir,
							);
							const lDonneesListe = lInstanceListe.getDonneesListe();
							lDonneesListe.setUtilisationFractionsPourSaisie(aValeur);
							lInstanceListe.actualiser();
							if (aAvecReset) {
								aInstance.setBoutonActif(1, true);
							}
						};
						if (
							!aValeur &&
							!aInstance._lesFractionsReponsesSontLesValeursParDefaut(
								aInstance.eltQuestion,
							)
						) {
							(0, AccessApp_1.getApp)()
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"SaisieQCM.ConfirmationDestructionPourcentageReponse",
									),
									callback: function (aBouton) {
										if (aBouton === Enumere_Action_1.EGenreAction.Valider) {
											lFnExecuteChangementBooleen(true);
										}
									},
								});
						} else {
							lFnExecuteChangementBooleen();
						}
					}
				},
			},
			btnMrFicheReglesPointsAttribues: {
				event() {
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({ idRessource: "SaisieQCM.MFichePointAttribueQCM" });
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getTitreMFiche(
						"SaisieQCM.MFichePointAttribueQCM",
					);
				},
			},
		});
	}
	surFixerTaille() {
		super.surFixerTaille();
		switch (this.eltQuestion.getGenre()) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SingleChoice:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_MultiChoice:
				this.getInstance(this.identListeReponseAChoisir).resize();
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ShortAnswer:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer:
				this.getInstance(this.identListeReponseASaisir).resize();
				break;
			default:
				break;
		}
	}
	composeBas() {
		const H = [];
		H.push('<div id="', this.idZoneBoutonApercu, '" class="InlineBlock">');
		H.push(
			'<ie-bouton ie-model="boutonApercu">',
			ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.ApercuQuestion"),
			"</ie-bouton>",
		);
		H.push("</div>");
		H.push('<div id="', this.idZoneBoutonModif, '" class="InlineBlock"></div>');
		return H.join("");
	}
	evenementBoutonApercu() {
		let lControle;
		if (!ObjetNavigateur_1.Navigateur.withContentEditable) {
			this.eltQuestion.enonce = ObjetHtml_1.GHtml.getValue(this.idEditeurHTML);
		} else {
			this.eltQuestion.enonce = TinyInit_1.TinyInit.get(
				this.idEditeurHTML,
			).getContent();
		}
		lControle = this.controlerPertinenceQuestionSaisie();
		if (lControle.ok) {
			this.callback.appel(100, this.eltQuestion);
		} else {
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: lControle.message,
				});
		}
	}
	majEtatEditeur() {
		const lJqDivModif = $("#" + this.idZoneBoutonModif.escapeJQ());
		const lJqInputUrl = $("#" + this.idLienExterne.escapeJQ());
		lJqDivModif.html("");
		this.getInstance(this.identListeReponseASaisir).setOptionsListe({
			nonEditable: false,
		});
		this.getInstance(this.identListeReponseAChoisir).setOptionsListe({
			nonEditable: false,
		});
		this.getInstance(this.identObjetReponsesAssociationQCM).setAvecEdition(
			true,
		);
		lJqInputUrl.prop("disabled", false);
		if (!ObjetNavigateur_1.Navigateur.withContentEditable) {
			$("#" + this.idEditeurHTML.escapeJQ()).prop("disabled", false);
		} else {
			$("#" + this.idEditeurHTML + "_toolbargroup")
				.parent()
				.parent()
				.css("display", "");
			TinyInit_1.TinyInit.get(this.idEditeurHTML)
				.getBody()
				.setAttribute("contenteditable", "true");
		}
		this.getInstance(this.identListeReponseASaisir).actualiser();
		this.getInstance(this.identListeReponseAChoisir).actualiser();
	}
	setDonnees(aParam) {
		this.eltQuestionOrigine = aParam.eltQuestion;
		this.eltQuestion = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.eltQuestion,
		);
		this.qcm = aParam.qcm;
		this.avecEditionBareme = aParam.avecEditionBareme !== false;
		this.nbPointAutresQuestions = aParam.nbPointAutresQuestions;
		if (!this.eltQuestion.listeReponses) {
			this.eltQuestion.listeReponses =
				new ObjetListeElements_1.ObjetListeElements();
		}
		this.actualiser();
		this.afficher();
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.TitreSaisieQuestion",
			).replace("%s", this.getStrTypeQuestion()),
		});
		$("#" + this.Nom.escapeJQ()).on(
			"keyup change",
			":text",
			{ aObjet: this },
			this._evntSurInputText,
		);
		$("#" + this.Nom.escapeJQ() + " textarea").change(
			{ aObjet: this },
			this._evntSurTextArea,
		);
		if (ObjetNavigateur_1.Navigateur.withContentEditable) {
			const lParametres = {
				button:
					this.eltQuestion.getGenre() ===
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_ClozeField
						? "iEMoodleShortAnswer"
						: this.eltQuestion.getGenre() ===
									TypeGenreExerciceDeQuestionnaire_1
										.TypeGenreExerciceDeQuestionnaire.GEQ_ClozeFixed ||
								this.eltQuestion.getGenre() ===
									TypeGenreExerciceDeQuestionnaire_1
										.TypeGenreExerciceDeQuestionnaire.GEQ_ClozeVariable
							? "iEMoodleMultiChoice"
							: "",
				oneList:
					this.eltQuestion.getGenre() ===
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_ClozeFixed,
				height:
					this.eltQuestion.getGenre() ===
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeField ||
					this.eltQuestion.getGenre() ===
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeFixed ||
					this.eltQuestion.getGenre() ===
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeVariable
						? this.hauteurEditeurTexte
						: this.hauteurEditeur,
				plugin:
					this.eltQuestion.getGenre() ===
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeField ||
					this.eltQuestion.getGenre() ===
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeFixed ||
					this.eltQuestion.getGenre() ===
						TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
							.GEQ_ClozeVariable
						? ",iEMoodle"
						: "",
			};
			const lThis = this;
			TinyInit_1.TinyInit.init({
				id: this.idEditeurHTML,
				min_height: lParametres.height,
				max_height: lParametres.height,
				height: lParametres.height,
				plugins: TinyInit_1.TinyInit.getPlugins() + lParametres.plugin,
				modeQCM: true,
				editeurEquation: true,
				editeurEquationMaxFileSize: 4096,
				buttons: [lParametres.button],
				iEMoodle: {
					options: {
						ShortAnswer: {
							withGrade: false,
							autoAdd: true,
							withUI: false,
							withValue: false,
							maxResponses: 1,
						},
						MultiChoice: {
							withGrade: false,
							oneList: lParametres.oneList,
							autoAdd: true,
							withUI: false,
							withValue: false,
							maxResponses: 999,
						},
					},
				},
				setup: function (ed) {
					ed.on("Change", () => {
						lThis.setBoutonActif(1, true);
					});
				},
			}).then(() => {
				this._actualiserListe();
				this.majEtatEditeur();
				ObjetPosition_1.GPosition.centrer(this.Nom);
				this.setOptionsFenetre({
					hauteurMin: ObjetPosition_1.GPosition.getHeight(this.Nom),
					largeurMin: ObjetPosition_1.GPosition.getWidth(this.Nom),
				});
				this.surFixerTaille();
			});
		} else {
			this.setOptionsFenetre({
				hauteurMin: ObjetPosition_1.GPosition.getHeight(this.Nom),
				largeurMin: ObjetPosition_1.GPosition.getWidth(this.Nom),
			});
			this.surFixerTaille();
		}
		this.avecMiseEnFormeReponses = false;
		if (this.eltQuestion.listeReponses) {
			for (const lReponse of this.eltQuestion.listeReponses) {
				if (lReponse.existe()) {
					if (lReponse.editionAvancee) {
						this.avecMiseEnFormeReponses = true;
						break;
					}
				}
			}
		}
		this.setBoutonVisible(0, true);
		this.setBoutonVisible(1, true);
		this.setBoutonActif(0, true);
		this.setBoutonActif(1, false);
	}
	ouvrirEditeurHTML(aIndexReponseEnEdition, aDescriptif) {
		const lThis = this;
		const lHauteurFenetre = 400;
		const lHauteurTiny = lHauteurFenetre - 160;
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: function (aNumeroBouton, aParams) {
					lThis.evenementSurEditeurHTML(
						aIndexReponseEnEdition,
						aNumeroBouton,
						aParams,
					);
				},
			},
			{
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.EditeurReponse",
				),
				largeur: 650,
				hauteur: lHauteurFenetre,
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
				addParametresValidation: () => {
					let lContent = "";
					if (!ObjetNavigateur_1.Navigateur.withContentEditable) {
						lContent = ObjetHtml_1.GHtml.getValue(this.idEditeurHTMLReponse);
					} else {
						lContent = TinyInit_1.TinyInit.get(
							this.idEditeurHTMLReponse,
						).getContent();
					}
					return { content: lContent };
				},
			},
		);
		const lHTML = [];
		if (!ObjetNavigateur_1.Navigateur.withContentEditable) {
			lHTML.push(
				'<textarea id="',
				this.idEditeurHTMLReponse,
				'" maxlength="0" class="Texte10" style="width:100%;height:100%"></textarea>',
			);
			lFenetre.afficher(lHTML.join(""));
			ObjetHtml_1.GHtml.setValue(this.idEditeurHTMLReponse, aDescriptif);
		} else {
			lHTML.push(
				'<div id="',
				this.idEditeurHTMLReponse,
				'" class="Texte10" style="width: 100%;"></div>',
			);
			lFenetre.afficher(lHTML.join(""));
			ObjetHtml_1.GHtml.setHtml(this.idEditeurHTMLReponse, aDescriptif);
			TinyInit_1.TinyInit.init({
				id: this.idEditeurHTMLReponse,
				height: lHauteurTiny,
				min_height: lHauteurTiny,
				max_height: lHauteurTiny,
				editeurEquation: true,
				editeurEquationMaxFileSize: 4096,
				setup: function (ed) {
					ed.on("Init", function () {
						this.focus();
					});
				},
			});
		}
	}
	evenementSurEditeurHTML(aIndexReponseEnEdition, aNumeroBouton, aParams) {
		if (aNumeroBouton === 1 && aIndexReponseEnEdition !== null) {
			if (aIndexReponseEnEdition === -1) {
				const lElementReponseCreation = ObjetElement_1.ObjetElement.create({
					fractionReponse: 0,
					feedback: "",
					image: "",
					libelleHtml: "",
					editionAvancee: true,
				});
				lElementReponseCreation.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				this.eltQuestion.listeReponses.addElement(lElementReponseCreation);
				aIndexReponseEnEdition = this.eltQuestion.listeReponses.count() - 1;
			}
			const lElement = this.eltQuestion.listeReponses.get(
				aIndexReponseEnEdition,
			);
			if (lElement) {
				lElement.libelleHtml = aParams.content;
				const lEtat = lElement.Etat;
				if (lEtat !== Enumere_Etat_1.EGenreEtat.Creation) {
					lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					lElement.Etat = Enumere_Etat_1.EGenreEtat.Modification;
				}
			}
			this._actualiserListe();
			this.setBoutonActif(1, true);
		}
		aIndexReponseEnEdition = null;
	}
	evenementSurListeReponseAChoisir(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir
						.colonnes.responseProposee:
						if (!!aParametres.article && aParametres.article.editionAvancee) {
							this.ouvrirEditeurHTML(
								aParametres.ligne,
								aParametres.article.libelleHtml,
							);
						}
						break;
					default:
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				if (
					aParametres.idColonne ===
						DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
							.responseProposee &&
					this.avecMiseEnFormeReponses
				) {
					this.ouvrirEditeurHTML(-1, "");
					return true;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this.setBoutonActif(1, true);
				break;
		}
	}
	evenementSurListeReponseASaisir(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this.setBoutonActif(1, true);
				break;
		}
	}
	evenementSurReponsesAssociation() {
		this.setBoutonActif(1, true);
	}
	_evntSurInputText(aEvent) {
		const lThis = aEvent.data.aObjet;
		const lName = $(this).attr("name");
		let lEtat;
		switch (lName) {
			case lThis.idSpellValue:
				if (
					!lThis.eltQuestion.listeReponses ||
					!lThis.eltQuestion.listeReponses.get(0)
				) {
					lThis.eltQuestion.listeReponses =
						new ObjetListeElements_1.ObjetListeElements();
					lThis.eltQuestion.listeReponses.addElement(
						new ObjetElement_1.ObjetElement(""),
					);
					lThis.eltQuestion.listeReponses.get(0).feedback = "";
					lThis.eltQuestion.listeReponses
						.get(0)
						.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				}
				lEtat = lThis.eltQuestion.listeReponses.get(0).Etat;
				lThis.eltQuestion.listeReponses.get(0).Libelle = $(this).val();
				lThis.eltQuestion.listeReponses
					.get(0)
					.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				if (lEtat !== Enumere_Etat_1.EGenreEtat.Creation) {
					lThis.eltQuestion.listeReponses.get(0).Etat =
						Enumere_Etat_1.EGenreEtat.Modification;
				}
				lThis.setBoutonActif(1, true);
				break;
			case lThis.idSpellFeedB:
				if (
					!lThis.eltQuestion.listeReponses ||
					!lThis.eltQuestion.listeReponses.get(0)
				) {
					lThis.eltQuestion.listeReponses =
						new ObjetListeElements_1.ObjetListeElements();
					lThis.eltQuestion.listeReponses.addElement(
						new ObjetElement_1.ObjetElement(""),
					);
					lThis.eltQuestion.listeReponses.get(0).feedback = "";
					lThis.eltQuestion.listeReponses
						.get(0)
						.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				}
				lEtat = lThis.eltQuestion.listeReponses.get(0).Etat;
				lThis.eltQuestion.listeReponses.get(0).feedback = $(this).val();
				lThis.eltQuestion.listeReponses
					.get(0)
					.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				if (lEtat !== Enumere_Etat_1.EGenreEtat.Creation) {
					lThis.eltQuestion.listeReponses.get(0).Etat =
						Enumere_Etat_1.EGenreEtat.Modification;
				}
				lThis.setBoutonActif(1, true);
				break;
		}
	}
	_evntSurTextArea(aEvent) {
		const lThis = aEvent.data.aObjet;
		lThis.eltQuestion.enonce = $(this).val();
	}
	composeContenu() {
		const T = [];
		if (this.eltQuestion) {
			const lAvecAffichageBareme =
				this.optionsFenetreEditionQuestion.avecAffichageBareme;
			T.push(
				'<div class="MargeBas flex-contain flex-center" style="gap:0.5rem;">',
			);
			const lIdIntitule = GUID_1.GUID.getId() + "_intitule";
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ id: lIdIntitule },
						ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Intitule"),
					),
					IE.jsx.str(
						"div",
						{ style: "flex-grow:1;" },
						IE.jsx.str("input", {
							type: "text",
							"ie-model": "txtIntitule",
							style: "width: 100%;",
							"aria-labelledby": lIdIntitule,
						}),
					),
				),
			);
			const lWidthBaremeEtNiveau = 40;
			if (lAvecAffichageBareme) {
				const lIdBareme = GUID_1.GUID.getId() + "_bareme";
				T.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							{ id: lIdBareme },
							ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Bareme"),
						),
						IE.jsx.str(
							"div",
							{ style: "width:" + lWidthBaremeEtNiveau + "px;" },
							IE.jsx.str("ie-inputnote", {
								"ie-model": "inputBareme",
								style: "width: 100%;",
								"aria-labelledby": lIdBareme,
							}),
						),
					),
				);
			}
			T.push("</div>");
			T.push(
				'<div class="MargeBas flex-contain flex-center" style="gap:0.5rem;">',
			);
			T.push(
				"<div>",
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Nature"),
				"</div>",
			);
			T.push(
				'<div style="flex-grow:1;gap:0.5rem;" class="flex-contain flex-center">',
				'<ie-radio ie-model="radioQuestionObligatoire(true)">',
				ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.Nature_Obligatoire",
				),
				"</ie-radio>",
				'<ie-radio ie-model="radioQuestionObligatoire(false)">',
				ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.Nature_Facultative",
				),
				"</ie-radio>",
				"</div>",
			);
			T.push(
				"<div>",
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Tag_Niveau"),
				"</div>",
			);
			T.push(
				'<div style="width:',
				lWidthBaremeEtNiveau,
				'px;">',
				'<ie-combo ie-model="comboNiveau" style="width:100%;">',
				"</div>",
			);
			T.push("</div>");
			T.push(this.composeEnonce());
			T.push(this.composeReponses());
		}
		return T.join("");
	}
	composeEnonce() {
		const T = [];
		const lStrInfoEnonce = this.getStrInfoEnonce();
		if (!!lStrInfoEnonce) {
			T.push('<div class="Espace">', lStrInfoEnonce, "</div>");
		}
		T.push(
			'<fieldset class="',
			ObjetClass_1.GClass.getZone(),
			'" style="position:relative;border-color:' +
				(0, AccessApp_1.getApp)().getCouleur().fenetre.texte +
				';">',
			'<legend class="',
			ObjetClass_1.GClass.getLegende(),
			'" style="color:' +
				(0, AccessApp_1.getApp)().getCouleur().fenetre.texte +
				';"> ',
			ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Enonce"),
			"</legend>",
		);
		if (!ObjetNavigateur_1.Navigateur.withContentEditable) {
			T.push(
				'<textarea id="' +
					this.idEditeurHTML +
					'" maxlength="0"  style="width:100%;height:50px;background-color:' +
					(0, AccessApp_1.getApp)().getCouleur().blanc +
					';">',
				this.eltQuestion.enonce,
				"</textarea>",
			);
		} else {
			T.push(
				'<div id="' +
					this.idEditeurHTML +
					'" class="Texte10 full-width is-tiny" style="height:50px;background-color:' +
					(0, AccessApp_1.getApp)().getCouleur().blanc +
					';">',
				this.eltQuestion.enonce,
				"</div>",
			);
		}
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{
						id: this.idZoneSon,
						class: "Espace",
						style: "position:relative;overflow:hidden;",
					},
					IE.jsx.str(
						"div",
						{ class: "flex-contain" },
						IE.jsx.str("ie-btnicon", {
							"ie-class": "getClassesIconeBtnUploadFichierQuestion(true)",
							"ie-display": "estVisibleBtnUploadFichierQuestion(true, true)",
							"ie-selecfile": true,
							"ie-model": "btnUploadFichierQuestion(true)",
						}),
						IE.jsx.str("ie-btnicon", {
							"ie-class": "getClassesIconeBtnUploadFichierQuestion(true)",
							"ie-display": "estVisibleBtnUploadFichierQuestion(true, false)",
							"ie-model": "btnSupprimerFichierQuestion(true)",
						}),
						IE.jsx.str("div", {
							class: "m-left",
							"ie-html": "getHtmlChipsAudioFichierQuestion",
						}),
					),
				),
				IE.jsx.str(
					"div",
					{
						id: this.idZoneImage,
						class: "Espace",
						style: "position:relative;",
					},
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str("ie-btnicon", {
							"ie-class": "getClassesIconeBtnUploadFichierQuestion(false)",
							"ie-display": "estVisibleBtnUploadFichierQuestion(false, true)",
							"ie-selecfile": true,
							"ie-model": "btnUploadFichierQuestion(false)",
						}),
						IE.jsx.str("ie-btnicon", {
							"ie-class": "getClassesIconeBtnUploadFichierQuestion(false)",
							"ie-display": "estVisibleBtnUploadFichierQuestion(false, false)",
							"ie-model": "btnSupprimerFichierQuestion(false)",
						}),
						IE.jsx.str("div", {
							class: "m-left InlineBlock",
							style: "max-width:12rem;",
							"ie-html": "getHtmlImageFichierQuestion",
						}),
					),
				),
				IE.jsx.str(
					"div",
					{
						id: this.idZoneLienExterne,
						class: "Espace",
						style: "position:relative;overflow:hidden;",
					},
					IE.jsx.str("i", {
						class: "icon_globe AlignementMilieuVertical",
						style: "font-size: 1.6rem; color: var(--theme-foncee);",
						role: "presentation",
						"aria-hidden": "true",
					}),
					IE.jsx.str("input", {
						type: "text",
						id: this.idLienExterne,
						class: "AlignementMilieuVertical AvecMain m-left",
						"ie-model": this.jsxModelInputLienExterne.bind(this),
						style: "width:95%;",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.SiteInternet",
						),
					}),
				),
			),
		);
		T.push("</fieldset>");
		return T.join("");
	}
	jsxModelInputLienExterne() {
		return {
			getValue: () => {
				return this.eltQuestion.url;
			},
			setValue: (aValue) => {
				this.eltQuestion.url = aValue;
				this.setBoutonActif(1, true);
			},
		};
	}
	composeReponses() {
		const T = [];
		switch (this.eltQuestion.getGenre()) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SingleChoice:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_MultiChoice:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ShortAnswer:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer:
				T.push(
					'<fieldset class="',
					ObjetClass_1.GClass.getZone(),
					'" style="position:relative;border-color:' +
						(0, AccessApp_1.getApp)().getCouleur().fenetre.texte +
						';">',
					'<legend class="',
					ObjetClass_1.GClass.getLegende(),
					'" style="color:' +
						(0, AccessApp_1.getApp)().getCouleur().fenetre.texte +
						';"> ',
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.ReponsesProposees",
					),
					"</legend>",
				);
				break;
		}
		const lInfoRep = this.getStrInfoReponse(this.eltQuestion.getGenre());
		if (lInfoRep !== "") {
			T.push('<div class="EspaceHaut EspaceBas10">', lInfoRep, "</div>");
		}
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ "ie-display": "cbCaseSensitive.estVisible" },
					IE.jsx.str("ie-checkbox", { "ie-model": "cbCaseSensitive" }),
				),
			),
		);
		switch (this.eltQuestion.getGenre()) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SingleChoice:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_MultiChoice:
				T.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							{ class: "flex-contain", style: "gap: 0.5rem;" },
							IE.jsx.str(
								"ie-checkbox",
								{ "ie-model": "cbSaisieBonnesReponsesParPourcentage" },
								ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.SaisirPourcentagePourReponse",
								),
							),
							IE.jsx.str(
								"span",
								null,
								UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
									"btnMrFicheReglesPointsAttribues",
								),
							),
						),
						IE.jsx.str("div", {
							id: this.getInstance(this.identListeReponseAChoisir).getNom(),
							style:
								"width: 100%; height: " + this.hauteurListesReponses + "px;",
						}),
					),
				);
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ShortAnswer: {
				const lId = GUID_1.GUID.getId();
				T.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str("div", {
							id: this.getNomInstance(this.identListeReponseASaisir),
							style: "width: 100%;height:" + this.hauteurListesReponses + "px;",
						}),
						IE.jsx.str(
							"div",
							{
								class: "MargeHaut flex-contain flex-center",
								style: "gap:0.5rem;",
							},
							IE.jsx.str(
								"span",
								{ id: lId },
								ObjetTraduction_1.GTraductions.getValeur(
									"QCM_Divers.CommentaireMauvaiseReponse",
								),
							),
							IE.jsx.str("input", {
								"aria-labelledby": lId,
								type: "text",
								"ie-model": "txtIncorrectFeedback",
								class: "fluid-bloc",
							}),
						),
					),
				);
				break;
			}
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching:
				T.push(
					'<div id="',
					this.getNomInstance(this.identObjetReponsesAssociationQCM),
					'" style="height:',
					this.hauteurListesReponsesAssociation,
					'px;"></div>',
				);
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer:
				T.push('<div style="width:100%;" class="Texte10">');
				T.push('<div class="InlineBlock AlignementDroit EspaceDroit">');
				T.push(
					'<label for="',
					this.idSpellValue,
					'" style="padding:4px 0px;height:14px;display:inline-block;margin-bottom:2px;">',
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.ReponseAEpeler"),
					"</label><br />",
				);
				T.push(
					'<label for="',
					this.idSpellFeedB,
					'" style="padding:4px 0px;height:14px;display:inline-block;">',
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.CommentaireFacultatif",
					),
					"</label>",
				);
				T.push("</div>");
				T.push(
					'<div class="InlineBlock AlignementDroit EspaceDroit" style="width:60%;">',
				);
				T.push(
					'<input type="text" id="',
					this.idSpellValue,
					'" name="',
					this.idSpellValue,
					'" style="width:100%;margin-bottom:2px;',
					ObjetStyle_1.GStyle.composeWidth(210),
					'" class="CelluleTexte Texte10 AvecMain" maxLength="30" /><br />',
				);
				T.push(
					'<input type="text" id="',
					this.idSpellFeedB,
					'" name="',
					this.idSpellFeedB,
					'" style="width:100%;" class="CelluleTexte Texte10 AvecMain" />',
				);
				T.push("</div>");
				T.push("</div>");
				break;
		}
		switch (this.eltQuestion.getGenre()) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SingleChoice:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_MultiChoice:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ShortAnswer:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer:
				T.push("</fieldset>");
				break;
			default:
				T.push("");
				break;
		}
		return T.join("");
	}
	actualiserColonnesCacheesListeReponsesAChoisir() {
		const lColonnesCachees = [];
		if (!!this.eltQuestion && !this.eltQuestion.utiliseFractionsPourSaisie) {
			lColonnesCachees.push(
				DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
					.pourcentagePointPos,
			);
			lColonnesCachees.push(
				DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
					.pourcentagePointNeg,
			);
		}
		const lInstanceListe = this.getInstance(this.identListeReponseAChoisir);
		lInstanceListe.setOptionsListe({ colonnesCachees: lColonnesCachees });
	}
	_actualiserListe() {
		const lListeReponses = this.eltQuestion.listeReponses;
		switch (this.eltQuestion.getGenre()) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SingleChoice:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_MultiChoice: {
				const lThis = this;
				this.actualiserColonnesCacheesListeReponsesAChoisir();
				this.getInstance(this.identListeReponseAChoisir).setDonnees(
					new DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir(
						lListeReponses,
						{
							callbackMenuContextuel:
								this.evntMenuContextListeReponses.bind(this),
							hauteurMinCellule: this.hauteurContenuDonneesListes,
							avecUneBonneReponseUnique:
								this.eltQuestion.getGenre() ===
								TypeGenreExerciceDeQuestionnaire_1
									.TypeGenreExerciceDeQuestionnaire.GEQ_SingleChoice,
							avecUtilisationFractionsPourSaisie:
								!!this.eltQuestion.utiliseFractionsPourSaisie,
							dimensionsMaxResizeImages: this.dimensionsMaxResizeImages,
							callbackSelectionInputFile: function (
								aParamCellule,
								aListeFichiers,
							) {
								if (!!aListeFichiers) {
									aListeFichiers.parcourir((aFichier) => {
										UtilitaireTraitementImage_1.UtilitaireTraitementImage.fileToDataUrlPromise(
											aFichier.file,
										).then((aB64ContenuCompletFichier) => {
											if (!!aB64ContenuCompletFichier) {
												const lB64ContenuFichier =
													aB64ContenuCompletFichier.split(",")[1];
												const lArticle = aParamCellule.article;
												if (!!lArticle) {
													const lEtat = lArticle.Etat;
													lArticle.image = lB64ContenuFichier;
													lArticle.setEtat(
														Enumere_Etat_1.EGenreEtat.Modification,
													);
													if (lEtat !== Enumere_Etat_1.EGenreEtat.Creation) {
														lArticle.Etat =
															Enumere_Etat_1.EGenreEtat.Modification;
													}
													lThis
														.getInstance(lThis.identListeReponseAChoisir)
														.actualiser(true);
													lThis.setBoutonActif(1, true);
												}
											}
										});
									});
								}
							},
						},
					),
				);
				break;
			}
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ShortAnswer:
				this.getInstance(this.identListeReponseASaisir).setDonnees(
					new DonneesListe_ReponseASaisir_1.DonneesListe_ReponseASaisir(
						lListeReponses,
						this.eltQuestion.getGenre(),
						this.eltQuestion.getGenre() !==
							TypeGenreExerciceDeQuestionnaire_1
								.TypeGenreExerciceDeQuestionnaire.GEQ_NumericalAnswer &&
							this.eltQuestion.casesensitive,
						this.hauteurContenuDonneesListes,
					),
				);
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching:
				this.getInstance(this.identObjetReponsesAssociationQCM).setDonnees(
					lListeReponses,
				);
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer: {
				const lReponse = this.eltQuestion.listeReponses.get(0);
				let lLibelle = "";
				let lFeedback = "";
				if (lReponse) {
					lLibelle = ObjetChaine_1.GChaine.enleverEntites(
						lReponse.getLibelle(),
					);
					lFeedback = ObjetChaine_1.GChaine.enleverEntites(lReponse.feedback);
				}
				$("#" + this.idSpellValue.escapeJQ()).val(lLibelle);
				$("#" + this.idSpellFeedB.escapeJQ()).val(lFeedback);
				break;
			}
			default:
				break;
		}
	}
	evntMenuContextListeReponses(aCommande) {
		switch (aCommande) {
			case DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir
				.GenreCommandeDonneesListeReponseAChoisir.SuppressionImage: {
				this.setBoutonActif(1, true);
				break;
			}
		}
	}
	getStrInfoEnonce() {
		let lInfo = "";
		switch (this.eltQuestion.getGenre()) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeField:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeFixed:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeVariable:
				lInfo +=
					'<span class="Gras">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.InfoPreCreationTrou",
					) +
					"</span>" +
					ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.InfoSelectClic") +
					'<span class="InlineBlock ImageBoutonTrouQCM">&nbsp;</span>' +
					"<br />";
				if (
					this.eltQuestion.getGenre() ===
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_ClozeVariable
				) {
					lInfo +=
						'<span class="Gras">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.InfoPreEditerTrou",
						) +
						"</span>" +
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.InfoCadrePointilleClic",
						) +
						'<span class="InlineBlock ImageBoutonTrouQCM">&nbsp;</span>' +
						"<br />";
					lInfo +=
						'<span class="Gras">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.InfoPreSuppressionTrou",
						) +
						"</span>" +
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.InfoEditionSupprimer",
						) +
						"<br />";
				} else {
					lInfo +=
						'<span class="Gras">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.InfoPreSuppressionTrou",
						) +
						"</span>" +
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.InfoCadrePointilleClic",
						) +
						'<span class="InlineBlock ImageBoutonTrouQCM">&nbsp;</span>' +
						"<br />";
				}
				break;
		}
		return lInfo;
	}
	getStrTypeQuestion() {
		switch (this.eltQuestion.getGenre()) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SingleChoice:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceChoixUnique",
				);
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_MultiChoice:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceChoixMultiple",
				);
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceReponseNumerique",
				);
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ShortAnswer:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceReponseASaisir",
				);
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceEpellation",
				);
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceAssociation",
				);
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeField:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceClozeField",
				);
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeFixed:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceClozeFixed",
				);
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeVariable:
				return ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.GenreExerciceClozeVariable",
				);
		}
		return "";
	}
	controlerPertinenceQuestionSaisie() {
		let lNbReponses = this.eltQuestion.listeReponses
			? this.eltQuestion.listeReponses.getNbrElementsExistes()
			: 0;
		if (
			this.eltQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeField ||
			this.eltQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeFixed ||
			this.eltQuestion.getGenre() ===
				TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
					.GEQ_ClozeVariable
		) {
			const lTrous = this.eltQuestion.enonce.match(
				/{[0-9]*:(ShortAnswer|MultiChoice):(~*(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)+}/gi,
			);
			if (lTrous && lTrous.length) {
				if (
					this.eltQuestion.getGenre() ===
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_ClozeFixed
				) {
					lNbReponses = lTrous[0].match(
						/((multichoice:|shortanswer:|~)(%[0-9]{1,3}%|=)?[^~%#{}]+#?[^~%#{}]*)/gi,
					).length;
				} else {
					lNbReponses = lTrous.length;
				}
			}
		}
		switch (this.eltQuestion.getGenre()) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SingleChoice:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_MultiChoice: {
				if (lNbReponses < 2) {
					return {
						ok: false,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.AuMoinsDeuxPropositions",
						),
					};
				}
				const lEstChoixMultiples =
					this.eltQuestion.getGenre() ===
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_MultiChoice;
				const lTotalFractionReponsesPos =
					this.getTotalFractionReponsesPositives(this.eltQuestion);
				const lEstFractionParDefaut = this.getEstFractionParDefaut(
					this.eltQuestion,
				);
				const lTotalFractionReponsesNeg =
					this.getTotalFractionReponsesNegatives(this.eltQuestion);
				if (lTotalFractionReponsesPos === 0) {
					return {
						ok: false,
						message: !lEstChoixMultiples
							? ObjetTraduction_1.GTraductions.getValeur(
									"QCM_Divers.IlManqueLaBonneReponse",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"QCM_Divers.AuMoinsUneBonneReponse",
								),
					};
				} else {
					if (lEstChoixMultiples) {
						if (!!this.eltQuestion.utiliseFractionsPourSaisie) {
							if (lTotalFractionReponsesPos !== 100 && !lEstFractionParDefaut) {
								return {
									ok: false,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"QCM_Divers.LaSommeDesPourcentagesPosDoitEtre100",
									),
								};
							} else if (
								lEstChoixMultiples &&
								lTotalFractionReponsesNeg < -100
							) {
								return {
									ok: false,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"QCM_Divers.LaSommeDesPourcentagesNegDoitPasEtreInfA100",
									),
								};
							}
						}
					} else {
						const lContientUneReponseACent = this._existeUneReponseACent(
							this.eltQuestion,
						);
						if (!lContientUneReponseACent) {
							return {
								ok: false,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"QCM_Divers.AuMoinsUneBonneReponseDoitEtre100",
								),
							};
						}
					}
				}
				break;
			}
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeFixed:
				if (lNbReponses < 2) {
					return {
						ok: false,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.AuMoinsDeuxTrous",
						),
					};
				}
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ShortAnswer:
				if (lNbReponses === 0) {
					return {
						ok: false,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.AuMoinsUneReponse",
						),
					};
				}
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeVariable:
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ClozeField:
				if (lNbReponses === 0) {
					return {
						ok: false,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.AuMoinsUnTrou",
						),
					};
				}
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching:
				if (lNbReponses < 2) {
					return {
						ok: false,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.AuMoinsDeuxAssociations",
						),
					};
				} else if (this._existeReponsesAssociationsVides(this.eltQuestion)) {
					return {
						ok: false,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.ErreurReponsesVides",
						),
					};
				}
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer:
				if (lNbReponses !== 1) {
					return {
						ok: false,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.AuMoinsUneReponse",
						),
					};
				}
				break;
		}
		return { ok: true, message: "" };
	}
	surValidation(aNumeroBouton) {
		let lControle;
		if (aNumeroBouton > 0) {
			if (!ObjetNavigateur_1.Navigateur.withContentEditable) {
				this.eltQuestion.enonce = ObjetHtml_1.GHtml.getValue(
					this.idEditeurHTML,
				);
			} else {
				this.eltQuestion.enonce = TinyInit_1.TinyInit.get(
					this.idEditeurHTML,
				).getContent();
			}
			lControle = this.controlerPertinenceQuestionSaisie();
		} else {
			lControle = { ok: true, message: "" };
		}
		if (lControle.ok) {
			this.fermer();
			this.callback.appel(
				aNumeroBouton,
				aNumeroBouton > 0 ? this.eltQuestion : this.eltQuestionOrigine,
			);
		} else {
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: lControle.message,
				});
		}
	}
	initialiserListeReponseAChoisir(aInstance) {
		const lThis = this;
		const lControleurListeReponsesAChoisir = aInstance.controleur;
		lControleurListeReponsesAChoisir.nodeColonneCoche = function () {
			let lHintColonne = ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.HintBonneReponseSingle",
			);
			if (
				lThis.eltQuestion &&
				lThis.eltQuestion.getGenre() !==
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_SingleChoice
			) {
				lHintColonne = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.HintBonnesReponsesMulti",
				);
			}
			$(this.node).attr("title", lHintColonne);
		};
		lControleurListeReponsesAChoisir.cbAvecMiseEnFormeReponses = {
			getValue() {
				return !!lThis.avecMiseEnFormeReponses;
			},
			setValue(aAvecMiseEnForme) {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieQCM.EditionAvanceePerteDonnee",
						),
					})
					.then((aGenreAction) => {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							lThis.avecMiseEnFormeReponses = aAvecMiseEnForme;
							const lListeReponses = !!lThis.eltQuestion
								? lThis.eltQuestion.listeReponses
								: null;
							if (!!lListeReponses) {
								for (let i = 0; i < lListeReponses.count(); i++) {
									const lElementReponse = lListeReponses.get(i);
									if (lElementReponse.existe()) {
										lElementReponse.editionAvancee =
											lThis.avecMiseEnFormeReponses;
										if (lThis.avecMiseEnFormeReponses === false) {
											lElementReponse.Libelle =
												lElementReponse.libelleHtml.replace(/<[^>]*?>/gi, "");
										} else {
											lElementReponse.libelleHtml = lElementReponse.Libelle;
										}
										const lEtatReponse = lElementReponse.Etat;
										lElementReponse.setEtat(
											Enumere_Etat_1.EGenreEtat.Modification,
										);
										if (lEtatReponse !== Enumere_Etat_1.EGenreEtat.Creation) {
											lElementReponse.Etat =
												Enumere_Etat_1.EGenreEtat.Modification;
										}
									}
								}
							}
							lThis._actualiserListe();
						}
					});
			},
		};
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
				.coche,
			titre: {
				ignorerOverflowHidden: true,
				libelleHtml:
					'<div ie-node="nodeColonneCoche" class="Image_CocheVerte as-icon" style="margin:0 auto;"></div>',
			},
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
				.pourcentagePointPos,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.PourcentagePoints",
					),
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.PourcentagePositifs",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.HintPourcentagePositifs",
					),
				},
			],
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
				.pourcentagePointNeg,
			titre: [
				TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.PourcentageNegatifs",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.HintPourcentageNegatifs",
					),
				},
			],
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
				.responseProposee,
			titre: {
				libelleHtml: IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "flex-contain flex-gap flex-center justify-center" },
						IE.jsx.str(
							"span",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"QCM_Divers.ReponsesProposees",
							),
						),
						IE.jsx.str(
							"ie-checkbox",
							{ class: "m-left-l", "ie-model": "cbAvecMiseEnFormeReponses" },
							ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.AvecMiseEnForme",
							),
						),
					),
				),
			},
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.HintReponsesProposees",
			),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
				.image,
			titre: {
				libelleHtml: IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "flex-contain flex-center justify-center" },
						IE.jsx.str(
							"span",
							null,
							ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Image"),
						),
						IE.jsx.str("span", {
							class: "Image_QCM_ImagePourListe InlineBlock m-left-l",
						}),
					),
				),
			},
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.HintMediaReponses",
			),
			taille: 75,
		});
		lColonnes.push({
			id: DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
				.commentaire,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.CommentaireFacultatif",
				),
				nbLignes: 2,
			},
			hint: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.HintFeedback"),
			taille: 150,
		});
		const lOptions = {
			avecListeNeutre: true,
			colonnes: lColonnes,
			listeCreations: [
				DonneesListe_ReponseAChoisir_1.DonneesListe_ReponseAChoisir.colonnes
					.responseProposee,
			],
			avecLigneCreation: true,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.LigneNouvelleReponse",
			),
		};
		if (this.hauteurContenuDonneesListes > 0) {
			$.extend(lOptions, {
				hauteurCelluleTitreStandard: this.hauteurContenuDonneesListes,
				hauteurZoneContenuListeMin: this.hauteurContenuDonneesListes,
			});
		}
		aInstance.setOptionsListe(lOptions);
	}
	initialiserListeReponseASaisir(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ReponseASaisir_1.DonneesListe_ReponseASaisir.colonnes
				.responsePossible,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.BonnesReponsesPossibles",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.HintReponsesShortAnswer",
			),
			taille: "50%",
		});
		lColonnes.push({
			id: DonneesListe_ReponseASaisir_1.DonneesListe_ReponseASaisir.colonnes
				.commentaire,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.CommentaireFacultatif",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.HintFeedback"),
			taille: "50%",
		});
		const lOptions = {
			avecListeNeutre: true,
			colonnes: lColonnes,
			listeCreations: [
				DonneesListe_ReponseASaisir_1.DonneesListe_ReponseASaisir.colonnes
					.responsePossible,
			],
			avecLigneCreation: true,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"QCM_Divers.LigneBonneReponse",
			),
		};
		if (this.hauteurContenuDonneesListes > 0) {
			$.extend(lOptions, {
				hauteurCelluleTitreStandard: this.hauteurContenuDonneesListes,
				hauteurZoneContenuListeMin: this.hauteurContenuDonneesListes,
			});
		}
		aInstance.setOptionsListe(lOptions);
	}
	_lesFractionsReponsesSontLesValeursParDefaut(aQuestion) {
		let lSontValeursParDefaut = true;
		if (!!aQuestion && !!aQuestion.listeReponses) {
			aQuestion.listeReponses.parcourir((aReponse) => {
				if (!!aReponse && aReponse.existe()) {
					if (aReponse.fractionReponse < 0) {
						lSontValeursParDefaut = false;
						return false;
					}
				}
			});
			if (lSontValeursParDefaut) {
				const lEstBonneReponseUnique =
					aQuestion.getGenre() ===
					TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
						.GEQ_SingleChoice;
				if (lEstBonneReponseUnique) {
					let lContientUneReponseA100 = false;
					aQuestion.listeReponses.parcourir((aReponse) => {
						if (!!aReponse && aReponse.existe()) {
							if (aReponse.fractionReponse === 100) {
								if (lContientUneReponseA100) {
									lSontValeursParDefaut = false;
									return false;
								} else {
									lContientUneReponseA100 = true;
								}
							} else if (aReponse.fractionReponse > 0) {
								lSontValeursParDefaut = false;
								return false;
							}
						}
					});
				} else {
					const lListeReponsesAFractionPositive =
						aQuestion.listeReponses.getListeElements((aReponse) => {
							return (
								!!aReponse && aReponse.existe() && aReponse.fractionReponse > 0
							);
						});
					const lNbReponsesAFractionPositive =
						lListeReponsesAFractionPositive.count();
					if (lNbReponsesAFractionPositive > 0) {
						const lFractionParDefaut = Math.round(
							100 / lNbReponsesAFractionPositive,
						);
						const lValeurAjustement =
							100 - lFractionParDefaut * lNbReponsesAFractionPositive;
						let lValeurAjustementAjoutee = false;
						lListeReponsesAFractionPositive.parcourir((aReponse) => {
							let lFractionParDefautAjustee = lFractionParDefaut;
							if (!lValeurAjustementAjoutee) {
								lFractionParDefautAjustee += lValeurAjustement;
								lValeurAjustementAjoutee = true;
							}
							if (aReponse.fractionReponse !== lFractionParDefautAjustee) {
								lSontValeursParDefaut = false;
								return false;
							}
						});
					} else {
						lSontValeursParDefaut = false;
					}
				}
			}
		}
		return lSontValeursParDefaut;
	}
	_getTotalFractionReponsesPosOuNeg(aQuestion, aRecherchePositives) {
		let lTotalFraction = 0;
		if (!!aQuestion && !!aQuestion.listeReponses) {
			aQuestion.listeReponses.parcourir((aReponse) => {
				if (!!aReponse && aReponse.existe()) {
					if (aRecherchePositives && aReponse.fractionReponse > 0) {
						lTotalFraction += aReponse.fractionReponse;
					} else if (!aRecherchePositives && aReponse.fractionReponse < 0) {
						lTotalFraction += aReponse.fractionReponse;
					}
				}
			});
		}
		return lTotalFraction;
	}
	getTotalFractionReponsesPositives(aQuestion) {
		return this._getTotalFractionReponsesPosOuNeg(aQuestion, true);
	}
	getTotalFractionReponsesNegatives(aQuestion) {
		return this._getTotalFractionReponsesPosOuNeg(aQuestion, false);
	}
	getEstFractionParDefaut(aQuestion) {
		let lResult = true;
		if (!!aQuestion && !!aQuestion.listeReponses) {
			let lNbBonnesReponses = 0;
			aQuestion.listeReponses.parcourir((aReponse) => {
				if (aReponse.fractionReponse > 0) {
					lNbBonnesReponses++;
				}
			});
			const lFractionReponseEquitable = Math.floor(100 / lNbBonnesReponses);
			aQuestion.listeReponses.parcourir((aReponse) => {
				if (!!aReponse && aReponse.existe()) {
					if (
						aReponse.fractionReponse > 0 &&
						aReponse.fractionReponse !== lFractionReponseEquitable
					) {
						lResult = false;
						return false;
					}
				}
			});
		}
		return lResult;
	}
	_existeUneReponseACent(aQuestion) {
		let lExisteUneReponseACent = false;
		if (!!aQuestion && !!aQuestion.listeReponses) {
			aQuestion.listeReponses.parcourir((aReponse) => {
				if (!!aReponse && aReponse.existe()) {
					lExisteUneReponseACent = aReponse.fractionReponse === 100;
					if (lExisteUneReponseACent) {
						return false;
					}
				}
			});
		}
		return lExisteUneReponseACent;
	}
	_existeReponsesAssociationsVides(aQuestion) {
		let lExisteReponsesVides = false;
		if (!!aQuestion && !!aQuestion.listeReponses) {
			const lFnElementAssociationEstVide = function (aElemAssociation) {
				let lEstSaisie = false;
				if (!!aElemAssociation) {
					if (
						aElemAssociation.getGenre() ===
							TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
								.GEA_Texte &&
						!!aElemAssociation.strTexte
					) {
						lEstSaisie = true;
					} else if (
						aElemAssociation.getGenre() ===
							TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
								.GEA_Image &&
						!!aElemAssociation.strImage
					) {
						lEstSaisie = true;
					} else if (
						aElemAssociation.getGenre() ===
							TypeGenreAssociationQuestionQCM_1.TypeGenreElementAssociation
								.GEA_Son &&
						!!aElemAssociation.strSon
					) {
						lEstSaisie = true;
					}
				}
				return !lEstSaisie;
			};
			aQuestion.listeReponses.parcourir((aReponse) => {
				if (!!aReponse && aReponse.existe()) {
					if (
						lFnElementAssociationEstVide(aReponse.associationA) ||
						lFnElementAssociationEstVide(aReponse.associationB)
					) {
						lExisteReponsesVides = true;
						return false;
					}
				}
			});
		}
		return lExisteReponsesVides;
	}
	getStrInfoReponse(aGenreQuestion) {
		let lChaine = "";
		let lAvecIconeAttention = true;
		switch (aGenreQuestion) {
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_NumericalAnswer:
				lChaine = ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.InfoReponseReponseCourte2",
				);
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_ShortAnswer:
				lChaine = ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.InfoReponseReponseCourte2",
				);
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_SpellAnswer:
				lChaine = ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.InfoReponseEpellation",
				);
				break;
			case TypeGenreExerciceDeQuestionnaire_1.TypeGenreExerciceDeQuestionnaire
				.GEQ_Matching:
				lChaine = ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.InfoReponseAssociation",
				);
				lAvecIconeAttention = false;
				break;
		}
		const lStrInfoReponse = [];
		if (lChaine !== "") {
			if (lAvecIconeAttention) {
				lStrInfoReponse.push(
					'<span class="InlineBlock Image_Attention AlignementMilieuVertical EspaceGauche EspaceDroit" style="margin-left:0;">&nbsp;</span>',
				);
			}
			lStrInfoReponse.push(
				'<span class="AlignementMilieuVertical">',
				lChaine,
				"</span>",
			);
		}
		return lStrInfoReponse.join("");
	}
}
exports.ObjetFenetre_EditionQuestionQCM = ObjetFenetre_EditionQuestionQCM;
