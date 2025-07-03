exports.DonneesListe_RelationEvaluationCompetence = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNote_1 = require("TypeNote");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SaisieTypeNote_1 = require("ObjetFenetre_SaisieTypeNote");
var CommandeMenuContextuelRelationEvalCompetence;
(function (CommandeMenuContextuelRelationEvalCompetence) {
	CommandeMenuContextuelRelationEvalCompetence[
		"ChoisirCompetenceDansReferentiel"
	] = "0";
	CommandeMenuContextuelRelationEvalCompetence["AppliquerOrdreGrille"] = "1";
	CommandeMenuContextuelRelationEvalCompetence["DupliquerCompetence"] = "2";
	CommandeMenuContextuelRelationEvalCompetence["ModifierCoefficient"] = "3";
})(
	CommandeMenuContextuelRelationEvalCompetence ||
		(CommandeMenuContextuelRelationEvalCompetence = {}),
);
class DonneesListe_RelationEvaluationCompetence extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aOptionsDonneesListe) {
		super(aDonnees);
		this.avecCreationNouvelleCompetence =
			aOptionsDonneesListe.avecCreationNouvelleCompetence;
		this.callbackAppliquerOrdreGrille =
			aOptionsDonneesListe.callbackAppliquerOrdreGrille;
		this.callbackChoixCompetenceDansReferentiel =
			aOptionsDonneesListe.callbackChoixCompetenceDansReferentiel;
		this.callbackDupliquerCompetence =
			aOptionsDonneesListe.callbackDupliquerCompetence;
		this.callbackModifierNiveauMaitriseDefaut =
			aOptionsDonneesListe.callbackModifierNiveauMaitriseDefaut;
		this.funcGetValeurMaxCoefficientCompetence =
			aOptionsDonneesListe.funcGetValeurMaxCoefficientCompetence;
		this.listeReferentielsUniques =
			aOptionsDonneesListe.listeReferentielsUniques;
		this.setOptions({
			avecEvnt_ApresSuppression: true,
			avecEtatSaisie: false,
			avecMultiSelection: true,
			avecTrimSurEdition: true,
		});
	}
	_estUnLibelleUnique(aArticle, V) {
		let lEstUnLibelleUnique = true;
		this.Donnees.parcourir((aElementListe) => {
			if (
				aElementListe !== aArticle &&
				aElementListe.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression &&
				aElementListe.getLibelle() === V
			) {
				lEstUnLibelleUnique = false;
				return false;
			}
		});
		return lEstUnLibelleUnique;
	}
	getClass(aParams) {
		const lClasses = [];
		if (!aParams.surLigneCreation) {
			switch (aParams.idColonne) {
				case DonneesListe_RelationEvaluationCompetence.colonnes.code:
				case DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut:
					lClasses.push("AlignementMilieu");
					break;
				case DonneesListe_RelationEvaluationCompetence.colonnes.coefficient:
					lClasses.push("AlignementDroit");
					break;
			}
		}
		return lClasses.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (
			aParams.idColonne ===
			DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut
		) {
			lClasses.push("AvecMain");
		}
		return lClasses.join(" ");
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RelationEvaluationCompetence.colonnes.code:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_RelationEvaluationCompetence.colonnes.coefficient:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getOptionsNote() {
		return {
			avecVirgule: false,
			afficherAvecVirgule: false,
			listeAnnotations: [],
			sansNotePossible: false,
			min: 0,
			max: this.funcGetValeurMaxCoefficientCompetence(),
		};
	}
	getCouleurCellule(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
	}
	avecEvenementCreation() {
		return !this.avecCreationNouvelleCompetence;
	}
	avecEvenementApresCreation() {
		return true;
	}
	avecEvenementSelectionClick(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut
		);
	}
	avecEvenementSelectionDblClick(aParams) {
		if (!_estUneNouvelleCompetence(aParams.article)) {
			return (
				aParams.idColonne ===
					DonneesListe_RelationEvaluationCompetence.colonnes.code ||
				aParams.idColonne ===
					DonneesListe_RelationEvaluationCompetence.colonnes.intitule
			);
		}
		return false;
	}
	avecMenuContextuel() {
		return true;
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel || !this.avecMenuContextuel()) {
			return;
		}
		if (aParametres.ligne === -1) {
			if (!!this.avecCreationNouvelleCompetence) {
				let lLibelleServiceConcerne = "";
				if (
					this.listeReferentielsUniques &&
					this.listeReferentielsUniques.count() > 0
				) {
					let lPremierReferentielUnique = this.listeReferentielsUniques.get(0);
					if (lPremierReferentielUnique) {
						lLibelleServiceConcerne = lPremierReferentielUnique.getLibelle();
					}
					aParametres.menuContextuel.addCommande(
						CommandeMenuContextuelRelationEvalCompetence.ChoisirCompetenceDansReferentiel,
						ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.ChoisirCompetencesDansReferentiel",
							[lLibelleServiceConcerne],
						),
					);
				}
				if (
					this.listeReferentielsUniques &&
					this.listeReferentielsUniques.count() > 1
				) {
					aParametres.menuContextuel.addSousMenu(
						ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.SaisirNouvelleCompetence",
						),
						(aInstanceSousMenu) => {
							for (const lRefUnique of this.listeReferentielsUniques) {
								aInstanceSousMenu.addCommande(
									Enumere_CommandeMenu_1.EGenreCommandeMenu.Creation,
									lRefUnique.palier.getLibelle(),
									true,
									{ refUniqueConcerne: lRefUnique },
								);
							}
						},
					);
				} else {
					const lReferentielUniqueConcerne =
						this.listeReferentielsUniques &&
						this.listeReferentielsUniques.get(0);
					aParametres.menuContextuel.addCommande(
						Enumere_CommandeMenu_1.EGenreCommandeMenu.Creation,
						ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.FenetreSaisieEvaluation.SaisirNouvelleCompetence",
						),
						true,
						{ refUniqueConcerne: lReferentielUniqueConcerne },
					);
				}
			}
		} else {
			const lAuMoinsUnElementSelectionne =
				!!aParametres.listeSelection && aParametres.listeSelection.count() > 0;
			const lEstUneMultiSelection =
				!!aParametres.listeSelection && aParametres.listeSelection.count() > 1;
			aParametres.menuContextuel.addCommande(
				CommandeMenuContextuelRelationEvalCompetence.ModifierCoefficient,
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.ModifierCoefficient",
				),
				lAuMoinsUnElementSelectionne,
			);
			const lThis = this;
			UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
				{
					instance: this,
					menuContextuel: aParametres.menuContextuel,
					avecSousMenu: true,
					genreChoixValidationCompetence:
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_EvaluationEtItem,
					evaluationsEditables: lAuMoinsUnElementSelectionne,
					callbackNiveau: function (aNiveau) {
						lThis.callbackModifierNiveauMaitriseDefaut(
							aParametres.listeSelection,
							aNiveau,
							aParametres.liste,
						);
					},
				},
			);
			if (!!this.callbackDupliquerCompetence) {
				aParametres.menuContextuel.addCommande(
					CommandeMenuContextuelRelationEvalCompetence.DupliquerCompetence,
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.DupliquerLaCompetence",
					),
					!lEstUneMultiSelection && lAuMoinsUnElementSelectionne,
				);
			}
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.SupprimerLaCompetence",
				),
				!lEstUneMultiSelection && lAuMoinsUnElementSelectionne,
			);
			aParametres.menuContextuel.avecSeparateurSurSuivant();
			aParametres.menuContextuel.addCommande(
				CommandeMenuContextuelRelationEvalCompetence.AppliquerOrdreGrille,
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.AppliquerOrdreDeLaGrille",
				),
			);
		}
	}
	evenementMenuContextuel(aParametres) {
		switch (aParametres.numeroMenu) {
			case CommandeMenuContextuelRelationEvalCompetence.ChoisirCompetenceDansReferentiel:
				this.callbackChoixCompetenceDansReferentiel();
				break;
			case CommandeMenuContextuelRelationEvalCompetence.AppliquerOrdreGrille:
				if (!!this.callbackAppliquerOrdreGrille) {
					this.callbackAppliquerOrdreGrille();
				}
				break;
			case CommandeMenuContextuelRelationEvalCompetence.DupliquerCompetence:
				if (!!this.callbackDupliquerCompetence) {
					this.callbackDupliquerCompetence(aParametres.article);
				}
				break;
			case CommandeMenuContextuelRelationEvalCompetence.ModifierCoefficient: {
				let lValeurCoefficientCommune;
				aParametres.listeSelection.parcourir((aArticle) => {
					if (lValeurCoefficientCommune === undefined) {
						lValeurCoefficientCommune = aArticle.coefficient;
					} else if (lValeurCoefficientCommune !== null) {
						if (lValeurCoefficientCommune !== aArticle.coefficient) {
							lValeurCoefficientCommune = null;
						}
					}
				});
				if (!lValeurCoefficientCommune && lValeurCoefficientCommune !== 0) {
					lValeurCoefficientCommune = 1;
				}
				let lTypeNoteCommune = new TypeNote_1.TypeNote(
					lValeurCoefficientCommune,
				);
				const lFenetreSaisieNote =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SaisieTypeNote_1.ObjetFenetre_SaisieTypeNote,
						{
							pere: this,
							evenement: function (aNumeroBouton, aTypeNote) {
								if (aNumeroBouton === 1) {
									if (!aTypeNote.estUneNoteVide()) {
										aParametres.listeSelection.parcourir((aArticle) => {
											aArticle.coefficient = aTypeNote.getValeur();
											aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
										});
										aParametres.instance.actualiser({
											conserverSelection: true,
										});
									}
								}
							},
						},
						{
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"competences.ModifierCoefficient",
							),
						},
					);
				lFenetreSaisieNote.setOptionsInputNote(this.getOptionsNote());
				lFenetreSaisieNote.setDonnees(lTypeNoteCommune, {
					labelChamps: ObjetTraduction_1.GTraductions.getValeur(
						"competences.coefficient",
					),
				});
				break;
			}
		}
		return false;
	}
	surCreation(D, V) {
		if (!!D) {
			const lLibelle = V && V[0] ? V[0].trim() : "";
			if (V.data) {
				const lReferentielUniqueConcerne = V.data.refUniqueConcerne;
				if (lReferentielUniqueConcerne && lReferentielUniqueConcerne.palier) {
					D.palier = lReferentielUniqueConcerne.palier;
				}
			}
			const lEstUnLibelleUnique = this._estUnLibelleUnique(D, lLibelle);
			if (lEstUnLibelleUnique) {
				D.Numero = "0";
				D.Genre = Enumere_Ressource_1.EGenreRessource.Competence;
				D.setLibelle(lLibelle);
			} else {
				return D;
			}
		}
	}
	getMessageCreationImpossible(aArticle) {
		return this.getMessageDoublon(aArticle);
	}
	getValeur(aParams) {
		const lSurExportCSV = aParams && aParams.surExportCSV;
		switch (aParams.idColonne) {
			case DonneesListe_RelationEvaluationCompetence.colonnes.code: {
				const lHtmlCode = [];
				const lPilier = aParams.article.pilier;
				if (lSurExportCSV) {
					return lPilier && lPilier.code ? lPilier.code : "";
				}
				if (!!lPilier) {
					if (lPilier.estPersonnalise) {
						lHtmlCode.push(
							'<i role="presentation" class="icon_star Texte11"></i>',
						);
					} else {
						if (!!lPilier.code) {
							lHtmlCode.push(
								'<div class="AlignementGauche">',
								lPilier.code,
								"</div>",
							);
						} else {
							const lCouleurPilier = lPilier.couleur || GCouleur.noir;
							lHtmlCode.push(
								'<div style="width: 10px; ',
								ObjetStyle_1.GStyle.composeCouleurFond(lCouleurPilier),
								" ",
								ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.noir),
								'">&nbsp;</div>',
							);
						}
					}
				}
				return lHtmlCode.join("");
			}
			case DonneesListe_RelationEvaluationCompetence.colonnes.intitule:
				return _getIntituleArticle(aParams.article);
			case DonneesListe_RelationEvaluationCompetence.colonnes.coefficient:
				return aParams.article.coefficient !== undefined &&
					aParams.article.coefficient !== null
					? new TypeNote_1.TypeNote(aParams.article.coefficient)
					: null;
			case DonneesListe_RelationEvaluationCompetence.colonnes.nivAcquiDefaut:
				if (!!aParams.article.niveauAcquiDefaut) {
					if (lSurExportCSV) {
						return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getAbbreviation(
							aParams.article.niveauAcquiDefaut,
						);
					}
					return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
						aParams.article.niveauAcquiDefaut,
					);
				}
				break;
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RelationEvaluationCompetence.colonnes.code: {
				const lHintCode = [];
				if (aParams.article.pilier) {
					lHintCode.push(aParams.article.pilier.getLibelle());
					if (aParams.article.palier) {
						const lLibellePalier = aParams.article.palier.getLibelle();
						if (lLibellePalier) {
							lHintCode.push(" (", lLibellePalier, ")");
						}
					}
				}
				return lHintCode.join("");
			}
			case DonneesListe_RelationEvaluationCompetence.colonnes.intitule:
				return aParams.article ? aParams.article.LibelleLong || "" : "";
		}
		return "";
	}
	getMessageSuppressionConfirmation(D) {
		return D.avecEvaluation
			? ObjetTraduction_1.GTraductions.getValeur(
					"competences.message.ConfirmationSuppression",
				)
			: ObjetTraduction_1.GTraductions.getValeur("liste.suppressionSelection");
	}
	surSuppression(D) {
		D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		D.Position = null;
		this.Donnees.trier();
		this.Donnees.parcourir((aElement, aIndex) => {
			if (aElement.existe() && aElement.Position !== aIndex + 1) {
				aElement.Position = aIndex + 1;
				aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
		});
	}
	getLibelleDraggable(aParams) {
		return _getIntituleArticle(aParams.article);
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RelationEvaluationCompetence.colonnes.intitule:
				return _estUneNouvelleCompetence(aParams.article);
			case DonneesListe_RelationEvaluationCompetence.colonnes.coefficient:
				return true;
		}
		return false;
	}
	async surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_RelationEvaluationCompetence.colonnes.intitule: {
				const lEstUnLibelleUnique = this._estUnLibelleUnique(
					aParams.article,
					V,
				);
				if (lEstUnLibelleUnique) {
					aParams.article.Libelle = V;
				} else {
					return aParams;
				}
				break;
			}
			case DonneesListe_RelationEvaluationCompetence.colonnes.coefficient:
				if (!V.estUneNoteVide()) {
					aParams.article.coefficient = V.getValeur();
				}
				break;
		}
	}
	getMessageEditionImpossible(aParams, aErreur) {
		let lMessageEditionImpossible;
		if (
			!!aParams &&
			aParams.idColonne ===
				DonneesListe_RelationEvaluationCompetence.colonnes.intitule
		) {
			lMessageEditionImpossible = this.getMessageDoublon(aParams.article);
		} else {
			lMessageEditionImpossible = super.getMessageEditionImpossible(
				aParams,
				aErreur,
			);
		}
		return lMessageEditionImpossible;
	}
	surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		const lSource = aParamsSource.article;
		const lDestination = aParamsLigneDestination.article;
		const lPosition = lDestination.Position;
		lDestination.Position = lSource.Position;
		lSource.Position = lPosition;
		lSource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		lDestination.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
}
exports.DonneesListe_RelationEvaluationCompetence =
	DonneesListe_RelationEvaluationCompetence;
