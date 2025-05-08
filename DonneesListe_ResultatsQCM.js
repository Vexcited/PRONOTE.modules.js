exports.DonneesListe_ResultatsQCM = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeQualificatifReponse_1 = require("TypeQualificatifReponse");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetDate_1 = require("ObjetDate");
const TypeNote_1 = require("TypeNote");
const Enumere_Etat_1 = require("Enumere_Etat");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
let TypeEvolutionResultats;
var GenreLigneTotal;
(function (GenreLigneTotal) {
	GenreLigneTotal[(GenreLigneTotal["noteDuree"] = 0)] = "noteDuree";
	GenreLigneTotal[(GenreLigneTotal["bonnesReponses"] = 1)] = "bonnesReponses";
	GenreLigneTotal[(GenreLigneTotal["reponsesPartielles"] = 2)] =
		"reponsesPartielles";
	GenreLigneTotal[(GenreLigneTotal["mauvaisesReponses"] = 3)] =
		"mauvaisesReponses";
	GenreLigneTotal[(GenreLigneTotal["sansReponse"] = 4)] = "sansReponse";
})(GenreLigneTotal || (GenreLigneTotal = {}));
class DonneesListe_ResultatsQCM extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParametres) {
		super(aDonnees.listeEleves);
		this.application = GApplication;
		this.param = $.extend(
			{
				elementRacine: null,
				instanceListe: null,
				QCM: new ObjetElement_1.ObjetElement(),
				listeEleves: new ObjetListeElements_1.ObjetListeElements(),
				listeQuestions: new ObjetListeElements_1.ObjetListeElements(),
				moyennes: { noteQCM: null, tpsReponse: null, ressenti: null },
				valeurs: { nbTotalPts: null, nbEleves: null, dureeMax: null },
			},
			aDonnees,
		);
		this.avecEditionNote = aParametres.avecRectificationNotePossible;
		this.setOptions({
			avecEtatSaisie: false,
			avecSuppression: false,
			avecMultiSelection: true,
		});
		this.avecOptionPdf = aParametres.avecOptionPdf;
		this.callback = aParametres.callback;
	}
	estUneColonneDeQuestion(aParams) {
		return (
			!!aParams &&
			!!aParams.idColonne &&
			aParams.idColonne.startsWith(DonneesListe_ResultatsQCM.colonnes.question)
		);
	}
	estQuestionNotee(aParams) {
		if (this.estUneColonneDeQuestion(aParams) && this.avecEditionNote) {
			const lQuestionEleve = this.getQuestionEtReponseDEleve(
				aParams.declarationColonne.rangColonne - 1,
				aParams.ligne,
			);
			if (
				lQuestionEleve.reponse &&
				lQuestionEleve.reponse.qualificatif === undefined &&
				!!lQuestionEleve.reponse.note
			) {
				return true;
			}
		}
		return false;
	}
	estExecutionTerminee(aExecution) {
		return (
			!!aExecution &&
			[
				TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
					.EQR_Termine,
				TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
					.EQR_DureeMaxDepassee,
			].includes(aExecution.etatCloture)
		);
	}
	getImagePastille(aQualificatif, aOptionsAffichage = {}) {
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
	_avecPersonnalisation(aExecution) {
		let lResult = false;
		if (
			!!aExecution &&
			(aExecution.nombreQuestionsEnMoins > 0 ||
				aExecution.dureeSupplementaire > 0)
		) {
			lResult = true;
		}
		return lResult;
	}
	getHintPersonnalisation(aExecution) {
		const lResult = [
			ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.ResultatModalitesPersoEleve",
			),
			"<br />",
		];
		if (aExecution.dureeSupplementaire > 0) {
			lResult.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.ResultatxDureeSuppl",
					[
						UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
							aExecution.dureeSupplementaire,
						),
					],
				),
				"<br />",
			);
		}
		if (aExecution.nombreQuestionsEnMoins > 0) {
			lResult.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.ResultatxQuestionsEnMoins",
					[aExecution.nombreQuestionsEnMoins],
				),
			);
		}
		return lResult.join("");
	}
	getStrDuree(aDuree, aDureeMax) {
		const H = [];
		if (!!aDuree) {
			let lDureeMax = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(aDureeMax);
			if (lDureeMax === 0) {
				lDureeMax = 60;
			}
			if (parseInt(aDuree) <= lDureeMax) {
				H.push(
					aDuree,
					" ",
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.min"),
				);
			} else {
				H.push(
					">",
					lDureeMax,
					" ",
					ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.min"),
				);
			}
		}
		return H.join("");
	}
	getStrCelluleDuree(aEleve, aDureeMax) {
		const lHtml = [];
		if (!!aEleve) {
			lHtml.push('<div style="display:flex;">');
			if (this._avecPersonnalisation(aEleve.execution)) {
				lHtml.push(
					'<i class="icon_star" style="padding-left: 0.2rem; font-size: 1.2rem; flex: none;"></i>',
				);
			}
			if (aEleve.execution && aEleve.execution.dureeSupplementaire > 0) {
				aDureeMax = aDureeMax + aEleve.execution.dureeSupplementaire;
			}
			lHtml.push(
				'<span style="flex: 1 0 auto; text-align: right; padding-right: 0.2rem;">',
				this.getStrDuree(aEleve.dureeDeReponse, aDureeMax),
				"</span>",
			);
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	getNomIconeEvolutionResultats(aTypeEvolutionResultats) {
		let lNomIcone = "";
		if (!!TypeEvolutionResultats) {
			switch (aTypeEvolutionResultats) {
				case TypeEvolutionResultats.TER_EnHausse:
					lNomIcone = "icon_affichage_widget";
					break;
				case TypeEvolutionResultats.TER_EnBaisse:
					lNomIcone = "icon_fleche_bas";
					break;
				case TypeEvolutionResultats.TER_Stable:
					lNomIcone = "icon_egal";
					break;
				default:
					break;
			}
		}
		return lNomIcone;
	}
	getEvaluationQuestionDEleve(aIndexQuestion, aIndexEleve, aParams) {
		const lQuestionEleve = this.getQuestionEtReponseDEleve(
			aIndexQuestion,
			aIndexEleve,
		);
		if (lQuestionEleve.reponse) {
			if (lQuestionEleve.reponse.qualificatif !== undefined) {
				return this.getImagePastille(lQuestionEleve.reponse.qualificatif);
			} else if (
				lQuestionEleve.reponse.note &&
				(lQuestionEleve.reponse.repondu || lQuestionEleve.reponse.estAnnotee)
			) {
				let lValeurNote = Number(lQuestionEleve.reponse.note.replace(",", "."));
				if (aParams.surEdition && lValeurNote < 0) {
					lValeurNote = "";
				}
				return new TypeNote_1.TypeNote(lValeurNote);
			}
		} else if (lQuestionEleve.estUnQuestionNonPropose) {
			return "";
		}
		return "";
	}
	getQuestionEtReponseDEleve(aIndexQuestion, aIndexEleve) {
		const lResult = {
			reponse: null,
			question: null,
			estUnQuestionNonPropose: false,
		};
		const lQCM = this.param.QCM;
		if (lQCM && lQCM.contenuQCM) {
			lResult.question = lQCM.contenuQCM.listeQuestions.get(aIndexQuestion);
			const lEleve = !!this.param.listeEleves
				? this.param.listeEleves.get(aIndexEleve)
				: null;
			if (!!lEleve && !!lEleve.listeReponses) {
				for (
					let i = 0;
					i < lEleve.listeReponses.count() && !lResult.reponse;
					i++
				) {
					const lReponse = lEleve.listeReponses.get(i);
					if (
						lReponse &&
						!!lReponse.question &&
						lReponse.question.getNumero() === lResult.question.getNumero()
					) {
						lResult.reponse = lReponse;
					}
				}
			}
			if (
				!!lResult.question &&
				!!lEleve.listeReponses &&
				!!lEleve.listeReponses.count() &&
				!lResult.reponse &&
				this.estExecutionTerminee(lEleve.execution)
			) {
				lResult.estUnQuestionNonPropose = true;
			}
		}
		return lResult;
	}
	getHintQuestion(aIndexQuestion, aIndexEleve) {
		const lQCM = this.param.QCM;
		const lQuestionEleve = this.getQuestionEtReponseDEleve(
			aIndexQuestion,
			aIndexEleve,
		);
		if (lQCM && lQuestionEleve && lQuestionEleve.reponse) {
			const lTypeNumerotationQCM =
				lQCM.typeNumerotation !== undefined
					? lQCM.typeNumerotation
					: lQCM.contenuQCM.typeNumerotation;
			let lHtml =
				UtilitaireQCM_1.UtilitaireQCM.composeHintReponsesEleveDeQuestionQCM(
					aIndexQuestion,
					lQuestionEleve.question,
					lQuestionEleve.reponse,
					{
						typeNumerotationQCM: lTypeNumerotationQCM,
						avecAffichageInfosCompetences: true,
					},
				);
			if (lQuestionEleve.reponse.estAnnotee) {
				lHtml +=
					"<br />" +
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.nbPointsRectifiesManuellement",
					);
			}
			return $("<div>" + lHtml + "</div>").html();
		} else if (lQuestionEleve.estUnQuestionNonPropose) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.HintQuestionNonPresentee",
			);
		}
		return "";
	}
	avecEdition(aParams) {
		if (this.param.elementRacine && this.avecEditionNote) {
			return this.estQuestionNotee(aParams);
		}
		return false;
	}
	avecEvenementApresEdition() {
		return true;
	}
	remplirMenuContextuel(aParametres) {
		let lEleve;
		const lElevesMenuContext = aParametres.listeSelection;
		let lAvecSuppression = false,
			lAvecRedonner = false,
			lAvecAnnuler = false;
		const lParams = this.param;
		const lElementRacine = this.param.elementRacine;
		if (
			lElementRacine.estUnTAF ||
			lElementRacine.estLieADevoir ||
			lElementRacine.estLieAEvaluation
		) {
			lElevesMenuContext.parcourir((aEleve) => {
				lEleve = lParams.listeEleves.getElementParNumeroEtGenre(
					aEleve.getNumero(),
				);
				if (lEleve.listeReponses.count() > 0) {
					lAvecSuppression = true;
					return;
				}
			});
			if (!this.application.estPrimaire) {
				if (
					lElementRacine.estUnTAF &&
					!(lElementRacine.estLieADevoir || lElementRacine.estLieAEvaluation)
				) {
					lElevesMenuContext.parcourir((aEleve) => {
						lEleve = lParams.listeEleves.getElementParNumeroEtGenre(
							aEleve.getNumero(),
						);
						if (
							lEleve &&
							lEleve.execution &&
							lEleve.execution.etatCloture !==
								TypeEtatExecutionQCMPourRepondant_1
									.TypeEtatExecutionQCMPourRepondant.EQR_EnCours &&
							lEleve.execution.etatCloture !== undefined
						) {
							lAvecRedonner = true;
							return;
						}
					});
				}
			}
			if (lElementRacine.estLieADevoir || lElementRacine.estLieAEvaluation) {
				lElevesMenuContext.parcourir((aEleve) => {
					lEleve = lParams.listeEleves.getElementParNumeroEtGenre(
						aEleve.getNumero(),
					);
					const lQCMAFiniDEtrePublie = ObjetDate_1.GDate.estAvantJour(
						lEleve.execution.dateFinPublication,
						ObjetDate_1.GDate.getDateHeureCourante(),
					);
					if (
						lEleve &&
						lEleve.execution &&
						(lQCMAFiniDEtrePublie ||
							(lEleve.execution.etatCloture !==
								TypeEtatExecutionQCMPourRepondant_1
									.TypeEtatExecutionQCMPourRepondant.EQR_EnCours &&
								lEleve.execution.etatCloture !== undefined))
					) {
						lAvecAnnuler = true;
						return;
					}
				});
			}
		}
		const lEstExecutionMultiple =
			aParametres.article &&
			aParametres.article.execution &&
			aParametres.article.execution.nbMaxTentative > 1;
		const lLElevesAFaitLeMaxNbTentatives =
			!lEstExecutionMultiple ||
			aParametres.article.execution.nbTentatives >=
				aParametres.article.execution.nbMaxTentative;
		const lContextMenu = aParametres.menuContextuel;
		if (lAvecRedonner) {
			lContextMenu.addCommande(
				DonneesListe_ResultatsQCM.genreCommande.recommencerTaf,
				ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.RedonnerTAF"),
				!!lEleve.execution && !lEleve.execution.peutRefaire,
			);
		}
		if (lAvecAnnuler && lLElevesAFaitLeMaxNbTentatives) {
			const lLibNoteEval = lElementRacine.estLieAEvaluation
				? ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.RedonnerEvaluation",
					)
				: ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.AnnulerNote");
			lContextMenu.addCommande(
				DonneesListe_ResultatsQCM.genreCommande.recommencerDevoir,
				lLibNoteEval,
				!!lEleve.execution && !lEleve.execution.peutRefaire,
			);
		}
		if (lElevesMenuContext.count() === 1 && lParams.listeEleves) {
			lEleve = lParams.listeEleves.getElementParNumeroEtGenre(
				lElevesMenuContext.get(0).getNumero(),
			);
			const lAvecVisuCopiePrecedente =
				lEleve &&
				lEleve.estMultiCopies &&
				((!lEleve.copiePrecEstCopieVisible &&
					!!lEleve.executionCachee &&
					lEleve.executionCachee.estDemarre &&
					![
						TypeEtatExecutionQCMPourRepondant_1
							.TypeEtatExecutionQCMPourRepondant.EQR_EnCours,
						undefined,
					].includes(lEleve.executionCachee.etatCloture)) ||
					(!!lEleve.copiePrecEstCopieVisible &&
						lEleve.execution &&
						lEleve.execution.estDemarre &&
						![
							TypeEtatExecutionQCMPourRepondant_1
								.TypeEtatExecutionQCMPourRepondant.EQR_EnCours,
							undefined,
						].includes(lEleve.execution.etatCloture)));
			const lAvecVisuCopie =
				lEleve &&
				lEleve.execution &&
				lEleve.execution.estDemarre &&
				![
					TypeEtatExecutionQCMPourRepondant_1.TypeEtatExecutionQCMPourRepondant
						.EQR_EnCours,
					undefined,
				].includes(lEleve.execution.etatCloture);
			if (lAvecVisuCopie || lAvecVisuCopiePrecedente) {
				const lCopieVisible =
					lEleve.execution.etatCloture !==
						TypeEtatExecutionQCMPourRepondant_1
							.TypeEtatExecutionQCMPourRepondant.EQR_DureeMaxDepassee ||
					lEleve.execution.estFini;
				const lGenreCommandeConsulterCopieVisible =
					DonneesListe_ResultatsQCM.genreCommande.consulterCopieVisibleEleve;
				const lGenreCommandeConsulterCopieCachee =
					DonneesListe_ResultatsQCM.genreCommande.consulterCopieCacheeEleve;
				const lLibelleVisualiserCorrige =
					ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.VoirCorrige");
				if (lEleve.estMultiCopies) {
					const lStrFormatDate = "%JJ/%MM/%AA";
					const lStrDateCopieVisible = !!lEleve.execution.dateExecCopieVisible
						? ObjetDate_1.GDate.formatDate(
								lEleve.execution.dateExecCopieVisible,
								lStrFormatDate,
							)
						: "";
					const lDateCC =
						lEleve.execution.dateExecCopieCachee ||
						(lEleve.executionCachee
							? lEleve.executionCachee.dateExecCopieCachee
							: undefined);
					const lStrDateCopieCachee = !!lDateCC
						? ObjetDate_1.GDate.formatDate(lDateCC, lStrFormatDate)
						: "";
					lContextMenu.addSousMenu(
						lLibelleVisualiserCorrige,
						(aInstanceItem) => {
							const lCopieVisibleOK =
								!!lEleve.execution.dateExecCopieVisible &&
								lEleve.execution.etatCloture !==
									TypeEtatExecutionQCMPourRepondant_1
										.TypeEtatExecutionQCMPourRepondant.EQR_EnCours &&
								lEleve.execution.estFini;
							let lLibelle = ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.CopieNonDisponible",
							);
							if (lCopieVisibleOK) {
								if (lEleve.execution.estUnTAF) {
									lLibelle = ObjetTraduction_1.GTraductions.getValeur(
										"SaisieQCM.VoirCopiePriseEnCompteTAF",
										[lStrDateCopieVisible],
									);
								} else {
									lLibelle = ObjetTraduction_1.GTraductions.getValeur(
										"SaisieQCM.VoirCopiePriseEnCompte",
										[lStrDateCopieVisible],
									);
								}
							} else if (
								lEleve.execution.etatCloture ===
								TypeEtatExecutionQCMPourRepondant_1
									.TypeEtatExecutionQCMPourRepondant.EQR_EnCours
							) {
								lLibelle += ` (${ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.EnCours")})`;
							}
							aInstanceItem.addCommande(
								lGenreCommandeConsulterCopieVisible,
								lLibelle,
								lCopieVisibleOK,
							);
							lLibelle = ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.VoirCopieCachee",
								[lStrDateCopieCachee],
							);
							const lCopieCacheVisibleOK =
								!!lDateCC &&
								(lEleve.execution.estCopieCachee
									? lEleve.execution.etatCloture !==
											TypeEtatExecutionQCMPourRepondant_1
												.TypeEtatExecutionQCMPourRepondant.EQR_EnCours &&
										lEleve.execution.estFini
									: lEleve.executionCachee.etatCloture !==
											TypeEtatExecutionQCMPourRepondant_1
												.TypeEtatExecutionQCMPourRepondant.EQR_EnCours &&
										lEleve.executionCachee.estFini);
							if (!lCopieCacheVisibleOK) {
								lLibelle = ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.CopieNonDisponible",
								);
							}
							aInstanceItem.addCommande(
								lGenreCommandeConsulterCopieCachee,
								lLibelle,
								lCopieCacheVisibleOK,
							);
						},
					);
				} else {
					lContextMenu.addCommande(
						lGenreCommandeConsulterCopieVisible,
						lLibelleVisualiserCorrige,
						lCopieVisible,
					);
				}
				if (this.avecOptionPdf) {
					lContextMenu.addCommande(
						DonneesListe_ResultatsQCM.genreCommande.genererPDF,
						ObjetTraduction_1.GTraductions.getValeur(
							"ExecutionQCM.presentationCorrige.VisuPDF_Autre",
						),
						lCopieVisible,
					);
				}
			}
		}
		if (lAvecSuppression) {
			lContextMenu.addCommande(
				DonneesListe_ResultatsQCM.genreCommande.supprimerReponse,
				ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.SupprimerResultat"),
				true,
			);
		}
		return lContextMenu.contientAuMoinsUneLigne();
	}
	evenementMenuContextuel(aParametres) {
		const lCommande = aParametres.numeroMenu;
		const lInstance = aParametres.instance.Pere;
		const lDonneesRetourNav = {
			instance: lInstance.idResultatsQCM,
			action: lCommande,
			element: this.param.elementRacine,
			eleves: aParametres.listeSelection,
			eleve: null,
		};
		let lEleve;
		switch (lCommande) {
			case DonneesListe_ResultatsQCM.genreCommande.consulterCopieVisibleEleve:
			case DonneesListe_ResultatsQCM.genreCommande.consulterCopieCacheeEleve:
				lEleve = this.param.listeEleves.getElementParNumeroEtGenre(
					aParametres.listeSelection.get(0).getNumero(),
				);
				if (!!lEleve) {
					lDonneesRetourNav.eleve = lEleve;
					this.callback(lDonneesRetourNav);
				}
				break;
			case DonneesListe_ResultatsQCM.genreCommande.recommencerTaf:
			case DonneesListe_ResultatsQCM.genreCommande.supprimerReponse:
			case DonneesListe_ResultatsQCM.genreCommande.recommencerDevoir:
			case DonneesListe_ResultatsQCM.genreCommande.genererPDF:
				(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
					this.callback(lDonneesRetourNav);
				});
				break;
			default:
				break;
		}
		return true;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ResultatsQCM.colonnes.eleve: {
				const lNomEleve = aParams.article.getLibelle();
				const lEleve = [];
				if (!!aParams.article.evolutionResultats) {
					lEleve.push(
						'<div style="display:flex;justify-content: space-between;">',
					);
					lEleve.push("<div>", lNomEleve, "</div>");
					lEleve.push(
						'<div><i class="',
						this.getNomIconeEvolutionResultats(
							aParams.article.evolutionResultats,
						),
						'"></i></div>',
					);
					lEleve.push("</div>");
				} else {
					lEleve.push(lNomEleve);
				}
				return lEleve.join("");
			}
			case DonneesListe_ResultatsQCM.colonnes.classe:
				return aParams.article.classe
					? aParams.article.classe.getLibelle()
					: "";
			case DonneesListe_ResultatsQCM.colonnes.tentatives:
				return aParams.article &&
					aParams.article.execution &&
					aParams.article.execution.nbTentatives
					? aParams.article.execution.nbTentatives
					: "0";
			case DonneesListe_ResultatsQCM.colonnes.note1:
				if (aParams.article.noteNonRendue) {
					return ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.NonFait");
				} else if (aParams.article.note) {
					return aParams.article.note;
				}
				return "&nbsp;";
			case DonneesListe_ResultatsQCM.colonnes.note2: {
				if (aParams.article.note2NonRendue) {
					return ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.NonFait");
				} else if (aParams.article.note2) {
					return aParams.article.note2;
				}
				return "&nbsp;";
			}
			case DonneesListe_ResultatsQCM.colonnes.duree:
				return this.getStrCelluleDuree(
					aParams.article,
					this.param.valeurs.dureeMax,
				);
			case DonneesListe_ResultatsQCM.colonnes.ressenti: {
				const lImageRessenti =
					'<div class="Image_QCM_DrapeauRessenti" title="' +
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.HintRessentiDifficile",
					) +
					'">&nbsp;</div>';
				return aParams.article.ressenti > 0 ? lImageRessenti : "";
			}
			default:
				return this.getEvaluationQuestionDEleve(
					aParams.declarationColonne.rangColonne - 1,
					aParams.ligne,
					aParams,
				);
		}
	}
	surEdition(aParams, V) {
		if (this.estQuestionNotee(aParams)) {
			const lQuestionEleve = this.getQuestionEtReponseDEleve(
				aParams.declarationColonne.rangColonne - 1,
				aParams.ligne,
			);
			if (!!lQuestionEleve && !!lQuestionEleve.reponse) {
				lQuestionEleve.reponse.note = V.note;
				lQuestionEleve.reponse.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
		}
	}
	getOptionsNote(aParams) {
		if (this.estUneColonneDeQuestion(aParams)) {
			const lQuestionEleve = this.getQuestionEtReponseDEleve(
				aParams.declarationColonne.rangColonne - 1,
				aParams.ligne,
			);
			const lOptionsNote = {
				avecAnnotation: false,
				sansNotePossible: true,
				min: 0,
				max:
					lQuestionEleve.question && lQuestionEleve.question.note
						? lQuestionEleve.question.note
						: 0,
				avecVirgule: true,
				afficherAvecVirgule: true,
				texteSiVide: " ",
			};
			if (
				!!lQuestionEleve.reponse &&
				lQuestionEleve.reponse.estAnnotee &&
				!aParams.surEdition
			) {
				lOptionsNote.suffixe = " *";
			}
			return lOptionsNote;
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ResultatsQCM.colonnes.ressenti:
			case DonneesListe_ResultatsQCM.colonnes.duree:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			default:
				if (this.estQuestionNotee(aParams)) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
				}
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	getClass(aParams) {
		const lClasses = [];
		if (aParams.idColonne === DonneesListe_ResultatsQCM.colonnes.eleve) {
			lClasses.push("AlignementGauche");
		} else {
			lClasses.push("AlignementMilieu");
		}
		if (
			aParams.idColonne === DonneesListe_ResultatsQCM.colonnes.note1 ||
			aParams.idColonne === DonneesListe_ResultatsQCM.colonnes.note2
		) {
			if (aParams.article.estMultiCopies) {
				const lEstColonneNote1 =
					aParams.idColonne === DonneesListe_ResultatsQCM.colonnes.note1;
				if (
					(lEstColonneNote1 && !aParams.article.copiePrecEstCopieVisible) ||
					(!lEstColonneNote1 && aParams.article.copiePrecEstCopieVisible)
				) {
					lClasses.push("Gris");
				}
			}
		} else if (this.estUneColonneDeQuestion(aParams)) {
			const lQuestionEleve = this.getQuestionEtReponseDEleve(
				aParams.declarationColonne.rangColonne - 1,
				aParams.ligne,
			);
			if (lQuestionEleve.estUnQuestionNonPropose) {
				lClasses.push("qcm_question_non_dispo");
			}
		}
		return lClasses.join(" ");
	}
	getListeLignesTotal() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		lListe.addElement(
			new ObjetElement_1.ObjetElement(""),
			GenreLigneTotal.noteDuree,
		);
		lListe.addElement(
			new ObjetElement_1.ObjetElement(""),
			GenreLigneTotal.bonnesReponses,
		);
		lListe.addElement(
			new ObjetElement_1.ObjetElement(""),
			GenreLigneTotal.reponsesPartielles,
		);
		lListe.addElement(
			new ObjetElement_1.ObjetElement(""),
			GenreLigneTotal.mauvaisesReponses,
		);
		lListe.addElement(
			new ObjetElement_1.ObjetElement(""),
			GenreLigneTotal.sansReponse,
		);
		return lListe;
	}
	getClassTotal(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_ResultatsQCM.colonnes.eleve:
				lClasses.push("AlignementDroit");
				break;
			default:
				lClasses.push("Gras", "AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	getStyleTotal(aParams) {
		if (aParams.ligne === 0) {
			switch (aParams.idColonne) {
				case DonneesListe_ResultatsQCM.colonnes.tentatives:
				case DonneesListe_ResultatsQCM.colonnes.note1:
				case DonneesListe_ResultatsQCM.colonnes.note2:
				case DonneesListe_ResultatsQCM.colonnes.duree:
				case DonneesListe_ResultatsQCM.colonnes.ressenti:
					return (
						ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.liste.total.fond) +
						ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.blanc)
					);
				default:
					return "";
			}
		}
		switch (aParams.idColonne) {
			case DonneesListe_ResultatsQCM.colonnes.eleve:
			case DonneesListe_ResultatsQCM.colonnes.classe:
			case DonneesListe_ResultatsQCM.colonnes.tentatives:
			case DonneesListe_ResultatsQCM.colonnes.note1:
			case DonneesListe_ResultatsQCM.colonnes.note2:
			case DonneesListe_ResultatsQCM.colonnes.duree:
			case DonneesListe_ResultatsQCM.colonnes.ressenti:
				return "";
			default:
				return (
					ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.liste.total.fond) +
					ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.blanc)
				);
		}
	}
	getColonneDeFusionTotal(aParams) {
		if (aParams.ligne !== GenreLigneTotal.noteDuree) {
			switch (aParams.idColonne) {
				case DonneesListe_ResultatsQCM.colonnes.ressenti:
					return DonneesListe_ResultatsQCM.colonnes.eleve;
				case DonneesListe_ResultatsQCM.colonnes.duree:
					return DonneesListe_ResultatsQCM.colonnes.eleve;
				case DonneesListe_ResultatsQCM.colonnes.tentatives:
					return DonneesListe_ResultatsQCM.colonnes.eleve;
				case DonneesListe_ResultatsQCM.colonnes.note1:
				case DonneesListe_ResultatsQCM.colonnes.note2:
					return DonneesListe_ResultatsQCM.colonnes.eleve;
				case DonneesListe_ResultatsQCM.colonnes.classe:
					return DonneesListe_ResultatsQCM.colonnes.eleve;
				default:
					return null;
			}
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_ResultatsQCM.colonnes.tentatives:
					return DonneesListe_ResultatsQCM.colonnes.eleve;
				case DonneesListe_ResultatsQCM.colonnes.eleve:
				case DonneesListe_ResultatsQCM.colonnes.ressenti:
				case DonneesListe_ResultatsQCM.colonnes.duree:
				case DonneesListe_ResultatsQCM.colonnes.note1:
				case DonneesListe_ResultatsQCM.colonnes.classe:
					return null;
				case DonneesListe_ResultatsQCM.colonnes.note2:
					return DonneesListe_ResultatsQCM.colonnes.note1;
				default:
					return aParams.declarationColonne.rangColonne === 1
						? null
						: aParams.colonne - aParams.declarationColonne.rangColonne + 1;
			}
		}
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ResultatsQCM.colonnes.eleve:
				switch (aParams.ligne) {
					case GenreLigneTotal.noteDuree:
						return "";
					case GenreLigneTotal.bonnesReponses:
						return ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.totalResultats",
						)[0];
					case GenreLigneTotal.reponsesPartielles:
						return ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.totalResultats",
						)[1];
					case GenreLigneTotal.mauvaisesReponses:
						return ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.totalResultats",
						)[2];
					case GenreLigneTotal.sansReponse:
						return ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.totalResultats",
						)[3];
				}
				return "";
			case DonneesListe_ResultatsQCM.colonnes.ressenti:
				return this.param.moyennes.ressenti;
			case DonneesListe_ResultatsQCM.colonnes.duree:
				return this.getStrDuree(
					this.param.moyennes.tpsReponse,
					this.param.valeurs.dureeMax,
				);
			case DonneesListe_ResultatsQCM.colonnes.tentatives:
				return null;
			case DonneesListe_ResultatsQCM.colonnes.note1:
				return this.param.moyennes.noteQCM;
			case DonneesListe_ResultatsQCM.colonnes.classe:
				break;
			default: {
				const lQuest = this.param.listeQuestions.get(
					aParams.declarationColonne.rangColonne - 1,
				);
				switch (aParams.ligne - 1) {
					case TypeQualificatifReponse_1.TypeQualificatifReponse.qrBonne:
						return lQuest.listeQualif[0].total;
					case TypeQualificatifReponse_1.TypeQualificatifReponse
						.qrBonnePartielle:
						return lQuest.listeQualif[1].total;
					case TypeQualificatifReponse_1.TypeQualificatifReponse.qrFausse:
						return lQuest.listeQualif[2].total;
					case TypeQualificatifReponse_1.TypeQualificatifReponse.qrSansReponse:
						return lQuest.listeQualif[3].total;
				}
			}
		}
	}
	getHintHtmlForce(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ResultatsQCM.colonnes.eleve:
			case DonneesListe_ResultatsQCM.colonnes.classe:
			case DonneesListe_ResultatsQCM.colonnes.tentatives:
			case DonneesListe_ResultatsQCM.colonnes.note1:
			case DonneesListe_ResultatsQCM.colonnes.note2:
			case DonneesListe_ResultatsQCM.colonnes.ressenti:
				break;
			case DonneesListe_ResultatsQCM.colonnes.duree:
				if (this._avecPersonnalisation(aParams.article.execution)) {
					return this.getHintPersonnalisation(aParams.article.execution);
				}
				break;
			default:
				return this.getHintQuestion(
					aParams.declarationColonne.rangColonne - 1,
					aParams.ligne,
				);
		}
	}
	static setTypeEvolutionResultatsQCM(aTypeEvolutionResultats) {
		TypeEvolutionResultats = aTypeEvolutionResultats;
	}
}
exports.DonneesListe_ResultatsQCM = DonneesListe_ResultatsQCM;
DonneesListe_ResultatsQCM.colonnes = {
	eleve: "eleve",
	classe: "classe",
	note1: "note",
	note2: "note2",
	duree: "duree",
	ressenti: "ressenti",
	question: "question",
	tentatives: "tentatives",
};
(function (DonneesListe_ResultatsQCM) {
	let genreCommande;
	(function (genreCommande) {
		genreCommande[(genreCommande["consulterCopieVisibleEleve"] = 0)] =
			"consulterCopieVisibleEleve";
		genreCommande[(genreCommande["supprimerReponse"] = 1)] = "supprimerReponse";
		genreCommande[(genreCommande["recommencerDevoir"] = 2)] =
			"recommencerDevoir";
		genreCommande[(genreCommande["recommencerTaf"] = 3)] = "recommencerTaf";
		genreCommande[(genreCommande["genererPDF"] = 4)] = "genererPDF";
		genreCommande[(genreCommande["consulterCopieCacheeEleve"] = 5)] =
			"consulterCopieCacheeEleve";
	})(
		(genreCommande =
			DonneesListe_ResultatsQCM.genreCommande ||
			(DonneesListe_ResultatsQCM.genreCommande = {})),
	);
})(
	DonneesListe_ResultatsQCM ||
		(exports.DonneesListe_ResultatsQCM = DonneesListe_ResultatsQCM = {}),
);
