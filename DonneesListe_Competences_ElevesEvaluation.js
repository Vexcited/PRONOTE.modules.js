const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	EGenreNiveauDAcquisition,
	EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { ObjetUtilitaireEvaluation } = require("ObjetUtilitaireEvaluation.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeArrondi } = require("TypeArrondi.js");
const { TypeNote } = require("TypeNote.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_DocumentsEleve,
} = require("ObjetFenetre_DocumentsEleve.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { GHtml } = require("ObjetHtml.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { MoteurNotes } = require("MoteurNotes.js");
class DonneesListe_Competences_ElevesEvaluation extends ObjetDonneesListe {
	constructor(aDonnees, aOptionsAffichage) {
		super(_construireListe.call(aDonnees));
		this.moteurNotes = new MoteurNotes();
		this.moteurNotesCP = new MoteurNotesCP(this.moteurNotes);
		this.donnees = Object.assign(
			{
				eleves: null,
				competences: null,
				initMenuContextuel: null,
				avecSaisie: false,
				evaluation: null,
				droitSaisieNotes: false,
				baremeDevoirParDefaut: null,
				afficherCommentaireSurNote: false,
				devoir: null,
			},
			aDonnees,
		);
		this.setOptions({
			avecEvnt_Selection: true,
			avecSuppression: false,
			editionApresSelection: false,
			avecEvnt_KeyPressListe: true,
			avecMultiSelection: true,
			avecEtatSaisie: false,
			avecSelectionSurNavigationClavier: true,
		});
		this.optionsAffichage = {
			avecOptionAfficherProjetsAcc: true,
			afficherProjetsAccompagnement: false,
		};
		this.setOptionsAffichage(aOptionsAffichage);
	}
	setOptionsAffichage(aOptionsAffichage) {
		Object.assign(this.optionsAffichage, aOptionsAffichage);
	}
	getPourcentageReussite(aIndexColonneCompetence) {
		let lNbElevesAcquis = null;
		let lNbElevesTotal = 0;
		const lThis = this;
		this.Donnees.parcourir((aArticle) => {
			if (!!aArticle && !!aArticle.colonnesCompetences) {
				const lInfosColonneCompetence =
					aArticle.colonnesCompetences[
						DonneesListe_Competences_ElevesEvaluation.colonnes
							.prefixe_competence + aIndexColonneCompetence
					];
				if (!!lInfosColonneCompetence) {
					const lCompetence = lInfosColonneCompetence.competence;
					if (
						!!lCompetence &&
						!!lCompetence.niveauDAcquisition &&
						TUtilitaireCompetences.estNotantPourTxReussiteEvaluation(
							lCompetence.niveauDAcquisition,
						)
					) {
						lNbElevesTotal++;
						if (
							aArticle.eleve.estSortiDeLaClasse ||
							_eleveSortiDeLEtab.call(lThis.donnees, aArticle.eleve) ||
							lCompetence.competenceNonAffecteeClasseEleve
						) {
							lNbElevesTotal--;
						}
						if (lNbElevesAcquis === null) {
							lNbElevesAcquis = 0;
						}
						if (
							TUtilitaireCompetences.estNiveauAcqui(
								lCompetence.niveauDAcquisition,
							)
						) {
							lNbElevesAcquis++;
						}
					}
				}
			}
		});
		let lValeurPourcentage = null;
		if (lNbElevesAcquis !== null) {
			if (lNbElevesTotal === 0) {
				lValeurPourcentage = 0;
			} else {
				lValeurPourcentage =
					Math.round((lNbElevesAcquis / lNbElevesTotal) * 1000) / 10;
			}
		}
		return lValeurPourcentage;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			surClicPiecesJointesProjAcc: function (aNoEleve) {
				const lArticle = aInstance.Donnees.getElementParNumero(aNoEleve);
				if (
					!!lArticle &&
					!!lArticle.eleve &&
					!!lArticle.eleve.avecDocsProjetsAccompagnement
				) {
					const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_DocumentsEleve,
						{ pere: aInstance },
					);
					lInstanceFenetre.setDonnees(lArticle.eleve);
				}
			},
		});
	}
	static estUneColonneCompetence(aColonneId) {
		return (
			!!aColonneId &&
			aColonneId.indexOf(
				DonneesListe_Competences_ElevesEvaluation.colonnes.prefixe_competence,
			) === 0
		);
	}
	getValeur(aParams) {
		const lEleve = aParams.article.eleve;
		if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.eleve
		) {
			return _getValeurColonneEleve.call(this, lEleve);
		} else if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.classe
		) {
			return lEleve && lEleve.classe ? lEleve.classe.getLibelle() : "";
		} else if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.notes
		) {
			let result = null;
			if (!!lEleve) {
				if (
					lEleve.estSortiDeLaClasse ||
					_eleveSortiDeLEtab.call(this.donnees, lEleve)
				) {
					result = "X";
				} else if (!!lEleve.note || !!lEleve.Note) {
					if (
						_laNoteEstConsidereeCommeUnBonus.call(this, lEleve) &&
						!aParams.surEdition
					) {
						if (lEleve.note) {
							result = "(" + lEleve.note.getNote() + ")";
						} else if (lEleve.Note) {
							result = "(" + lEleve.Note.getNote() + ")";
						}
					} else {
						result = lEleve.note || lEleve.Note;
					}
				}
			}
			if (!_laColonneNoteEstEditable.call(this, lEleve) && !result) {
				result = "";
			}
			return result;
		} else if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.commentaireSurNote
		) {
			return (lEleve && lEleve.commentaire) || "";
		} else {
			const lContenuCelluleCompetence = [];
			const lInfosColonneCompetence =
				aParams.article.colonnesCompetences[aParams.idColonne];
			const lCompetence = lInfosColonneCompetence.competence;
			if (
				aParams.article.eleve.estSortiDeLaClasse ||
				_eleveSortiDeLEtab.call(this.donnees, aParams.article.eleve) ||
				!lCompetence ||
				(lCompetence.competenceNonAffecteeClasseEleve &&
					this.donnees.evaluation &&
					this.donnees.evaluation.getGenre() !==
						EGenreRessource.EvaluationHistorique) ||
				!lCompetence.estEditableSelonNiveauClasseEleve
			) {
				lContenuCelluleCompetence.push("X");
			} else if (lCompetence.niveauDAcquisition) {
				let lNiveauAcquisitionGlobal = null;
				if (GParametres.listeNiveauxDAcquisitions) {
					lNiveauAcquisitionGlobal =
						GParametres.listeNiveauxDAcquisitions.getElementParNumero(
							lCompetence.niveauDAcquisition.getNumero(),
						);
				}
				if (!!lNiveauAcquisitionGlobal) {
					lContenuCelluleCompetence.push(
						EGenreNiveauDAcquisitionUtil.getImage(lNiveauAcquisitionGlobal, {
							avecTitle: false,
						}),
					);
				}
				if (
					lCompetence.niveauDAcquisition.getGenre() >=
						EGenreNiveauDAcquisition.Expert &&
					lCompetence.observation
				) {
					lContenuCelluleCompetence.push(
						'<i style="position:absolute; right:0px; bottom:0px;" class=" icon_comment"></i>',
					);
				}
			}
			return lContenuCelluleCompetence.join("");
		}
	}
	getHintHtmlForce(aParams) {
		let result = "";
		if (
			_eleveSortiDeLEtab.call(this.donnees, aParams.article.eleve) &&
			this.donnees.evaluation &&
			this.donnees.evaluation.getGenre() !==
				EGenreRessource.EvaluationHistorique
		) {
			result = GTraductions.getValeur("competences.EleveHorsEtablissement");
		} else {
			if (aParams.article.eleve.estSortiDeLaClasse) {
				result =
					GEtatUtilisateur.Navigation.getGenreRessource(
						EGenreRessource.Classe,
					) === EGenreRessource.Classe
						? GTraductions.getValeur("competences.EleveHorsClasse")
						: GTraductions.getValeur("competences.EleveHorsGroupe");
			} else {
				if (
					DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
						aParams.idColonne,
					)
				) {
					const lInfosColonneCompetence =
						aParams.article.colonnesCompetences[aParams.idColonne];
					const lCompetence = lInfosColonneCompetence.competence;
					if (
						lCompetence.competenceNonAffecteeClasseEleve &&
						this.donnees.evaluation &&
						this.donnees.evaluation.getGenre() !==
							EGenreRessource.EvaluationHistorique
					) {
						result =
							aParams.article.eleve.getLibelle() +
							" (" +
							GTraductions.getValeur(
								"competences.CompetenceNonAffecteeAClasse",
							) +
							")";
					} else if (!lCompetence.estEditableSelonNiveauClasseEleve) {
						result =
							aParams.article.eleve.getLibelle() +
							" (" +
							GTraductions.getValeur(
								"competences.EleveNiveauClasseNonCompatible",
							) +
							")";
					} else {
						let lObservationEleve = !!lCompetence.observation
							? lCompetence.observation.replace(/\n/g, "<br/>")
							: "";
						if (!!lObservationEleve && !!lCompetence.observationPubliee) {
							lObservationEleve +=
								" (" +
								GTraductions.getValeur("competences.PublieSurEspaceParent") +
								")";
						}
						result += GChaine.toTitle(
							TUtilitaireCompetences.composeHintEvaluationEleve({
								libelleEleve: aParams.article.eleve.getLibelle(),
								estSaisieClotureePourEleve:
									!!aParams.article.eleve.estSaisieEvaluationCloturee,
								hintCompetence:
									TUtilitaireCompetences.composeTitleEvaluation(lCompetence),
								niveauDAcquisition: lCompetence.niveauDAcquisition,
								observation: lObservationEleve,
							}),
						);
						if (
							!!lCompetence.informationQCM &&
							!!lCompetence.informationQCM.listeQuestions &&
							lCompetence.informationQCM.listeQuestions.count() > 0
						) {
							const lStrReponseEleveQuestionsQCM = [];
							const lTypeNumerotationQCM =
								lCompetence.informationQCM.typeNumerotation;
							lCompetence.informationQCM.listeQuestions.parcourir(
								(aQuestionQCM) => {
									let lReponseEleve;
									if (!!lCompetence.listeReponsesQCM) {
										lReponseEleve =
											lCompetence.listeReponsesQCM.getElementParNumero(
												aQuestionQCM.getNumero(),
											);
									}
									if (!!lReponseEleve) {
										lStrReponseEleveQuestionsQCM.push(
											UtilitaireQCM.composeHintReponsesEleveDeQuestionQCM(
												aQuestionQCM.getPosition(),
												aQuestionQCM,
												lReponseEleve,
												{
													typeNumerotationQCM: lTypeNumerotationQCM,
													avecAffichageNote: !GEtatUtilisateur.pourPrimaire(),
												},
											),
										);
									}
								},
							);
							if (lStrReponseEleveQuestionsQCM.length > 0) {
								result +=
									"<br><br>" + lStrReponseEleveQuestionsQCM.join("<br>");
							}
						}
					}
				} else if (
					aParams.idColonne ===
					DonneesListe_Competences_ElevesEvaluation.colonnes.notes
				) {
					const lTitleCelluleNoteEleve = [];
					lTitleCelluleNoteEleve.push(
						"<b>",
						aParams.article.eleve.getLibelle(),
						"</b>",
					);
					if (aParams.article.eleve.estSaisieNotationCloturee) {
						lTitleCelluleNoteEleve.push("<br/><br/>");
						lTitleCelluleNoteEleve.push(
							GTraductions.getValeur(
								"competences.NotationClotureePourLaClasse",
							),
							'<i class="icon_lock m-left"></i>',
						);
					}
					if (!!this.donnees.devoir && !!this.donnees.devoir.hintDevoir) {
						lTitleCelluleNoteEleve.push("<br/><br/>");
						lTitleCelluleNoteEleve.push(this.donnees.devoir.hintDevoir);
					}
					if (!!aParams.article.eleve.note || !!aParams.article.eleve.Note) {
						lTitleCelluleNoteEleve.push("<br/><br/>");
						lTitleCelluleNoteEleve.push(
							"<b><u>",
							GTraductions.getValeur("competences.Note"),
							"</u></b> : ",
							aParams.article.eleve.note || aParams.article.eleve.Note,
						);
					}
					result = GChaine.toTitle(lTitleCelluleNoteEleve.join(""));
				}
			}
		}
		return result;
	}
	getTypeValeur(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.notes
		) {
			let lTypeCelluleNote = ObjetDonneesListe.ETypeCellule.Note;
			if (
				!_laColonneNoteEstEditable.call(this, aParams.article.eleve) ||
				(_laNoteEstConsidereeCommeUnBonus.call(this, aParams.article.eleve) &&
					!aParams.surEdition)
			) {
				lTypeCelluleNote = ObjetDonneesListe.ETypeCellule.Texte;
			}
			return lTypeCelluleNote;
		} else if (
			DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
				aParams.idColonne,
			)
		) {
			return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.notes
		) {
			if (!_laColonneNoteEstEditable.call(this, aParams.article.eleve)) {
				lClasses.push("AlignementMilieu");
			} else {
				lClasses.push("AlignementDroit");
			}
		} else if (
			DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
				aParams.idColonne,
			)
		) {
			lClasses.push("AlignementMilieu");
		}
		return lClasses.join(" ");
	}
	avecSelection(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.notes
		) {
			return this.avecEdition(aParams);
		} else if (
			DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
				aParams.idColonne,
			)
		) {
			return (
				aParams.article &&
				aParams.article.colonnesCompetences[aParams.idColonne].actif
			);
		} else if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.commentaireSurNote
		) {
			return this.avecEdition(aParams);
		}
		return false;
	}
	selectionParCellule(I) {
		return (
			this.getId(I) !== DonneesListe_Competences_ElevesEvaluation.colonnes.eleve
		);
	}
	avecEdition(aParams) {
		if (!this.donnees.avecSaisie) {
			if (
				aParams.idColonne !==
				DonneesListe_Competences_ElevesEvaluation.colonnes.commentaireSurNote
			) {
				return false;
			}
		}
		if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.notes
		) {
			return _laColonneNoteEstEditable.call(this, aParams.article.eleve);
		} else if (
			DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
				aParams.idColonne,
			)
		) {
			return (
				aParams.article &&
				aParams.article.colonnesCompetences[aParams.idColonne].editable
			);
		} else if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.commentaireSurNote
		) {
			let lAvecNote = false;
			if (aParams.article.eleve.note || aParams.article.eleve.Note) {
				lAvecNote = aParams.article.eleve.note
					? !aParams.article.eleve.note.estUneNoteVide()
					: !aParams.article.eleve.Note.estUneNoteVide();
			}
			return (
				_laColonneNoteEstEditable.call(this, aParams.article.eleve) && lAvecNote
			);
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		if (
			DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
				aParams.idColonne,
			)
		) {
			return this.avecEdition(aParams);
		}
		return false;
	}
	avecEvenementApresEdition(aParams) {
		return [
			DonneesListe_Competences_ElevesEvaluation.colonnes.notes,
			DonneesListe_Competences_ElevesEvaluation.colonnes.commentaireSurNote,
		].includes(aParams.idColonne);
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences_ElevesEvaluation.colonnes.notes:
				if (!!aParams.article.eleve) {
					const lFuncMiseAJourMoyenne = function () {
						this.donnees.devoir.moyenne = _calculMoyenneDevoir(
							this.Donnees,
							this.donnees.devoir,
							this.donnees.baremeDevoirParDefaut,
						);
					};
					const lBaremeDevoir = this.donnees.devoir.bareme;
					if (V.estUneNoteValide(new TypeNote(0), lBaremeDevoir, true, true)) {
						this._affecterNoteALEleve(aParams.article.eleve, V);
						lFuncMiseAJourMoyenne.call(this);
					} else {
						return this.moteurNotesCP
							.afficherConfirmationSaisieNoteAuDessusBareme(V, lBaremeDevoir)
							.then((aValider) => {
								if (aValider) {
									this._affecterNoteALEleve(aParams.article.eleve, V);
									lFuncMiseAJourMoyenne.call(this);
								} else {
									return { annulerEdition: true, enEditionSurCelllule: true };
								}
							});
					}
				}
				break;
			case DonneesListe_Competences_ElevesEvaluation.colonnes
				.commentaireSurNote:
				if (!aParams.article.eleve) {
					return;
				}
				aParams.article.eleve.commentaire = V;
				aParams.article.eleve.setEtat(EGenreEtat.Modification);
				break;
		}
	}
	autoriserChaineVideSurEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences_ElevesEvaluation.colonnes
				.commentaireSurNote:
				return true;
		}
		return false;
	}
	_affecterNoteALEleve(aEleve, aNote) {
		aEleve.note = aNote;
		aEleve.setEtat(EGenreEtat.Modification);
	}
	avecSaisieSuperieurAuBareme() {
		return true;
	}
	getOptionsNote() {
		let lMaxNote = this.moteurNotesCP.getBaremeDevoirMaximal();
		if (
			!!this.donnees.devoir &&
			!!this.donnees.devoir.bareme &&
			this.donnees.devoir.bareme.estUneValeur()
		) {
			if (!this.avecSaisieSuperieurAuBareme()) {
				lMaxNote = this.moteurNotesCP.getBaremeDuDevoir(this.donnees.devoir);
			}
		}
		return {
			afficherAvecVirgule: true,
			sansNotePossible: true,
			avecAnnotation: true,
			min: 0,
			max: lMaxNote,
		};
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences_ElevesEvaluation.colonnes.eleve:
				return GTraductions.getValeur("evaluations.moyenneDevoir");
			case DonneesListe_Competences_ElevesEvaluation.colonnes.notes: {
				let result = "";
				if (!!this.donnees.devoir) {
					if (!this.donnees.devoir.moyenne) {
						this.donnees.devoir.moyenne = _calculMoyenneDevoir(
							this.Donnees,
							this.donnees.devoir,
							this.donnees.baremeDevoirParDefaut,
						);
					}
					result = this.donnees.devoir.moyenne;
				}
				return result;
			}
		}
		return "";
	}
	getClassTotal() {
		return "AlignementDroit";
	}
	remplirMenuContextuel(aParametres) {
		this.donnees.initMenuContextuel(aParametres);
	}
	getTri(aColonne, aGenreTri) {
		const lTris = [],
			lIdColonne = this.getId(aColonne);
		if (
			lIdColonne === DonneesListe_Competences_ElevesEvaluation.colonnes.eleve
		) {
			lTris.push(ObjetTri.init("Position", aGenreTri));
		} else if (
			lIdColonne === DonneesListe_Competences_ElevesEvaluation.colonnes.classe
		) {
			lTris.push(ObjetTri.init("eleve.classe.Libelle", aGenreTri));
		} else if (
			lIdColonne === DonneesListe_Competences_ElevesEvaluation.colonnes.notes
		) {
			lTris.push(
				ObjetTri.init((D) => {
					let result = "";
					if (!!D && !!D.eleve && !!D.eleve.note) {
						if (D.eleve.note.estUneValeur()) {
							result = D.eleve.note.getValeur() * -1;
						} else {
							result = D.eleve.note.getGenre();
						}
					}
					return result;
				}, aGenreTri),
			);
		} else if (
			DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
				lIdColonne,
			)
		) {
			const lOrdre = EGenreNiveauDAcquisitionUtil.ordre(),
				lHash = {};
			lOrdre.forEach((aEnumere, aIndex) => {
				lHash[aEnumere] = aIndex;
			});
			lTris.push(
				ObjetTri.init((aElement) => {
					const lCompetence =
						aElement.colonnesCompetences[lIdColonne].competence;
					if (lCompetence && lCompetence.niveauDAcquisition) {
						const lGenre = lCompetence.niveauDAcquisition.getGenre();
						return lHash[lGenre] === undefined
							? Number.MAX_VALUE
							: lHash[lGenre];
					}
					return Number.MAX_VALUE;
				}, aGenreTri),
			);
		}
		lTris.push(ObjetTri.init("Position"));
		return lTris;
	}
	getCouleurCellule(aParams, aCouleurCellule) {
		if (
			aParams.idColonne ===
				DonneesListe_Competences_ElevesEvaluation.colonnes.eleve &&
			_eleveSortiDeLEtab.call(this.donnees, aParams.article.eleve)
		) {
			aCouleurCellule.texte = "var(--color-dark-red)";
			return aCouleurCellule;
		}
	}
}
DonneesListe_Competences_ElevesEvaluation.colonnes = {
	eleve: "CEE_eleve",
	classe: "CEE_classe",
	notes: "CEE_notes",
	prefixe_competence: "CEE_competence_",
	commentaireSurNote: "CEE_commentaireSurNote",
};
function _afficherProjetsAccompagnement() {
	return (
		this.optionsAffichage.avecOptionAfficherProjetsAcc &&
		this.optionsAffichage.afficherProjetsAccompagnement
	);
}
function _laColonneNoteEstEditable(aEleve) {
	let result = false;
	if (
		!!aEleve &&
		this.donnees.evaluation &&
		this.donnees.evaluation.getGenre() === EGenreRessource.Evaluation &&
		this.donnees.droitSaisieNotes &&
		!!this.donnees.devoir
	) {
		result =
			!aEleve.estSortiDeLaClasse &&
			!_eleveSortiDeLEtab.call(this.donnees, aEleve) &&
			!this.donnees.devoir.estVerrouille;
		if (result) {
			result = !aEleve.estSaisieNotationCloturee;
		}
	}
	if (
		!!aEleve &&
		this.donnees.droitSaisieNotes &&
		!!this.donnees.devoir &&
		this.donnees.afficherCommentaireSurNote
	) {
		result =
			!aEleve.estSortiDeLaClasse &&
			!_eleveSortiDeLEtab.call(this.donnees, aEleve) &&
			!this.donnees.devoir.estVerrouille;
		if (result) {
			result = !aEleve.estSaisieNotationCloturee;
		}
	}
	return result;
}
function _laNoteEstConsidereeCommeUnBonus(aEleve) {
	const lEstUnDevoirBonus =
		!!this.donnees.devoir && !!this.donnees.devoir.estUnBonus;
	if (
		lEstUnDevoirBonus &&
		!!aEleve &&
		((!!aEleve.note && aEleve.note.estUneValeur()) ||
			(!!aEleve.Note && aEleve.Note.estUneValeur()))
	) {
		const lNoteBareme = this.donnees.devoir.bareme;
		if (!!lNoteBareme && lNoteBareme.estUneValeur()) {
			const lValeurNote = aEleve.note
				? aEleve.note.getValeur()
				: aEleve.Note.getValeur();
			const lValeurBareme = lNoteBareme.getValeur();
			return lValeurNote < lValeurBareme / 2;
		}
	}
	return false;
}
function _calculMoyenneDevoir(aListeArticles, aDevoir, aBaremeDevoirParDefaut) {
	let LBareme = 0;
	let LMoyenne = 0;
	const lBaremeDuDevoir = aDevoir.bareme;
	const lDevoirEstRameneSur20 = aDevoir.ramenerSur20;
	const LCoefficientRamenerSur20 = !lDevoirEstRameneSur20
		? 1
		: aBaremeDevoirParDefaut.getValeur() / lBaremeDuDevoir.getValeur();
	aListeArticles.parcourir((D) => {
		if (!!D.eleve && !!D.eleve.note && D.eleve.note.estUneValeur()) {
			LMoyenne += LCoefficientRamenerSur20 * D.eleve.note.getValeur();
			LBareme += LCoefficientRamenerSur20 * lBaremeDuDevoir.getValeur();
		}
	});
	return new TypeNote(
		LBareme
			? new TypeArrondi(0).arrondir(
					(lBaremeDuDevoir.getValeur() * LMoyenne) / LBareme,
				)
			: "",
	);
}
function _construireListe() {
	const lListe = new ObjetListeElements();
	const lEstUneEvaluationDeLIndividu = this.avecSaisie;
	this.eleves.parcourir((aEleve) => {
		const lElement = new ObjetElement(aEleve.getLibelle(), aEleve.getNumero());
		lElement.Position = aEleve.Position;
		lElement.eleve = aEleve;
		lElement.colonnesCompetences = {};
		this.competences.parcourir((aCompetenceGenerale, aIndex) => {
			const lCompetence =
				ObjetUtilitaireEvaluation.getElementCompetenceParNumeroRelationESI(
					aEleve.listeCompetences,
					aCompetenceGenerale,
				);
			const lInfosCol = {};
			lElement.colonnesCompetences[
				DonneesListe_Competences_ElevesEvaluation.colonnes.prefixe_competence +
					aIndex
			] = lInfosCol;
			lInfosCol.competence = lCompetence;
			if (lCompetence) {
				lInfosCol.actif =
					lEstUneEvaluationDeLIndividu &&
					aEleve.getActif() &&
					!lCompetence.competenceNonAffecteeClasseEleve &&
					lCompetence.estEditableSelonNiveauClasseEleve &&
					lCompetence.getActif();
				lInfosCol.editable =
					lInfosCol.actif &&
					aEleve &&
					!aEleve.estSaisieEvaluationCloturee &&
					!aEleve.estSortiDeLaClasse &&
					!_eleveSortiDeLEtab.call(this, aEleve);
			} else {
				lInfosCol.actif = false;
				lInfosCol.editable = false;
			}
		});
		lListe.addElement(lElement);
	});
	return lListe;
}
function _getValeurColonneEleve(aEleve) {
	const lHtmlEleve = [];
	if (!!aEleve) {
		const lHtmlProjAcc = [];
		if (_afficherProjetsAccompagnement.call(this)) {
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
function _eleveSortiDeLEtab(aEleve) {
	return (
		aEleve &&
		aEleve.dateSortieDeLEtablissement &&
		GDate.estDateJourAvant(
			aEleve.dateSortieDeLEtablissement,
			this.evaluation.dateValidation,
		)
	);
}
module.exports = { DonneesListe_Competences_ElevesEvaluation };
