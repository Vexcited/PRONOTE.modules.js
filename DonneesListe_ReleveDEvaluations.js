exports.DonneesListe_ReleveDEvaluations = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const Enumere_Annotation_1 = require("Enumere_Annotation");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Evolution_1 = require("Enumere_Evolution");
const AccessApp_1 = require("AccessApp");
class DonneesListe_ReleveDEvaluations extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.param = Object.assign(
			{
				tailleMaxAppreciation: 255,
				initMenuContextuel: null,
				avecAssistantSaisie: false,
				affichageModeMultiLigne: true,
				affichageJaugeChronologique: false,
				affichageProjetsAccompagnement: true,
				callbackClicJauge: null,
				callbackClicProjetsAccompagnement: null,
			},
			aParams,
		);
		this.setOptions({
			avecSuppression: false,
			editionApresSelection: false,
			avecEvnt_KeyUpListe: true,
			avecMultiSelection: true,
			avecSelectionSurNavigationClavier: true,
		});
	}
	jsxNodePiecesJointesProjetAccompagnement(aArticleEleve, aNode) {
		if (aArticleEleve && aArticleEleve.avecDocsProjetsAccompagnement) {
			$(aNode).eventValidation(() => {
				if (this.param.callbackClicProjetsAccompagnement) {
					this.param.callbackClicProjetsAccompagnement(aArticleEleve);
				}
			});
		}
	}
	jsxNodeJaugeColonneLSL(aArticleEleve, aIdColonne, aNode) {
		const lValeurColonneLSL =
			DonneesListe_ReleveDEvaluations._getValeurColonneLSL(
				aIdColonne,
				aArticleEleve,
			);
		$(aNode).eventValidation(() => {
			if (!!this.param.callbackClicJauge) {
				this.param.callbackClicJauge(aArticleEleve, lValeurColonneLSL);
			}
		});
	}
	static estUneColonneDEvaluation(aColonneId) {
		return (
			aColonneId &&
			aColonneId.indexOf(
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_evaluation,
			) === 0
		);
	}
	static getIndexDeColonneEvaluation(aColonneId) {
		let lIndex = -1;
		if (DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(aColonneId)) {
			lIndex = DonneesListe_ReleveDEvaluations._getIndexDeColonne(
				aColonneId,
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_evaluation,
			);
		}
		return lIndex;
	}
	static estUneColonneDAppreciation(aColonneId) {
		return (
			aColonneId &&
			aColonneId.indexOf(
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_appreciations,
			) === 0
		);
	}
	static getRangAppreciation(aColonneId) {
		return DonneesListe_ReleveDEvaluations._getIndexDeColonne(
			aColonneId,
			DonneesListe_ReleveDEvaluations.colonnes.prefixe_appreciations,
		);
	}
	static getObjetAppreciation(aColonneId, D) {
		let lObjetAppreciation = null;
		const lRang =
			DonneesListe_ReleveDEvaluations.getRangAppreciation(aColonneId);
		if (
			lRang > -1 &&
			!!D.listeAppreciations &&
			D.listeAppreciations.count() > 0
		) {
			lObjetAppreciation = D.listeAppreciations.getElementParGenre(lRang);
		}
		return lObjetAppreciation;
	}
	static lAppreciationEstEditable(aColonneId, D) {
		let lEditable = false;
		const lObjAppreciation =
			DonneesListe_ReleveDEvaluations.getObjetAppreciation(aColonneId, D);
		if (!!lObjAppreciation) {
			lEditable = lObjAppreciation.estEditable;
		}
		return lEditable;
	}
	static getValeurColonneLSL(aColonneId, D) {
		return DonneesListe_ReleveDEvaluations._getValeurColonneLSL(aColonneId, D);
	}
	static estUneColonneLSLNiveau(aColonneId) {
		return DonneesListe_ReleveDEvaluations._estUneColonneLSLNiveau(aColonneId);
	}
	avecContenuTronque() {
		return !this.param.affichageModeMultiLigne;
	}
	getTypeValeur(aParams) {
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
				aParams.idColonne,
			) ||
			this._estUneColonneSimulation(aParams.idColonne) ||
			this._estUneColonnePositionnementPrecedent(aParams.idColonne) ||
			this._estUneColonneLSL(aParams.idColonne)
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
		}
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.eleve:
			case DonneesListe_ReleveDEvaluations.colonnes.evolution:
			case DonneesListe_ReleveDEvaluations.colonnes.synthese:
			case DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine:
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.evolution:
			case DonneesListe_ReleveDEvaluations.colonnes.percent_acquisition:
			case DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine:
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau:
				return "AlignementMilieu";
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				return "AlignementDroit";
		}
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
				aParams.idColonne,
			) ||
			this._estUneColonneSimulation(aParams.idColonne) ||
			this._estUneColonnePositionnementPrecedent(aParams.idColonne) ||
			DonneesListe_ReleveDEvaluations._estUneColonneLSLNiveau(aParams.idColonne)
		) {
			return "AlignementMilieu";
		}
		return "";
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			) &&
			DonneesListe_ReleveDEvaluations.lAppreciationEstEditable(
				aParams.idColonne,
				aParams.article,
			)
		) {
			if (
				this.param.avecAssistantSaisie &&
				this.etatUtilisateurSco.assistantSaisieActif
			) {
				lClasses.push("Curseur_AssistantSaisieActif");
			} else {
				lClasses.push("AvecMain");
			}
		}
		return lClasses.join(" ");
	}
	getOptionsNote(aParams) {
		let lMaxNotation = 20;
		if (
			!!aParams.article &&
			!!aParams.article.posLSUNoteBareme &&
			aParams.article.posLSUNoteBareme.estUneValeur()
		) {
			lMaxNotation = aParams.article.posLSUNoteBareme.getValeur();
		}
		return {
			sansNotePossible: true,
			afficherAvecVirgule: true,
			hintSurErreur: false,
			min: 0,
			max: lMaxNotation,
			listeAnnotations: [
				Enumere_Annotation_1.EGenreAnnotation.absent,
				Enumere_Annotation_1.EGenreAnnotation.dispense,
				Enumere_Annotation_1.EGenreAnnotation.nonNote,
			],
		};
	}
	avecSelection(aParams) {
		return this.avecEdition(aParams);
	}
	avecEvenementSelection(aParams) {
		return this.avecSelection(aParams);
	}
	selectionParCellule() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			return { tailleMax: this.param.tailleMaxAppreciation };
		}
		return null;
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau:
				return !!aParams.article.posNiveauEstEditable;
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				return !!aParams.article.posNoteEstEditable;
			case DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine:
				return !!aParams.article.nivAcquiPilierEstEditable;
		}
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			return DonneesListe_ReleveDEvaluations.lAppreciationEstEditable(
				aParams.idColonne,
				aParams.article,
			);
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
				aParams.idColonne,
			)
		) {
			const lNiveau = this._getNiveauDAcquiDeColonneEvaluation(
				aParams.idColonne,
				aParams.article,
			);
			return lNiveau ? !!lNiveau.estEditable : false;
		} else if (
			DonneesListe_ReleveDEvaluations._estUneColonneLSLNiveau(aParams.idColonne)
		) {
			const lNiveauLSL = this._getNiveauDeColonneLSL(
				aParams.idColonne,
				aParams.article,
			);
			return lNiveauLSL ? !!lNiveauLSL.estEditable : false;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
				aParams.idColonne,
			)
		) {
			return this.avecEdition(aParams);
		} else if (
			DonneesListe_ReleveDEvaluations._estUneColonneLSLNiveau(aParams.idColonne)
		) {
			return this.avecEdition(aParams);
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			return (
				this.avecEdition(aParams) &&
				this.etatUtilisateurSco.assistantSaisieActif
			);
		} else if (
			aParams.idColonne ===
			DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau
		) {
			return this.avecEdition(aParams);
		} else if (
			aParams.idColonne ===
			DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine
		) {
			return this.avecEdition(aParams);
		}
		return false;
	}
	surEdition(aParams) {
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			const lObjetAppreciation =
				DonneesListe_ReleveDEvaluations.getObjetAppreciation(
					aParams.idColonne,
					aParams.article,
				);
			if (
				!!lObjetAppreciation &&
				lObjetAppreciation.valeur !== aParams.valeur
			) {
				lObjetAppreciation.valeur = aParams.valeur;
				lObjetAppreciation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
		}
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				aParams.article.posLSUNote = aParams.valeur;
				aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
		}
	}
	getValeur(aParams) {
		const lSurExportCSV = aParams && aParams.surExportCSV;
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.eleve:
				if (lSurExportCSV) {
					return aParams.article.getLibelle();
				} else {
					return this._getValeurColonneEleve(
						aParams.article,
						this.param.affichageProjetsAccompagnement,
					);
				}
			case DonneesListe_ReleveDEvaluations.colonnes.synthese:
				if (this.param.affichageJaugeChronologique) {
					if (lSurExportCSV) {
						return UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
							aParams.article.listeNiveauxSyntheseChrono,
						);
					} else {
						return UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeChronologique(
							{
								listeNiveaux: aParams.article.listeNiveauxSyntheseChrono,
								hint: aParams.article.hintSyntheseChrono,
							},
						);
					}
				} else {
					if (lSurExportCSV) {
						return UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
							aParams.article.listeNiveauxSyntheseParNiveau,
						);
					} else {
						return UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
							{
								listeNiveaux: aParams.article.listeNiveauxSyntheseParNiveau,
								hint: aParams.article.hintSyntheseParNiveau,
							},
						);
					}
				}
			case DonneesListe_ReleveDEvaluations.colonnes.evolution:
				return Enumere_Evolution_1.EGenreEvolutionUtil.getImage(
					!!aParams.article.evolution
						? aParams.article.evolution.getGenre()
						: 0,
				);
			case DonneesListe_ReleveDEvaluations.colonnes.percent_acquisition:
				return aParams.article.percentAcqui || "";
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau:
				if (!!aParams.article.posLSUNiveau) {
					if (lSurExportCSV) {
						return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getAbbreviation(
							aParams.article.posLSUNiveau,
						);
					} else {
						return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: aParams.article.posLSUNiveau,
								genrePositionnement:
									aParams.article.genrePositionnementSansNote,
							},
						);
					}
				}
				return "";
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				return aParams.article.posLSUNote;
			case DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine: {
				let lResultNivAcquiPilier = "";
				const lNiveauAcquiPilier = aParams.article.nivAcquiPilier;
				if (!!lNiveauAcquiPilier) {
					lResultNivAcquiPilier +=
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveauAcquiPilier,
							{ avecTitle: false },
						);
					if (lNiveauAcquiPilier.observation) {
						lResultNivAcquiPilier += IE.jsx.str("i", {
							style: "position:absolute; right:0px; bottom:0px;",
							class: " icon_info_sign",
							role: "presentation",
						});
					}
				}
				if (lSurExportCSV) {
					return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getAbbreviation(
						lNiveauAcquiPilier,
					);
				} else {
					return lResultNivAcquiPilier;
				}
			}
		}
		if (this._estUneColonnePositionnementPrecedent(aParams.idColonne)) {
			let lResultPosPrecedent = "";
			const lNiveauPosPrecedent =
				this._getNiveauDAcquiDeColonnePositionnementPrecedent(
					aParams.idColonne,
					aParams.article,
				);
			if (!!lNiveauPosPrecedent) {
				lResultPosPrecedent =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
						{
							niveauDAcquisition: lNiveauPosPrecedent,
							genrePositionnement: aParams.article.genrePositionnementSansNote,
						},
					);
			}
			if (lSurExportCSV) {
				return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getAbbreviation(
					lNiveauPosPrecedent,
				);
			} else {
				return lResultPosPrecedent;
			}
		} else if (this._estUneColonneSimulation(aParams.idColonne)) {
			let lResultSimulation = "-";
			const lNiveauSimu = this._getNiveauDAcquiDeColonneSimulation(
				aParams.idColonne,
				aParams.article,
			);
			if (!!lNiveauSimu) {
				const lAffichagePastillesPositionnement =
					aParams.declarationColonne.affichagePastillesDePositionnenment;
				if (lAffichagePastillesPositionnement) {
					lResultSimulation =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: lNiveauSimu,
								genrePositionnement:
									aParams.article.genrePositionnementSansNote,
							},
						);
				} else {
					lResultSimulation =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveauSimu,
						);
				}
			}
			if (lSurExportCSV) {
				return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getAbbreviation(
					lNiveauSimu,
				);
			} else {
				return lResultSimulation;
			}
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
				aParams.idColonne,
			)
		) {
			let lResultNivAcqui = "";
			const lNiveau = this._getNiveauDAcquiDeColonneEvaluation(
				aParams.idColonne,
				aParams.article,
			);
			if (!!lNiveau) {
				if (lSurExportCSV) {
					lResultNivAcqui =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getAbbreviation(
							lNiveau,
						);
				} else if (lNiveau.estImpossible) {
					lResultNivAcqui = lNiveau.libelleImpossible;
				} else {
					lResultNivAcqui +=
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveau,
							{ avecTitle: false },
						);
					if (
						lNiveau.getGenre() >=
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert &&
						lNiveau.observation
					) {
						lResultNivAcqui += IE.jsx.str("i", {
							style: "position:absolute; right:0px; bottom:0px;",
							class: " icon_comment",
							role: "presentation",
						});
					}
				}
			}
			return lResultNivAcqui;
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			const lAppreciation = this._getAppreciation(
				aParams.idColonne,
				aParams.article,
			);
			if (
				aParams.surEdition === true ||
				this.param.affichageModeMultiLigne === true
			) {
				return lAppreciation;
			} else {
				return (lAppreciation || "").replace(/\n/g, " ");
			}
		} else if (
			DonneesListe_ReleveDEvaluations._estUneColonneLSLJauge(aParams.idColonne)
		) {
			const lValeurColonneLSL =
				DonneesListe_ReleveDEvaluations._getValeurColonneLSL(
					aParams.idColonne,
					aParams.article,
				);
			if (lValeurColonneLSL && lValeurColonneLSL.listeNiveauxDAcquisitions) {
				const lHtmlJauges = [];
				lHtmlJauges.push(
					IE.jsx.str(
						"div",
						{
							class: "AvecMain",
							"ie-node": this.jsxNodeJaugeColonneLSL.bind(
								this,
								aParams.article,
								aParams.idColonne,
							),
						},
						UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
							{
								listeNiveaux: lValeurColonneLSL.listeNiveauxDAcquisitions,
								hint: lValeurColonneLSL.hintNiveauxDAcquisitions,
							},
						),
					),
				);
				return lHtmlJauges.join("");
			}
		} else if (
			DonneesListe_ReleveDEvaluations._estUneColonneLSLNiveau(aParams.idColonne)
		) {
			const lNiveauColonneLSL = this._getNiveauDeColonneLSL(
				aParams.idColonne,
				aParams.article,
			);
			if (lNiveauColonneLSL) {
				if (!!lNiveauColonneLSL.estImpossible) {
					return lNiveauColonneLSL.libelleImpossible || "";
				} else {
					return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
						lNiveauColonneLSL,
						{ avecTitle: false },
					);
				}
			}
		}
		return "";
	}
	getTooltip(aParams) {
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
				aParams.idColonne,
			)
		) {
			const lNiveauAcquisitionEleve = this._getNiveauDAcquiDeColonneEvaluation(
				aParams.idColonne,
				aParams.article,
			);
			if (!!lNiveauAcquisitionEleve && lNiveauAcquisitionEleve.estImpossible) {
				return lNiveauAcquisitionEleve.hintImpossible;
			} else {
				let lHintCompetenceColonne = "";
				if (
					!!aParams.declarationColonne &&
					!!aParams.declarationColonne.titre &&
					MethodesObjet_1.MethodesObjet.isArray(
						aParams.declarationColonne.titre,
					)
				) {
					const lArrayTitres = aParams.declarationColonne.titre;
					if (lArrayTitres.length > 0) {
						const lDernierTitre = lArrayTitres[lArrayTitres.length - 1];
						if (!!lDernierTitre && !!lDernierTitre.titleHtml) {
							lHintCompetenceColonne = lDernierTitre.titleHtml;
						}
					}
				}
				let lObservationEleve;
				if (
					!!lNiveauAcquisitionEleve &&
					!!lNiveauAcquisitionEleve.observation &&
					lNiveauAcquisitionEleve.getGenre() >=
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert
				) {
					lObservationEleve = lNiveauAcquisitionEleve.observation.replace(
						/\n/g,
						"<br/>",
					);
					if (!!lNiveauAcquisitionEleve.observationPubliee) {
						lObservationEleve +=
							" (" +
							ObjetTraduction_1.GTraductions.getValeur(
								"competences.PublieSurEspaceParent",
							) +
							")";
					}
				}
				return ObjetChaine_1.GChaine.toTitle(
					UtilitaireCompetences_1.TUtilitaireCompetences.composeHintEvaluationEleve(
						{
							libelleEleve: aParams.article.getLibelle(),
							estSaisieClotureePourEleve:
								!!lNiveauAcquisitionEleve.estSurPeriodeCloturee,
							hintCompetence: lHintCompetenceColonne,
							niveauDAcquisition: lNiveauAcquisitionEleve,
							observation: lObservationEleve,
						},
					),
				);
			}
		}
		let lNiveau;
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				if (!!aParams.article.posLSUNote) {
					if (aParams.article.posLSUNote.estUneValeur()) {
						return aParams.article.posLSUNote.getValeur().toString();
					} else {
						return aParams.article.posLSUNote.getChaineAnnotationDeGenre(
							aParams.article.posLSUNote.getGenre(),
						);
					}
				}
				return "";
			case DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine:
				lNiveau = aParams.article.nivAcquiPilier;
				if (!!lNiveau) {
					let lHintNiveauAcquiDomaine = "";
					if (lNiveau.existeNumero()) {
						lHintNiveauAcquiDomaine =
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
								lNiveau,
							);
					}
					if (lNiveau.observation) {
						if (
							!!lHintNiveauAcquiDomaine &&
							lHintNiveauAcquiDomaine.length > 0
						) {
							lHintNiveauAcquiDomaine += "\n";
						}
						lHintNiveauAcquiDomaine += lNiveau.observation;
					}
					return lHintNiveauAcquiDomaine;
				}
				return "";
			case DonneesListe_ReleveDEvaluations.colonnes.percent_acquisition:
				return aParams.article.percentAcqui || "";
		}
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			return this._getAppreciation(aParams.idColonne, aParams.article);
		} else if (
			DonneesListe_ReleveDEvaluations._estUneColonneLSLNiveau(aParams.idColonne)
		) {
			const lNiveauColonneLSL = this._getNiveauDeColonneLSL(
				aParams.idColonne,
				aParams.article,
			);
			if (lNiveauColonneLSL && lNiveauColonneLSL.estImpossible) {
				return lNiveauColonneLSL.hintImpossible || "";
			}
		}
		return "";
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lThis = this;
		const lCacheOrdreNiveauDAcqui = this._getCacheOrdreNiveauDAcquisition();
		const lColonneId = this.getId(aColonneDeTri);
		const lTris = [];
		if (this._estUneColonnePositionnementPrecedent(lColonneId)) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					const lNiveau = this._getNiveauDAcquiDeColonnePositionnementPrecedent(
						lColonneId,
						D,
					);
					return this._triNivAcquisition(lCacheOrdreNiveauDAcqui, lNiveau);
				}, aGenreTri),
			);
		} else if (this._estUneColonneSimulation(lColonneId)) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					const lNiveau = this._getNiveauDAcquiDeColonneSimulation(
						lColonneId,
						D,
					);
					return this._triNivAcquisition(lCacheOrdreNiveauDAcqui, lNiveau);
				}, aGenreTri),
			);
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(lColonneId)
		) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					const lNiveau = this._getNiveauDAcquiDeColonneEvaluation(
						lColonneId,
						D,
					);
					return this._triNivAcquisition(lCacheOrdreNiveauDAcqui, lNiveau);
				}, aGenreTri),
			);
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(lColonneId)
		) {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					(D) => {
						return !!DonneesListe_ReleveDEvaluations.getObjetAppreciation(
							lColonneId,
							D,
						)
							? 1
							: 0;
					},
					aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
						? Enumere_TriElement_1.EGenreTriElement.Decroissant
						: Enumere_TriElement_1.EGenreTriElement.Croissant,
				),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					this.getValeurPourTri.bind(this, aColonneDeTri),
					aGenreTri,
				),
			);
		} else {
			switch (lColonneId) {
				case DonneesListe_ReleveDEvaluations.colonnes.eleve:
					lTris.push(ObjetTri_1.ObjetTri.init("Position", aGenreTri));
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.synthese:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							(D) => {
								return D.moyenneSynthese && D.moyenneSynthese.estUneValeur()
									? D.moyenneSynthese.getValeur()
									: 0;
							},
							aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
								? Enumere_TriElement_1.EGenreTriElement.Decroissant
								: Enumere_TriElement_1.EGenreTriElement.Croissant,
						),
					);
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.percent_acquisition:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							(D) => {
								const lValueCell = lThis.getValeurPourTri(aColonneDeTri, D);
								return !!lValueCell ? parseFloat(lValueCell) || 0 : -1;
							},
							aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
								? Enumere_TriElement_1.EGenreTriElement.Decroissant
								: Enumere_TriElement_1.EGenreTriElement.Croissant,
						),
					);
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return this._triNivAcquisition(
								lCacheOrdreNiveauDAcqui,
								D.posLSUNiveau,
							);
						}, aGenreTri),
					);
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							if (!!D.posLSUNote) {
								if (D.posLSUNote.estUneValeur()) {
									return D.posLSUNote.getValeur() * -1;
								}
								return D.posLSUNote.getGenre();
							}
							return "";
						}, aGenreTri),
					);
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return this._triNivAcquisition(
								lCacheOrdreNiveauDAcqui,
								D.nivAcquiPilier,
							);
						}, aGenreTri),
					);
					break;
			}
		}
		if (lColonneId !== DonneesListe_ReleveDEvaluations.colonnes.eleve) {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					"Position",
					Enumere_TriElement_1.EGenreTriElement.Croissant,
				),
			);
		}
		return lTris;
	}
	remplirMenuContextuel(aParams) {
		this.param.initMenuContextuel(aParams);
	}
	static _getSuffixeDeColonne(aColonneId, aPrefixeColonne) {
		return aColonneId.substring(aPrefixeColonne.length, aColonneId.length);
	}
	static _getIndexDeColonne(aColonneId, aPrefixeColonne) {
		let result = -1;
		if (aColonneId) {
			const lStrIndex = DonneesListe_ReleveDEvaluations._getSuffixeDeColonne(
				aColonneId,
				aPrefixeColonne,
			);
			if (!!lStrIndex) {
				result = parseInt(lStrIndex, 10);
			}
		}
		return result;
	}
	_estUneColonnePositionnementPrecedent(aColonneId) {
		return (
			aColonneId &&
			aColonneId.indexOf(
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_posPrecedent,
			) === 0
		);
	}
	_getNiveauDAcquiDeColonnePositionnementPrecedent(aColonneId, D) {
		let result = null;
		if (!!D.posPrecedents) {
			const lIndex = DonneesListe_ReleveDEvaluations._getIndexDeColonne(
				aColonneId,
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_posPrecedent,
			);
			result = D.posPrecedents.get(lIndex);
		}
		return result;
	}
	_estUneColonneSimulation(aColonneId) {
		return (
			aColonneId &&
			aColonneId.indexOf(
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_simulation,
			) === 0
		);
	}
	_getNiveauDAcquiDeColonneSimulation(aColonneId, D) {
		let result = null;
		if (!!D.simulations) {
			const lIndex = DonneesListe_ReleveDEvaluations._getIndexDeColonne(
				aColonneId,
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_simulation,
			);
			result = D.simulations.get(lIndex);
		}
		return result;
	}
	_getNiveauDAcquiDeColonneEvaluation(aColonneId, D) {
		const lIndex =
			DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(aColonneId);
		return D.listeNiveauxDAcquisitions.get(lIndex);
	}
	_estUneColonneLSL(aColonneId) {
		return (
			DonneesListe_ReleveDEvaluations._estUneColonneLSLJauge(aColonneId) ||
			DonneesListe_ReleveDEvaluations._estUneColonneLSLNiveau(aColonneId)
		);
	}
	static _estUneColonneLSLJauge(aColonneId) {
		return (
			aColonneId &&
			aColonneId.indexOf(
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_jauge,
			) === 0
		);
	}
	static _estUneColonneLSLNiveau(aColonneId) {
		return (
			aColonneId &&
			aColonneId.indexOf(
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_niveau,
			) === 0
		);
	}
	static _getValeurColonneLSL(aColonneId, D) {
		let lValeurColonneConcernee;
		if (D.listeValeursColonnesLSL) {
			let lPrefixeColonneId;
			if (this._estUneColonneLSLJauge(aColonneId)) {
				lPrefixeColonneId =
					DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_jauge;
			} else if (this._estUneColonneLSLNiveau(aColonneId)) {
				lPrefixeColonneId =
					DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_niveau;
			}
			if (lPrefixeColonneId) {
				const lNumeroDeColonne =
					DonneesListe_ReleveDEvaluations._getSuffixeDeColonne(
						aColonneId,
						lPrefixeColonneId,
					);
				D.listeValeursColonnesLSL.parcourir((aValeurColonneLSL) => {
					if (aValeurColonneLSL.getNumero() === lNumeroDeColonne) {
						lValeurColonneConcernee = aValeurColonneLSL;
						return false;
					}
				});
			}
		}
		return lValeurColonneConcernee;
	}
	_getNiveauDeColonneLSL(aColonneId, D) {
		const lValeurColonneLSL =
			DonneesListe_ReleveDEvaluations._getValeurColonneLSL(aColonneId, D);
		return lValeurColonneLSL ? lValeurColonneLSL.niveau : null;
	}
	_getAppreciation(aColonneId, D) {
		let lAppreciation = "";
		const lObjAppreciation =
			DonneesListe_ReleveDEvaluations.getObjetAppreciation(aColonneId, D);
		if (!!lObjAppreciation && !!lObjAppreciation.valeur) {
			lAppreciation = lObjAppreciation.valeur;
		}
		return lAppreciation;
	}
	_getValeurColonneEleve(aEleve, aAvecProjetsAccompagnement) {
		const lHtmlEleve = [];
		if (!!aEleve) {
			const lHtmlProjAcc = [];
			if (aAvecProjetsAccompagnement) {
				const lHintProjetAcc = aEleve.projetsAccompagnement || "";
				const lAvecPiecesJointes = !!aEleve.avecDocsProjetsAccompagnement;
				if (lHintProjetAcc.length > 0 || lAvecPiecesJointes) {
					const lClasses = ["AlignementMilieuVertical", "InlineBlock"];
					if (lAvecPiecesJointes) {
						lClasses.push("AvecMain");
					}
					lHtmlProjAcc.push(
						IE.jsx.str(
							"span",
							{
								"ie-tooltiplabel": lHintProjetAcc,
								class: lClasses.join(" "),
								style: "float: right;",
								"ie-node": this.jsxNodePiecesJointesProjetAccompagnement.bind(
									this,
									aEleve,
								),
								tabindex: lAvecPiecesJointes ? 0 : null,
							},
							IE.jsx.str("i", {
								class: "icon_projet_accompagnement Texte12",
								role: "presentation",
							}),
						),
					);
				}
			}
			let lMargeReserveeProjetAcc = 0;
			if (lHtmlProjAcc.length > 0) {
				lMargeReserveeProjetAcc = 20;
			}
			lHtmlEleve.push(
				'<span class="AlignementMilieuVertical InlineBlock" style="width: calc(100% - ',
				lMargeReserveeProjetAcc,
				'px);">',
				aEleve.getLibelle(),
				"</span>",
			);
			lHtmlEleve.push(lHtmlProjAcc.join(""));
		}
		return lHtmlEleve.join("");
	}
	_getCacheOrdreNiveauDAcquisition() {
		const lOrdre =
			Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.ordre();
		const lHash = {};
		lOrdre.forEach((aEnumere, aIndex) => {
			lHash[aEnumere] = aIndex;
		});
		return lHash;
	}
	_triNivAcquisition(aCacheOrdreNiveauDAcqui, aNiveauAcqui) {
		if (!!aNiveauAcqui && !aNiveauAcqui.estImpossible) {
			const lGenre = aNiveauAcqui.getGenre();
			return aCacheOrdreNiveauDAcqui[lGenre] === undefined
				? Number.MAX_VALUE
				: aCacheOrdreNiveauDAcqui[lGenre];
		}
		return Number.MAX_VALUE;
	}
}
exports.DonneesListe_ReleveDEvaluations = DonneesListe_ReleveDEvaluations;
DonneesListe_ReleveDEvaluations.colonnes = {
	eleve: "RDE_eleve",
	synthese: "RDE_synthese",
	evolution: "RDE_evolution",
	percent_acquisition: "RDE_percent_acquisition",
	prefixe_posPrecedent: "RDE_pos_lsu_niveau_prec_",
	prefixe_simulation: "RDE_simulations_",
	pos_lsu_niveau: "RDE_pos_lsu_niveau",
	pos_lsu_note: "RDE_pos_lsu_note",
	niv_acqui_domaine: "RDE_niv_acqui_domaine",
	prefixe_evaluation: "RDE_evaluation_",
	prefixe_appreciations: "RDE_appreciations_",
	prefixe_LSL_jauge: "RDE_LSL_jauge_",
	prefixe_LSL_niveau: "RDE_LSL_niveau_",
};