(function (DonneesListe_RelationEvaluationCompetence) {
	let colonnes;
	(function (colonnes) {
		colonnes["code"] = "DonneesListeREC_Code";
		colonnes["intitule"] = "DonneesListeREC_Intitule";
		colonnes["coefficient"] = "DonneesListeREC_Coefficient";
		colonnes["nivAcquiDefaut"] = "DonneesListeREC_NivAcquiDefaut";
	})(
		(colonnes =
			DonneesListe_RelationEvaluationCompetence.colonnes ||
			(DonneesListe_RelationEvaluationCompetence.colonnes = {})),
	);
})(
	DonneesListe_RelationEvaluationCompetence ||
		(exports.DonneesListe_RelationEvaluationCompetence =
			DonneesListe_RelationEvaluationCompetence =
				{}),
);
function _estUneNouvelleCompetence(aArticle) {
	return (
		aArticle &&
		aArticle.getNumero() === "0" &&
		aArticle.getGenre() === Enumere_Ressource_1.EGenreRessource.Competence
	);
}
function _getIntituleArticle(aArticle) {
	let result = "";
	if (!!aArticle) {
		result =
			(aArticle.code ? aArticle.code + " : " : "") +
			(aArticle.nivEquivCELong ? "[" + aArticle.nivEquivCELong + "] " : "") +
			aArticle.getLibelle();
	}
	return result;
}
