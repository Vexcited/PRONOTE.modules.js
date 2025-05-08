const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_DocumentsEleve,
} = require("ObjetFenetre_DocumentsEleve.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	EGenreNiveauDAcquisition,
	EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { EGenreAnnotation } = require("Enumere_Annotation.js");
const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEvolutionUtil } = require("Enumere_Evolution.js");
class DonneesListe_ReleveDEvaluations extends ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.param = Object.assign(
			{
				tailleMaxAppreciation: 255,
				initMenuContextuel: null,
				avecAssistantSaisie: false,
				affichageModeMultiLigne: true,
				affichageJaugeChronologique: false,
				affichageProjetsAccompagnement: true,
				callbackClicJauge: null,
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
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			surClicPiecesJointesProjAcc(aNoEleve) {
				const lEleve = aDonneesListe.Donnees.getElementParNumero(aNoEleve);
				if (!!lEleve && !!lEleve.avecDocsProjetsAccompagnement) {
					const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_DocumentsEleve,
						{ pere: aListe },
					);
					lInstanceFenetre.setDonnees(lEleve);
				}
			},
			nodeJaugeColonneLSL(aNumeroEleve, aIdColonne) {
				const lEleveConcerne =
					aDonneesListe.Donnees.getElementParNumero(aNumeroEleve);
				const lValeurColonneLSL = _getValeurColonneLSL(
					aIdColonne,
					lEleveConcerne,
				);
				$(this.node).on("click", () => {
					if (!!aDonneesListe.param.callbackClicJauge) {
						aDonneesListe.param.callbackClicJauge(
							lEleveConcerne,
							lValeurColonneLSL,
						);
					}
				});
			},
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
			lIndex = _getIndexDeColonne(
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
		return _getIndexDeColonne(
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
		return _getValeurColonneLSL(aColonneId, D);
	}
	static estUneColonneLSLNiveau(aColonneId) {
		return _estUneColonneLSLNiveau(aColonneId);
	}
	avecContenuTronque() {
		return !this.param.affichageModeMultiLigne;
	}
	getTypeValeur(aParams) {
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
				aParams.idColonne,
			) ||
			_estUneColonneSimulation(aParams.idColonne) ||
			_estUneColonnePositionnementPrecedent(aParams.idColonne) ||
			_estUneColonneLSL(aParams.idColonne)
		) {
			return ObjetDonneesListe.ETypeCellule.Html;
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			return ObjetDonneesListe.ETypeCellule.ZoneTexte;
		}
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.eleve:
			case DonneesListe_ReleveDEvaluations.colonnes.evolution:
			case DonneesListe_ReleveDEvaluations.colonnes.synthese:
			case DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine:
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau:
				return ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				return ObjetDonneesListe.ETypeCellule.Note;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
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
			_estUneColonneSimulation(aParams.idColonne) ||
			_estUneColonnePositionnementPrecedent(aParams.idColonne) ||
			_estUneColonneLSLNiveau(aParams.idColonne)
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
				GEtatUtilisateur.assistantSaisieActif
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
				EGenreAnnotation.absent,
				EGenreAnnotation.dispense,
				EGenreAnnotation.nonNote,
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
			const lNiveau = _getNiveauDAcquiDeColonneEvaluation.call(
				this,
				aParams.idColonne,
				aParams.article,
			);
			return lNiveau ? !!lNiveau.estEditable : false;
		} else if (_estUneColonneLSLNiveau(aParams.idColonne)) {
			const lNiveauLSL = _getNiveauDeColonneLSL(
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
		} else if (_estUneColonneLSLNiveau(aParams.idColonne)) {
			return this.avecEdition(aParams);
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			return this.avecEdition(aParams) && GEtatUtilisateur.assistantSaisieActif;
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
				lObjetAppreciation.setEtat(EGenreEtat.Modification);
				aParams.article.setEtat(EGenreEtat.Modification);
			}
		}
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				aParams.article.posLSUNote = aParams.valeur;
				aParams.article.setEtat(EGenreEtat.Modification);
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
					return _getValeurColonneEleve(
						aParams.article,
						this.param.affichageProjetsAccompagnement,
					);
				}
			case DonneesListe_ReleveDEvaluations.colonnes.synthese:
				if (this.param.affichageJaugeChronologique) {
					if (lSurExportCSV) {
						return TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
							aParams.article.listeNiveauxSyntheseChrono,
						);
					} else {
						return TUtilitaireCompetences.composeJaugeChronologique({
							listeNiveaux: aParams.article.listeNiveauxSyntheseChrono,
							hint: aParams.article.hintSyntheseChrono,
						});
					}
				} else {
					if (lSurExportCSV) {
						return TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
							aParams.article.listeNiveauxSyntheseParNiveau,
						);
					} else {
						return TUtilitaireCompetences.composeJaugeParNiveaux({
							listeNiveaux: aParams.article.listeNiveauxSyntheseParNiveau,
							hint: aParams.article.hintSyntheseParNiveau,
						});
					}
				}
			case DonneesListe_ReleveDEvaluations.colonnes.evolution:
				return EGenreEvolutionUtil.getImage(
					!!aParams.article.evolution
						? aParams.article.evolution.getGenre()
						: 0,
				);
			case DonneesListe_ReleveDEvaluations.colonnes.percent_acquisition:
				return aParams.article.percentAcqui || "";
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau:
				if (!!aParams.article.posLSUNiveau) {
					if (lSurExportCSV) {
						return EGenreNiveauDAcquisitionUtil.getAbbreviation(
							aParams.article.posLSUNiveau,
							aParams.article.genrePositionnementSansNote,
						);
					} else {
						return EGenreNiveauDAcquisitionUtil.getImagePositionnement({
							niveauDAcquisition: aParams.article.posLSUNiveau,
							genrePositionnement: aParams.article.genrePositionnementSansNote,
						});
					}
				}
				return "";
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				return aParams.article.posLSUNote;
			case DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine: {
				let lResultNivAcquiPilier = "";
				const lNiveauAcquiPilier = aParams.article.nivAcquiPilier;
				if (!!lNiveauAcquiPilier) {
					lResultNivAcquiPilier += EGenreNiveauDAcquisitionUtil.getImage(
						lNiveauAcquiPilier,
						{ avecTitle: false },
					);
					if (lNiveauAcquiPilier.observation) {
						lResultNivAcquiPilier +=
							'<i style="position:absolute; right:0px; bottom:0px;" class=" icon_info_sign"></i>';
					}
				}
				if (lSurExportCSV) {
					return EGenreNiveauDAcquisitionUtil.getAbbreviation(
						lNiveauAcquiPilier,
						{ avecTitle: false },
					);
				} else {
					return lResultNivAcquiPilier;
				}
			}
		}
		if (_estUneColonnePositionnementPrecedent(aParams.idColonne)) {
			let lResultPosPrecedent = "";
			const lNiveauPosPrecedent =
				_getNiveauDAcquiDeColonnePositionnementPrecedent(
					aParams.idColonne,
					aParams.article,
				);
			if (!!lNiveauPosPrecedent) {
				lResultPosPrecedent =
					EGenreNiveauDAcquisitionUtil.getImagePositionnement({
						niveauDAcquisition: lNiveauPosPrecedent,
						genrePositionnement: aParams.article.genrePositionnementSansNote,
					});
			}
			if (lSurExportCSV) {
				return EGenreNiveauDAcquisitionUtil.getAbbreviation(
					lNiveauPosPrecedent,
					aParams.article.genrePositionnementSansNote,
				);
			} else {
				return lResultPosPrecedent;
			}
		} else if (_estUneColonneSimulation(aParams.idColonne)) {
			let lResultSimulation = "-";
			const lNiveauSimu = _getNiveauDAcquiDeColonneSimulation(
				aParams.idColonne,
				aParams.article,
			);
			if (!!lNiveauSimu) {
				const lAffichagePastillesPositionnement =
					!!aParams.declarationColonne.affichagePastillesDePositionnenment;
				if (lAffichagePastillesPositionnement) {
					lResultSimulation =
						EGenreNiveauDAcquisitionUtil.getImagePositionnement({
							niveauDAcquisition: lNiveauSimu,
							genrePositionnement: aParams.article.genrePositionnementSansNote,
						});
				} else {
					lResultSimulation =
						EGenreNiveauDAcquisitionUtil.getImage(lNiveauSimu);
				}
			}
			if (lSurExportCSV) {
				return EGenreNiveauDAcquisitionUtil.getAbbreviation(
					lNiveauSimu,
					aParams.article.genrePositionnementSansNote,
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
			const lNiveau = _getNiveauDAcquiDeColonneEvaluation.call(
				this,
				aParams.idColonne,
				aParams.article,
			);
			if (!!lNiveau) {
				if (lSurExportCSV) {
					lResultNivAcqui = EGenreNiveauDAcquisitionUtil.getAbbreviation(
						lNiveau,
						{ avecTitle: false },
					);
				} else if (lNiveau.estImpossible) {
					lResultNivAcqui = lNiveau.libelleImpossible;
				} else {
					lResultNivAcqui += EGenreNiveauDAcquisitionUtil.getImage(lNiveau, {
						avecTitle: false,
					});
					if (
						lNiveau.getGenre() >= EGenreNiveauDAcquisition.Expert &&
						lNiveau.observation
					) {
						lResultNivAcqui +=
							'<i style="position:absolute; right:0px; bottom:0px;" class=" icon_comment"></i>';
					}
				}
			}
			return lResultNivAcqui;
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			const lAppreciation = _getAppreciation.call(
				this,
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
		} else if (_estUneColonneLSLJauge(aParams.idColonne)) {
			const lValeurColonneLSL = _getValeurColonneLSL(
				aParams.idColonne,
				aParams.article,
			);
			if (lValeurColonneLSL && lValeurColonneLSL.listeNiveauxDAcquisitions) {
				const lHtmlJauges = [];
				lHtmlJauges.push(
					'<div class="AvecMain" ie-node="nodeJaugeColonneLSL(\'',
					aParams.article.getNumero(),
					"', '",
					aParams.idColonne,
					"')\">",
				);
				lHtmlJauges.push(
					TUtilitaireCompetences.composeJaugeParNiveaux({
						listeNiveaux: lValeurColonneLSL.listeNiveauxDAcquisitions,
						hint: lValeurColonneLSL.hintNiveauxDAcquisitions,
					}),
				);
				lHtmlJauges.push("</div>");
				return lHtmlJauges.join("");
			}
		} else if (_estUneColonneLSLNiveau(aParams.idColonne)) {
			const lNiveauColonneLSL = _getNiveauDeColonneLSL(
				aParams.idColonne,
				aParams.article,
			);
			if (lNiveauColonneLSL) {
				if (!!lNiveauColonneLSL.estImpossible) {
					return lNiveauColonneLSL.libelleImpossible || "";
				} else {
					return EGenreNiveauDAcquisitionUtil.getImage(lNiveauColonneLSL, {
						avecTitle: false,
					});
				}
			}
		}
		return "";
	}
	getHintHtmlForce(aParams) {
		if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
				aParams.idColonne,
			)
		) {
			const lNiveauAcquisitionEleve = _getNiveauDAcquiDeColonneEvaluation.call(
				this,
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
					MethodesObjet.isArray(aParams.declarationColonne.titre)
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
					lNiveauAcquisitionEleve.getGenre() >= EGenreNiveauDAcquisition.Expert
				) {
					lObservationEleve = lNiveauAcquisitionEleve.observation.replace(
						/\n/g,
						"<br/>",
					);
					if (!!lNiveauAcquisitionEleve.observationPubliee) {
						lObservationEleve +=
							" (" +
							GTraductions.getValeur("competences.PublieSurEspaceParent") +
							")";
					}
				}
				return GChaine.toTitle(
					TUtilitaireCompetences.composeHintEvaluationEleve({
						libelleEleve: aParams.article.getLibelle(),
						estSaisieClotureePourEleve:
							!!lNiveauAcquisitionEleve.estSurPeriodeCloturee,
						hintCompetence: lHintCompetenceColonne,
						niveauDAcquisition: lNiveauAcquisitionEleve,
						observation: lObservationEleve,
					}),
				);
			}
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
				aParams.idColonne,
			)
		) {
			return _getAppreciation.call(this, aParams.idColonne, aParams.article);
		} else if (_estUneColonneLSLNiveau(aParams.idColonne)) {
			const lNiveauColonneLSL = _getNiveauDeColonneLSL(
				aParams.idColonne,
				aParams.article,
			);
			if (lNiveauColonneLSL && lNiveauColonneLSL.estImpossible) {
				return lNiveauColonneLSL.hintImpossible || "";
			}
		}
		return "";
	}
	getHintForce(aParams) {
		let lNiveau;
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
				if (!!aParams.article.posLSUNote) {
					if (aParams.article.posLSUNote.estUneValeur()) {
						return aParams.article.posLSUNote.getValeur();
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
							EGenreNiveauDAcquisitionUtil.getLibelle(lNiveau);
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
			const lAppreciation = _getAppreciation.call(
				this,
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
		}
		return "";
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lThis = this;
		const lCacheOrdreNiveauDAcqui = _getCacheOrdreNiveauDAcquisition();
		const lColonneId = this.getId(aColonneDeTri);
		const lTris = [];
		if (_estUneColonnePositionnementPrecedent(lColonneId)) {
			lTris.push(
				ObjetTri.init((D) => {
					const lNiveau = _getNiveauDAcquiDeColonnePositionnementPrecedent(
						lColonneId,
						D,
					);
					return _triNivAcquisition(lCacheOrdreNiveauDAcqui, lNiveau);
				}, aGenreTri),
			);
		} else if (_estUneColonneSimulation(lColonneId)) {
			lTris.push(
				ObjetTri.init((D) => {
					const lNiveau = _getNiveauDAcquiDeColonneSimulation(lColonneId, D);
					return _triNivAcquisition(lCacheOrdreNiveauDAcqui, lNiveau);
				}, aGenreTri),
			);
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(lColonneId)
		) {
			lTris.push(
				ObjetTri.init((D) => {
					const lNiveau = _getNiveauDAcquiDeColonneEvaluation.call(
						lThis,
						lColonneId,
						D,
					);
					return _triNivAcquisition(lCacheOrdreNiveauDAcqui, lNiveau);
				}, aGenreTri),
			);
		} else if (
			DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(lColonneId)
		) {
			lTris.push(
				ObjetTri.init(
					(D) => {
						return !!DonneesListe_ReleveDEvaluations.getObjetAppreciation(
							lColonneId,
							D,
						)
							? 1
							: 0;
					},
					aGenreTri === EGenreTriElement.Croissant
						? EGenreTriElement.Decroissant
						: EGenreTriElement.Croissant,
				),
			);
			lTris.push(
				ObjetTri.init(
					this.getValeurPourTri.bind(this, aColonneDeTri),
					aGenreTri,
				),
			);
		} else {
			switch (lColonneId) {
				case DonneesListe_ReleveDEvaluations.colonnes.eleve:
					lTris.push(ObjetTri.init("Position", aGenreTri));
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.synthese:
					lTris.push(
						ObjetTri.init(
							(D) => {
								return D.moyenneSynthese && D.moyenneSynthese.estUneValeur()
									? D.moyenneSynthese.getValeur()
									: 0;
							},
							aGenreTri === EGenreTriElement.Croissant
								? EGenreTriElement.Decroissant
								: EGenreTriElement.Croissant,
						),
					);
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.percent_acquisition:
					lTris.push(
						ObjetTri.init(
							(D) => {
								const lValueCell = lThis.getValeurPourTri(aColonneDeTri, D);
								return !!lValueCell ? parseFloat(lValueCell) || 0 : -1;
							},
							aGenreTri === EGenreTriElement.Croissant
								? EGenreTriElement.Decroissant
								: EGenreTriElement.Croissant,
						),
					);
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau:
					lTris.push(
						ObjetTri.init((D) => {
							return _triNivAcquisition(
								lCacheOrdreNiveauDAcqui,
								D.posLSUNiveau,
							);
						}, aGenreTri),
					);
					break;
				case DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note:
					lTris.push(
						ObjetTri.init((D) => {
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
						ObjetTri.init((D) => {
							return _triNivAcquisition(
								lCacheOrdreNiveauDAcqui,
								D.nivAcquiPilier,
							);
						}, aGenreTri),
					);
					break;
			}
		}
		if (lColonneId !== DonneesListe_ReleveDEvaluations.colonnes.eleve) {
			lTris.push(ObjetTri.init("Position", EGenreTriElement.Croissant));
		}
		return lTris;
	}
	remplirMenuContextuel(aParams) {
		this.param.initMenuContextuel(aParams);
	}
}
const lPrefixeLSL = "RDE_LSL_";
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
	prefixe_LSL_jauge: lPrefixeLSL + "jauge_",
	prefixe_LSL_niveau: lPrefixeLSL + "niveau_",
};
function _getSuffixeDeColonne(aColonneId, aPrefixeColonne) {
	return aColonneId.substring(aPrefixeColonne.length, aColonneId.length);
}
function _getIndexDeColonne(aColonneId, aPrefixeColonne) {
	let result = -1;
	if (aColonneId) {
		const lStrIndex = _getSuffixeDeColonne(aColonneId, aPrefixeColonne);
		if (!!lStrIndex) {
			result = parseInt(lStrIndex, 10);
		}
	}
	return result;
}
function _estUneColonnePositionnementPrecedent(aColonneId) {
	return (
		aColonneId &&
		aColonneId.indexOf(
			DonneesListe_ReleveDEvaluations.colonnes.prefixe_posPrecedent,
		) === 0
	);
}
function _getNiveauDAcquiDeColonnePositionnementPrecedent(aColonneId, D) {
	let result = null;
	if (!!D.posPrecedents) {
		const lIndex = _getIndexDeColonne(
			aColonneId,
			DonneesListe_ReleveDEvaluations.colonnes.prefixe_posPrecedent,
		);
		result = D.posPrecedents.get(lIndex);
	}
	return result;
}
function _estUneColonneSimulation(aColonneId) {
	return (
		aColonneId &&
		aColonneId.indexOf(
			DonneesListe_ReleveDEvaluations.colonnes.prefixe_simulation,
		) === 0
	);
}
function _getNiveauDAcquiDeColonneSimulation(aColonneId, D) {
	let result = null;
	if (!!D.simulations) {
		const lIndex = _getIndexDeColonne(
			aColonneId,
			DonneesListe_ReleveDEvaluations.colonnes.prefixe_simulation,
		);
		result = D.simulations.get(lIndex);
	}
	return result;
}
function _getNiveauDAcquiDeColonneEvaluation(aColonneId, D) {
	const lIndex =
		DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(aColonneId);
	return D.listeNiveauxDAcquisitions.get(lIndex);
}
function _estUneColonneLSL(aColonneId) {
	return (
		_estUneColonneLSLJauge(aColonneId) || _estUneColonneLSLNiveau(aColonneId)
	);
}
function _estUneColonneLSLJauge(aColonneId) {
	return (
		aColonneId &&
		aColonneId.indexOf(
			DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_jauge,
		) === 0
	);
}
function _estUneColonneLSLNiveau(aColonneId) {
	return (
		aColonneId &&
		aColonneId.indexOf(
			DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_niveau,
		) === 0
	);
}
function _getValeurColonneLSL(aColonneId, D) {
	let lValeurColonneConcernee;
	if (D.listeValeursColonnesLSL) {
		let lPrefixeColonneId;
		if (_estUneColonneLSLJauge(aColonneId)) {
			lPrefixeColonneId =
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_jauge;
		} else if (_estUneColonneLSLNiveau(aColonneId)) {
			lPrefixeColonneId =
				DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_niveau;
		}
		if (lPrefixeColonneId) {
			const lNumeroDeColonne = _getSuffixeDeColonne(
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
function _getNiveauDeColonneLSL(aColonneId, D) {
	const lValeurColonneLSL = _getValeurColonneLSL(aColonneId, D);
	return lValeurColonneLSL ? lValeurColonneLSL.niveau : null;
}
function _getAppreciation(aColonneId, D) {
	let lAppreciation = "";
	const lObjAppreciation = DonneesListe_ReleveDEvaluations.getObjetAppreciation(
		aColonneId,
		D,
	);
	if (!!lObjAppreciation && !!lObjAppreciation.valeur) {
		lAppreciation = lObjAppreciation.valeur;
	}
	return lAppreciation;
}
function _getValeurColonneEleve(aEleve, aAvecProjetsAccompagnement) {
	const lHtmlEleve = [];
	if (!!aEleve) {
		const lHtmlProjAcc = [];
		if (aAvecProjetsAccompagnement) {
			const lHintProjetAcc = !!aEleve.projetsAccompagnement
				? aEleve.projetsAccompagnement.replace(/\n/g, "<br/>")
				: "";
			const lAvecPiecesJointes = !!aEleve.avecDocsProjetsAccompagnement;
			if (lHintProjetAcc.length > 0 || lAvecPiecesJointes) {
				let lPropertyEventClic = "";
				const lClasses = ["AlignementMilieuVertical", "InlineBlock"];
				if (lAvecPiecesJointes) {
					lClasses.push("AvecMain");
					lPropertyEventClic =
						" ie-event=\"click->surClicPiecesJointesProjAcc('" +
						aEleve.getNumero() +
						"')\"";
				}
				lHtmlProjAcc.push(
					"<span ",
					GHtml.composeAttr("ie-hint", "'" + lHintProjetAcc + "'"),
					' class="',
					lClasses.join(" "),
					'"',
					lPropertyEventClic,
					' style="float: right;"><i class="icon_projet_accompagnement Texte12"></i></span>',
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
function _getCacheOrdreNiveauDAcquisition() {
	const lOrdre = EGenreNiveauDAcquisitionUtil.ordre(),
		lHash = {};
	lOrdre.forEach((aEnumere, aIndex) => {
		lHash[aEnumere] = aIndex;
	});
	return lHash;
}
function _triNivAcquisition(aCacheOrdreNiveauDAcqui, aNiveauAcqui) {
	if (!!aNiveauAcqui && !aNiveauAcqui.estImpossible) {
		const lGenre = aNiveauAcqui.getGenre();
		return aCacheOrdreNiveauDAcqui[lGenre] === undefined
			? Number.MAX_VALUE
			: aCacheOrdreNiveauDAcqui[lGenre];
	}
	return Number.MAX_VALUE;
}
module.exports = { DonneesListe_ReleveDEvaluations };
