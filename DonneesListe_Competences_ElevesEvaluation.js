exports.DonneesListe_Competences_ElevesEvaluation = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetUtilitaireEvaluation_1 = require("ObjetUtilitaireEvaluation");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeArrondi_1 = require("TypeArrondi");
const TypeNote_1 = require("TypeNote");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DocumentsEleve_1 = require("ObjetFenetre_DocumentsEleve");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const MoteurNotesCP_1 = require("MoteurNotesCP");
const MoteurNotes_1 = require("MoteurNotes");
const AccessApp_1 = require("AccessApp");
class DonneesListe_Competences_ElevesEvaluation extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aOptionsAffichage) {
		super(_construireListe(aDonnees));
		this.etatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.moteurNotes = new MoteurNotes_1.MoteurNotes();
		this.moteurNotesCP = new MoteurNotesCP_1.MoteurNotesCP(this.moteurNotes);
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
						UtilitaireCompetences_1.TUtilitaireCompetences.estNotantPourTxReussiteEvaluation(
							lCompetence.niveauDAcquisition,
						)
					) {
						lNbElevesTotal++;
						if (
							aArticle.eleve.estSortiDeLaClasse ||
							_eleveSortiDeLEtab(lThis.donnees, aArticle.eleve) ||
							lCompetence.competenceNonAffecteeClasseEleve
						) {
							lNbElevesTotal--;
						}
						if (lNbElevesAcquis === null) {
							lNbElevesAcquis = 0;
						}
						if (
							UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
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
			return this._getValeurColonneEleve(lEleve);
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
					_eleveSortiDeLEtab(this.donnees, lEleve)
				) {
					result = "X";
				} else if (!!lEleve.note || !!lEleve.Note) {
					if (
						this._laNoteEstConsidereeCommeUnBonus(lEleve) &&
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
			if (!this._laColonneNoteEstEditable(lEleve) && !result) {
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
				_eleveSortiDeLEtab(this.donnees, aParams.article.eleve) ||
				!lCompetence ||
				(lCompetence.competenceNonAffecteeClasseEleve &&
					this.donnees.evaluation &&
					this.donnees.evaluation.getGenre() !==
						Enumere_Ressource_1.EGenreRessource.EvaluationHistorique) ||
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
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveauAcquisitionGlobal,
							{},
						),
					);
				}
				if (
					lCompetence.niveauDAcquisition.getGenre() >=
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert &&
					lCompetence.observation
				) {
					lContenuCelluleCompetence.push(
						'<i style="position:absolute; right:0px; bottom:0px;" class=" icon_comment" role="presentation"></i>',
					);
				}
			}
			return lContenuCelluleCompetence.join("");
		}
	}
	getTooltip(aParams) {
		let result = "";
		if (
			_eleveSortiDeLEtab(this.donnees, aParams.article.eleve) &&
			this.donnees.evaluation &&
			this.donnees.evaluation.getGenre() !==
				Enumere_Ressource_1.EGenreRessource.EvaluationHistorique
		) {
			result = ObjetTraduction_1.GTraductions.getValeur(
				"competences.EleveHorsEtablissement",
			);
		} else {
			if (aParams.article.eleve.estSortiDeLaClasse) {
				result =
					this.etatUtil.Navigation.getGenreRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					) === Enumere_Ressource_1.EGenreRessource.Classe
						? ObjetTraduction_1.GTraductions.getValeur(
								"competences.EleveHorsClasse",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"competences.EleveHorsGroupe",
							);
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
							Enumere_Ressource_1.EGenreRessource.EvaluationHistorique
					) {
						result =
							aParams.article.eleve.getLibelle() +
							" (" +
							ObjetTraduction_1.GTraductions.getValeur(
								"competences.CompetenceNonAffecteeAClasse",
							) +
							")";
					} else if (!lCompetence.estEditableSelonNiveauClasseEleve) {
						result =
							aParams.article.eleve.getLibelle() +
							" (" +
							ObjetTraduction_1.GTraductions.getValeur(
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
								ObjetTraduction_1.GTraductions.getValeur(
									"competences.PublieSurEspaceParent",
								) +
								")";
						}
						result += ObjetChaine_1.GChaine.toTitle(
							UtilitaireCompetences_1.TUtilitaireCompetences.composeHintEvaluationEleve(
								{
									libelleEleve: aParams.article.eleve.getLibelle(),
									estSaisieClotureePourEleve:
										!!aParams.article.eleve.estSaisieEvaluationCloturee,
									hintCompetence:
										UtilitaireCompetences_1.TUtilitaireCompetences.composeTitleEvaluation(
											lCompetence,
										),
									niveauDAcquisition: lCompetence.niveauDAcquisition,
									observation: lObservationEleve,
								},
							),
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
											UtilitaireQCM_1.UtilitaireQCM.composeHintReponsesEleveDeQuestionQCM(
												aQuestionQCM.getPosition(),
												aQuestionQCM,
												lReponseEleve,
												{
													typeNumerotationQCM: lTypeNumerotationQCM,
													avecAffichageNote: !this.etatUtil.pourPrimaire(),
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
							ObjetTraduction_1.GTraductions.getValeur(
								"competences.NotationClotureePourLaClasse",
							),
							'<i class="icon_lock m-left" role="presentation"></i>',
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
							ObjetTraduction_1.GTraductions.getValeur("competences.Note"),
							"</u></b> : ",
							aParams.article.eleve.note || aParams.article.eleve.Note,
						);
					}
					result = ObjetChaine_1.GChaine.toTitle(
						lTitleCelluleNoteEleve.join(""),
					);
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
			let lTypeCelluleNote =
				ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			if (
				!this._laColonneNoteEstEditable(aParams.article.eleve) ||
				(this._laNoteEstConsidereeCommeUnBonus(aParams.article.eleve) &&
					!aParams.surEdition)
			) {
				lTypeCelluleNote =
					ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			}
			return lTypeCelluleNote;
		} else if (
			DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
				aParams.idColonne,
			)
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			aParams.idColonne ===
			DonneesListe_Competences_ElevesEvaluation.colonnes.notes
		) {
			if (!this._laColonneNoteEstEditable(aParams.article.eleve)) {
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
			return this._laColonneNoteEstEditable(aParams.article.eleve);
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
			return this._laColonneNoteEstEditable(aParams.article.eleve) && lAvecNote;
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
			case DonneesListe_Competences_ElevesEvaluation.colonnes.notes: {
				if (!!aParams.article.eleve) {
					const lVal = V;
					const lFuncMiseAJourMoyenne = () => {
						this.donnees.devoir.moyenne = this._calculMoyenneDevoir(
							this.Donnees,
							this.donnees.devoir,
							this.donnees.baremeDevoirParDefaut,
						);
					};
					const lBaremeDevoir = this.donnees.devoir.bareme;
					if (
						lVal.estUneNoteValide(
							new TypeNote_1.TypeNote(0),
							lBaremeDevoir,
							true,
							true,
						)
					) {
						this._affecterNoteALEleve(aParams.article.eleve, lVal);
						lFuncMiseAJourMoyenne();
					} else {
						return this.moteurNotesCP
							.afficherConfirmationSaisieNoteAuDessusBareme(lVal, lBaremeDevoir)
							.then((aValider) => {
								if (aValider) {
									this._affecterNoteALEleve(aParams.article.eleve, lVal);
									lFuncMiseAJourMoyenne();
								} else {
									return { annulerEdition: true, enEditionSurCelllule: true };
								}
							});
					}
				}
				break;
			}
			case DonneesListe_Competences_ElevesEvaluation.colonnes
				.commentaireSurNote:
				if (!aParams.article.eleve) {
					return;
				}
				aParams.article.eleve.commentaire = V;
				aParams.article.eleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
		aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
				return ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.moyenneDevoir",
				);
			case DonneesListe_Competences_ElevesEvaluation.colonnes.notes: {
				let result = "";
				if (!!this.donnees.devoir) {
					if (!this.donnees.devoir.moyenne) {
						this.donnees.devoir.moyenne = this._calculMoyenneDevoir(
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
			lTris.push(ObjetTri_1.ObjetTri.init("Position", aGenreTri));
		} else if (
			lIdColonne === DonneesListe_Competences_ElevesEvaluation.colonnes.classe
		) {
			lTris.push(ObjetTri_1.ObjetTri.init("eleve.classe.Libelle", aGenreTri));
		} else if (
			lIdColonne === DonneesListe_Competences_ElevesEvaluation.colonnes.notes
		) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
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
			const lOrdre =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.ordre(),
				lHash = {};
			lOrdre.forEach((aEnumere, aIndex) => {
				lHash[aEnumere] = aIndex;
			});
			lTris.push(
				ObjetTri_1.ObjetTri.init((aElement) => {
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
		lTris.push(ObjetTri_1.ObjetTri.init("Position"));
		return lTris;
	}
	getCouleurCellule(aParams, aCouleurCellule) {
		if (
			aParams.idColonne ===
				DonneesListe_Competences_ElevesEvaluation.colonnes.eleve &&
			_eleveSortiDeLEtab(this.donnees, aParams.article.eleve)
		) {
			aCouleurCellule.texte = "var(--color-red-foncee)";
			return aCouleurCellule;
		}
	}
	_afficherProjetsAccompagnement() {
		return (
			this.optionsAffichage.avecOptionAfficherProjetsAcc &&
			this.optionsAffichage.afficherProjetsAccompagnement
		);
	}
	_laColonneNoteEstEditable(aEleve) {
		let result = false;
		if (
			!!aEleve &&
			this.donnees.evaluation &&
			this.donnees.evaluation.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Evaluation &&
			this.donnees.droitSaisieNotes &&
			!!this.donnees.devoir
		) {
			result =
				!aEleve.estSortiDeLaClasse &&
				!_eleveSortiDeLEtab(this.donnees, aEleve) &&
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
				!_eleveSortiDeLEtab(this.donnees, aEleve) &&
				!this.donnees.devoir.estVerrouille;
			if (result) {
				result = !aEleve.estSaisieNotationCloturee;
			}
		}
		return result;
	}
	_laNoteEstConsidereeCommeUnBonus(aEleve) {
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
	_calculMoyenneDevoir(aListeArticles, aDevoir, aBaremeDevoirParDefaut) {
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
		return new TypeNote_1.TypeNote(
			LBareme
				? new TypeArrondi_1.TypeArrondi(0).arrondir(
						(lBaremeDuDevoir.getValeur() * LMoyenne) / LBareme,
					)
				: "",
		);
	}
	jsxSurClicPiecesJointesProjAcc(aEleve, aNode) {
		$(aNode).eventValidation(() => {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_DocumentsEleve_1.ObjetFenetre_DocumentsEleve,
				{ pere: this },
			).setDonnees(aEleve);
		});
	}
	_getValeurColonneEleve(aEleve) {
		const lHtmlEleve = [];
		if (!!aEleve) {
			const lHtmlProjAcc = [];
			if (this._afficherProjetsAccompagnement()) {
				const lHintProjetAcc = aEleve.projetsAccompagnement || false;
				const lAvecPiecesJointes = !!aEleve.avecDocsProjetsAccompagnement;
				if (lHintProjetAcc || lAvecPiecesJointes) {
					let lAvecClick = false;
					const lClasses = ["AlignementMilieuVertical", "InlineBlock"];
					if (lAvecPiecesJointes) {
						lClasses.push("AvecMain");
						lAvecClick = true;
					}
					lHtmlProjAcc.push(
						IE.jsx.str(
							"span",
							{
								role: lAvecClick ? "button" : "img",
								tabindex: lAvecClick ? 0 : false,
								title: lHintProjetAcc,
								class: lClasses.join(" "),
								"ie-node": lAvecClick
									? this.jsxSurClicPiecesJointesProjAcc.bind(this, aEleve)
									: false,
								style: "float: right;",
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
}
exports.DonneesListe_Competences_ElevesEvaluation =
	DonneesListe_Competences_ElevesEvaluation;
function _construireListe(aDonnees) {
	const lListe = new ObjetListeElements_1.ObjetListeElements();
	const lEstUneEvaluationDeLIndividu = aDonnees.avecSaisie;
	aDonnees.eleves.parcourir((aEleve) => {
		const lElement = new ObjetElement_1.ObjetElement(
			aEleve.getLibelle(),
			aEleve.getNumero(),
		);
		lElement.Position = aEleve.Position;
		lElement.eleve = aEleve;
		lElement.colonnesCompetences = {};
		aDonnees.competences.parcourir((aCompetenceGenerale, aIndex) => {
			const lCompetence =
				ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.getElementCompetenceParNumeroRelationESI(
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
					!_eleveSortiDeLEtab(aDonnees, aEleve);
			} else {
				lInfosCol.actif = false;
				lInfosCol.editable = false;
			}
		});
		lListe.addElement(lElement);
	});
	return lListe;
}
function _eleveSortiDeLEtab(aDonnees, aEleve) {
	return (
		aEleve &&
		aEleve.dateSortieDeLEtablissement &&
		ObjetDate_1.GDate.estDateJourAvant(
			aEleve.dateSortieDeLEtablissement,
			aDonnees.evaluation.dateValidation,
		)
	);
}
(function (DonneesListe_Competences_ElevesEvaluation) {
	let colonnes;
	(function (colonnes) {
		colonnes["eleve"] = "CEE_eleve";
		colonnes["classe"] = "CEE_classe";
		colonnes["notes"] = "CEE_notes";
		colonnes["prefixe_competence"] = "CEE_competence_";
		colonnes["commentaireSurNote"] = "CEE_commentaireSurNote";
	})(
		(colonnes =
			DonneesListe_Competences_ElevesEvaluation.colonnes ||
			(DonneesListe_Competences_ElevesEvaluation.colonnes = {})),
	);
})(
	DonneesListe_Competences_ElevesEvaluation ||
		(exports.DonneesListe_Competences_ElevesEvaluation =
			DonneesListe_Competences_ElevesEvaluation =
				{}),
);
