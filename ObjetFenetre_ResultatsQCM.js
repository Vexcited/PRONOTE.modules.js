exports.ObjetFenetre_ResultatsQCM = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_ResultatsQCM_1 = require("DonneesListe_ResultatsQCM");
const TypeQualificatifReponse_1 = require("TypeQualificatifReponse");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const TypeNote_1 = require("TypeNote");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Enumere_Etat_1 = require("Enumere_Etat");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const TypeHttpSaisieResultatQCM_1 = require("TypeHttpSaisieResultatQCM");
const ObjetRequeteSaisieQCMResultat_1 = require("ObjetRequeteSaisieQCMResultat");
const AccessApp_1 = require("AccessApp");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class ObjetRequeteSaisieQCMQuestionNote extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieQCMQuestionNote",
	ObjetRequeteSaisieQCMQuestionNote,
);
class ObjetFenetre_ResultatsQCM extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idLegende = GUID_1.GUID.getId();
		this.setOptions({
			avecOptionPDFCopie: false,
			avecRectificationNotePossible: false,
			avecPersonnalisationProjetAccompagnement: false,
		});
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.SaisieResultats",
			),
			largeur: ObjetNavigateur_1.Navigateur.clientL - 76,
			hauteur: ObjetNavigateur_1.Navigateur.clientH - 80,
			avecTailleSelonContenu: true,
		});
		this.cacheInfoCoursExecution = [];
	}
	construireInstances() {
		this.idResultatsQCM = this.add(
			ObjetListe_1.ObjetListe,
			this.evntSurListeResultats,
		);
	}
	composeContenu() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "flex-contain cols full-size" },
				IE.jsx.str("div", {
					id: this.getNomInstance(this.idResultatsQCM),
					class: "p-all fluid-bloc",
				}),
				IE.jsx.str(
					"div",
					{ id: this.idLegende, class: "p-all fix-bloc" },
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.nbPointsRectifiesManuellement",
					),
				),
			),
		);
	}
	evntSurListeResultats(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				if (
					aParametres.avecModification &&
					aParametres.article &&
					aParametres.article.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
				) {
					const lThis = this;
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.messageMajDevoir",
							),
							controleur: {},
							callback: function (aParametres, aGenreAction) {
								const lAvecMajDevoir =
									aGenreAction === Enumere_Action_1.EGenreAction.Valider;
								lThis.validerQCMQuestionNote(aParametres, lAvecMajDevoir);
							}.bind(this, aParametres),
						});
				}
				break;
		}
	}
	retourSurNavigation(aParam) {
		switch (aParam.action) {
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.supprimerReponse:
				new ObjetRequeteSaisieQCMResultat_1.ObjetRequeteSaisieQCMResultat(this)
					.lancerRequete({
						typeSaisieQCMResultat:
							TypeHttpSaisieResultatQCM_1.TypeHttpSaisieResultatQCM
								.HttpSaisieResultatQCM_SupprimerLesReponsesDesEleves,
						execution: aParam.element,
						eleves: aParam.eleves,
					})
					.then((aJSON) => {
						aParam.JSON = aJSON;
						this.callback.appel(aParam);
					});
				break;
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.recommencerTaf:
				this.surRecommencerTAF(aParam);
				break;
			case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.genreCommande
				.recommencerDevoir: {
				const lParamFenetre = {
					typeSaisieQCMResultat:
						TypeHttpSaisieResultatQCM_1.TypeHttpSaisieResultatQCM
							.HttpSaisieResultatQCM_AnnulerLeDevoirDesEleves,
					execution: aParam.element,
					eleves: aParam.eleves,
				};
				this.ouvrirFenetreSaisieQCMResultat(aParam, lParamFenetre);
				break;
			}
			default:
				this.callback.appel(aParam);
				break;
		}
	}
	setDonnees(aDonneesResultatsQCM) {
		this.donneesQCM = aDonneesResultatsQCM;
		this.afficher();
		if (this.donneesQCM.message) {
			this.optionsFenetre.titre = ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.SaisieResultats",
			);
			this.getInstance(this.idResultatsQCM).effacer(this.donneesQCM.message);
			ObjetHtml_1.GHtml.setDisplay(this.idLegende, false);
		} else {
			this.optionsFenetre.titre = "<span>";
			this.optionsFenetre.titre += ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.SaisieResultats",
			);
			this.optionsFenetre.titre += " : " + this.donneesQCM.QCM.getLibelle();
			if (this.donneesQCM.elementRacine && this.donneesQCM.estUneExecutionQCM) {
				const lIcon = UtilitaireQCM_1.UtilitaireQCM.getIconeTypeExecutionQCM(
					this.donneesQCM.elementRacine,
				);
				this.optionsFenetre.titre +=
					" (" +
					'<i role="presentation" class="' +
					lIcon +
					'"></i><span class="m-left">' +
					this.donneesQCM.elementRacine.getLibelle() +
					'</span><span class="m-left">' +
					this.donneesQCM.elementRacine.nomPublic +
					"</span>)";
			}
			this.optionsFenetre.titre += "</span>";
			const lAvecPointsRectifies = this.verifierSiPointsRectifies(
				this.donneesQCM.listeEleves,
			);
			ObjetHtml_1.GHtml.setDisplay(this.idLegende, lAvecPointsRectifies);
			this.initialiserListe(this.getInstance(this.idResultatsQCM));
			this.getInstance(this.idResultatsQCM).setDonnees(
				new DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM(
					this.donneesQCM,
					{
						avecOptionPdf: this.options.avecOptionPDFCopie,
						avecRectificationNotePossible:
							this.options.avecRectificationNotePossible,
						callback: this.retourSurNavigation.bind(this),
					},
				),
			);
		}
		this.positionnerFenetre();
	}
	verifierSiPointsRectifies(aListeEleves) {
		let lResult = false;
		if (!!aListeEleves) {
			for (let i = 0; i < aListeEleves.count() && !lResult; i++) {
				const lEleve = aListeEleves.get(i);
				if (!!lEleve.listeReponses) {
					for (let j = 0; j < lEleve.listeReponses.count() && !lResult; j++) {
						const lReponse = lEleve.listeReponses.get(j);
						if (lReponse.estAnnotee) {
							lResult = true;
						}
					}
				}
			}
		}
		return lResult;
	}
	initialiserListe(aInstance) {
		const lOptions = this.donneesQCM;
		const lColonnes = [];
		let lTitleHtml = [];
		let lColonnesFixes = 0;
		lTitleHtml.push('<div class="Espace">');
		lTitleHtml.push(
			'<div class="AlignementDroit">',
			ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.questions", [
				lOptions.QCM.nbQuestionsTotal,
			]),
			"</div>",
		);
		lTitleHtml.push(
			'<div class="AlignementGauche">',
			ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.eleves", [
				lOptions.valeurs.nbEleves || 0,
			]),
			"</div>",
		);
		lTitleHtml.push("</div>");
		lColonnesFixes++;
		lColonnes.push({
			id: DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.colonnes.eleve,
			titre: { libelleHtml: lTitleHtml.join("") },
			taille: 120,
		});
		if (lOptions.avecAffichage.classe) {
			lTitleHtml = [];
			lTitleHtml.push(
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.classes"),
			);
			lColonnesFixes++;
			lColonnes.push({
				id: DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.colonnes
					.classe,
				titre: lTitleHtml.join(""),
				taille: 80,
			});
		}
		if (lOptions.avecAffichage.tentatives) {
			lColonnesFixes++;
			lColonnes.push({
				id: DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.colonnes
					.tentatives,
				titre: {
					libelle:
						ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.tentatives.Nbr",
						) +
						" " +
						ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.tentatives.Exe",
						),
					nbLignes: 2,
					title: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.tentatives.title",
					),
				},
				taille: 50,
			});
		}
		if (lOptions.avecAffichage.noteQCM) {
			const lAvecColonneNote2 = !!lOptions.avecAffichage.note2QCM;
			const lTitreSurColonne = [];
			if (lOptions.modeSansNote) {
				lTitreSurColonne.push(
					'<div title="',
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.nbReponsesOK"),
					'">',
					this.getImagePastille(
						TypeQualificatifReponse_1.TypeQualificatifReponse.qrBonne,
						{ taillePx: 15 },
					),
					"</div>",
				);
			} else {
				const lClassCSSAffichage = lAvecColonneNote2
					? "InlineBlock p-right"
					: "";
				lTitreSurColonne.push(
					`<div class="${lClassCSSAffichage}">`,
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.notes"),
					"</div>",
					`<div class="${lClassCSSAffichage}">`,
					ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.pts"),
						[lOptions.valeurs.nbTotalPts],
					),
					"</div>",
				);
			}
			let lTitreColonne1;
			if (lAvecColonneNote2) {
				lTitreColonne1 = [];
				lTitreColonne1.push({ libelleHtml: lTitreSurColonne.join("") });
				lTitreColonne1.push({
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.notesPrecedentes",
					),
				});
			} else {
				lTitreColonne1 = { libelleHtml: lTitreSurColonne.join("") };
			}
			lColonnesFixes++;
			lColonnes.push({
				id: DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.colonnes
					.note1,
				titre: lTitreColonne1,
				taille: 50,
			});
			if (lAvecColonneNote2) {
				const lTitreColonne2 = [];
				lTitreColonne2.push({
					libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				});
				lTitreColonne2.push({
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.notesDernieres",
					),
				});
				lColonnesFixes++;
				lColonnes.push({
					id: DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.colonnes
						.note2,
					titre: lTitreColonne2,
					taille: 50,
				});
			}
		}
		let lStrDetailTemps;
		if (!!lOptions.valeurs.dureeMax) {
			lStrDetailTemps = ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.Xmin"),
				[
					UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
						lOptions.valeurs.dureeMax,
					),
				],
			);
		} else {
			lStrDetailTemps =
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.min");
		}
		lTitleHtml = [];
		lTitleHtml.push(
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.temps"),
			"</div>",
			"<div>",
			lStrDetailTemps,
			"</div>",
		);
		lColonnesFixes++;
		lColonnes.push({
			id: DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.colonnes.duree,
			titre: { libelleHtml: lTitleHtml.join("") },
			taille: 60,
		});
		if (lOptions.avecAffichage.ressenti) {
			const lTitleHtml = [];
			lTitleHtml.push(
				'<div class="Image_QCM_DrapeauRessenti" title="',
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.ressenti"),
				'">&nbsp;</div>',
			);
			lColonnesFixes++;
			lColonnes.push({
				id: DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.colonnes
					.ressenti,
				titre: { libelleHtml: lTitleHtml.join("") },
				taille: 20,
			});
		}
		const lAvecAffichageNbPoints =
			!!aInstance.options.avecGestionBaremeSurQuestion;
		let lIndice = 1;
		lOptions.listeQuestions.parcourir((aQuestion) => {
			const lTitleHtml = [];
			lTitleHtml.push('<div id="', lOptions.idQuest, lIndice, '">');
			lTitleHtml.push(
				ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.quest"),
				lIndice,
			);
			if (lAvecAffichageNbPoints) {
				lTitleHtml.push("<br />");
				lTitleHtml.push(
					ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.xPts"),
						[aQuestion.ptsQuest],
					),
				);
			}
			lTitleHtml.push("</div>");
			lColonnes.push({
				id:
					DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.colonnes
						.question +
					"_" +
					lIndice,
				rangColonne: lIndice,
				titre: {
					libelleHtml: lTitleHtml.join(""),
					titleHtml: this.getHintQuestion(lIndice - 1, lAvecAffichageNbPoints),
				},
				taille: 40,
			});
			lIndice++;
		});
		aInstance.setOptionsListe({
			hauteurAdapteContenu: true,
			scrollHorizontal: lColonnesFixes,
			alternanceCouleurLigneContenu: true,
			colonnes: lColonnes,
		});
	}
	getImagePastille(aQualificatif, aOptionsAffichage) {
		const lOptionsAffichage = Object.assign(
			{
				taillePx: 10,
				couleurBonne: "green",
				couleurPartielle: "orange",
				couleurFausse: "red",
			},
			aOptionsAffichage,
		);
		let lCouleurValeurReponse;
		if (
			aQualificatif ===
			TypeQualificatifReponse_1.TypeQualificatifReponse.qrBonne
		) {
			lCouleurValeurReponse = lOptionsAffichage.couleurBonne;
		} else if (
			aQualificatif ===
			TypeQualificatifReponse_1.TypeQualificatifReponse.qrBonnePartielle
		) {
			lCouleurValeurReponse = lOptionsAffichage.couleurPartielle;
		} else if (
			aQualificatif ===
			TypeQualificatifReponse_1.TypeQualificatifReponse.qrFausse
		) {
			lCouleurValeurReponse = lOptionsAffichage.couleurFausse;
		}
		const lResult = [];
		if (!!lCouleurValeurReponse) {
			lResult.push(
				'<span class="InlineBlock" style="width: ',
				lOptionsAffichage.taillePx,
				"px; height: ",
				lOptionsAffichage.taillePx,
				"px; vertical-align: middle; background-color: ",
				lCouleurValeurReponse,
				';">&nbsp;</span>',
			);
		}
		return lResult.join("");
	}
	getHintQuestion(aNumeroQuestion, aAvecAffichageNbPoints = true) {
		const lQCM = this.donneesQCM.QCM;
		if (lQCM && lQCM.contenuQCM) {
			const lQuestion = lQCM.contenuQCM.listeQuestions.get(aNumeroQuestion);
			const lTypeNumerotationQCM =
				lQCM.typeNumerotation !== undefined
					? lQCM.typeNumerotation
					: lQCM.contenuQCM.typeNumerotation;
			const lHtml = UtilitaireQCM_1.UtilitaireQCM.composeHintDeQuestionQCM(
				this,
				aNumeroQuestion,
				lQuestion,
				{
					avecAffichageInfosCompetences: true,
					typeNumerotationQCM: lTypeNumerotationQCM,
					avecAffichageBareme: !!aAvecAffichageNbPoints,
				},
			);
			return $("<div>" + lHtml + "</div>").html();
		} else {
			return "";
		}
	}
	validerQCMQuestionNote(aParametres, aAvecMajDevoir) {
		const lReponse = this.getReponse(
			aParametres.article,
			aParametres.declarationColonne.rangColonne - 1,
		);
		if (!!lReponse) {
			const lObjetSaisie = {
				execution: aParametres.article.execution,
				eleve: aParametres.article,
				reponse: lReponse.toJSON(),
			};
			lObjetSaisie.reponse.note = new TypeNote_1.TypeNote(lReponse.note);
			lObjetSaisie.reponse.majDevoir = aAvecMajDevoir;
			new ObjetRequeteSaisieQCMQuestionNote(this)
				.lancerRequete(lObjetSaisie)
				.then((aParams) => {
					if (
						aParams &&
						aParams.genreReponse ===
							ObjetRequeteJSON_1.EGenreReponseSaisie.succes
					) {
						if (aParams.JSONReponse && aParams.JSONReponse.eleve) {
							aParametres.article.note = aParams.JSONReponse.eleve.note;
							let lOk = false;
							if (!!aParams.JSONReponse.eleve.listeReponses) {
								for (
									let i = 0;
									i < aParams.JSONReponse.eleve.listeReponses.count() && !lOk;
									i++
								) {
									const lReponsex =
										aParams.JSONReponse.eleve.listeReponses.get(i);
									if (
										lReponsex &&
										lReponsex.getNumero() === lReponse.getNumero()
									) {
										lReponse.note = lReponsex.note;
										lReponse.estAnnotee = lReponsex.estAnnotee;
										lReponse.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
										lOk = true;
									}
								}
							}
							aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
							this.getInstance(this.idResultatsQCM).actualiser();
						}
					}
				});
		} else {
		}
	}
	getReponse(aEleve, aIndexQuestion) {
		let lResult = null;
		if (
			!!this.donneesQCM &&
			!!this.donneesQCM.QCM &&
			!!this.donneesQCM.QCM.contenuQCM &&
			!!this.donneesQCM.QCM.contenuQCM.listeQuestions
		) {
			const lQuestion =
				this.donneesQCM.QCM.contenuQCM.listeQuestions.get(aIndexQuestion);
			if (!!aEleve && !!lQuestion && !!aEleve.listeReponses) {
				for (let i = 0; i < aEleve.listeReponses.count() && !lResult; i++) {
					const lReponse = aEleve.listeReponses.get(i);
					if (
						lReponse &&
						lReponse.question.getNumero() === lQuestion.getNumero()
					) {
						lResult = lReponse;
					}
				}
			}
		}
		return lResult;
	}
}
exports.ObjetFenetre_ResultatsQCM = ObjetFenetre_ResultatsQCM;
