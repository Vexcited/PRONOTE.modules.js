exports.DonneesListe_EvaluationsQCM = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const TypeNote_1 = require("TypeNote");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Etat_1 = require("Enumere_Etat");
const CommandeMenuContextuelCompetencesQCM = {
	ChoisirCompetenceDansReferentiel: "cmdMenu_ChoixCompetenceDansReferentiel",
};
class DonneesListe_EvaluationsQCM extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aOptions) {
		super(aDonnees);
		if (aOptions) {
			this.getValeurMaxCoefficientCompetence =
				aOptions.getValeurMaxCoefficientCompetence;
			this.avecEditionTBMaitrise = !!aOptions.avecEditionTBMaitrise;
			this.avecCreationNouvelleCompetence =
				!!aOptions.avecCreationNouvelleCompetence;
			this.callbackChoixCompetenceDansReferentiel =
				aOptions.callbackChoixCompetenceDansReferentiel;
			this.avecMessageAucuneMatierePourEvaluations =
				!!aOptions.avecMessageAucuneMatierePourEvaluations;
			this.listePaliersDesReferentielsUniques =
				aOptions.listePaliersDesReferentielsUniques;
			if (aOptions.hauteurMinCellule) {
				this.setOptions({ hauteurMinCellule: aOptions.hauteurMinCellule });
			}
		}
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
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.libelle:
				return aParams.article.getLibelle();
			case DonneesListe_EvaluationsQCM.colonnes.maitrise: {
				let lGenreNiveau;
				if (aParams.article.tbMaitrise) {
					lGenreNiveau =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert;
				} else {
					lGenreNiveau =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Acquis;
				}
				return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
					GParametres.listeNiveauxDAcquisitions.getElementParGenre(
						lGenreNiveau,
					),
				);
			}
			case DonneesListe_EvaluationsQCM.colonnes.coef:
				return aParams.article
					? new TypeNote_1.TypeNote(aParams.article.coefficient)
					: null;
			default:
				break;
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.maitrise:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_EvaluationsQCM.colonnes.coef:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.libelle:
				if (aParams.article && aParams.article.palier) {
					return (
						aParams.article.getLibelle() +
						" (" +
						aParams.article.palier.getLibelle() +
						")"
					);
				}
		}
		return "";
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.maitrise:
				return "AlignementMilieu";
		}
		return "";
	}
	avecEvenementCreation() {
		return (
			!this.avecCreationNouvelleCompetence ||
			this.avecMessageAucuneMatierePourEvaluations
		);
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.coef:
				return true;
		}
		return false;
	}
	avecEvenementSelectionClick(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.maitrise:
				return this.avecEditionTBMaitrise;
		}
		return false;
	}
	getCouleurCellule(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.maitrise:
				if (this.avecEditionTBMaitrise) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
				}
				break;
		}
	}
	avecEvenementApresEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.coef:
				return true;
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_EvaluationsQCM.colonnes.coef:
				if (!V.estUneNoteVide()) {
					aParams.article.coefficient = V.getValeur();
				}
				break;
			default:
				break;
		}
	}
	getOptionsNote() {
		return {
			avecVirgule: false,
			afficherAvecVirgule: false,
			listeAnnotations: [],
			sansNotePossible: false,
			min: 0,
			max: !!this.getValeurMaxCoefficientCompetence
				? this.getValeurMaxCoefficientCompetence
				: 100,
		};
	}
	avecMenuContextuel() {
		return true;
	}
	remplirMenuContextuel(aParametres) {
		let lAvecCommandeActive = false,
			lCommande;
		if (aParametres.ligne === -1) {
			if (!this.avecCreationNouvelleCompetence) {
				return;
			}
			aParametres.menuContextuel.addCommande(
				CommandeMenuContextuelCompetencesQCM.ChoisirCompetenceDansReferentiel,
				ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.listeCompetences.ChoisirCompetencesParmiExistantes",
				),
			);
			if (
				this.listePaliersDesReferentielsUniques &&
				this.listePaliersDesReferentielsUniques.count() > 1
			) {
				aParametres.menuContextuel.addSousMenu(
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.listeCompetences.SaisirNouvelleCompetence",
					),
					(aInstanceSousMenu) => {
						for (const lPalierRefUnique of this
							.listePaliersDesReferentielsUniques) {
							aInstanceSousMenu.addCommande(
								Enumere_CommandeMenu_1.EGenreCommandeMenu.Creation,
								lPalierRefUnique.getLibelle(),
								true,
								{ palierRefUniqueConcerne: lPalierRefUnique },
							);
						}
					},
				);
			} else {
				const lPalierReferentielUniqueConcerne =
					this.listePaliersDesReferentielsUniques.get(0);
				aParametres.menuContextuel.addCommande(
					Enumere_CommandeMenu_1.EGenreCommandeMenu.Creation,
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.listeCompetences.SaisirNouvelleCompetence",
					),
					true,
					{ palierRefUniqueConcerne: lPalierReferentielUniqueConcerne },
				);
			}
		} else {
			lCommande = aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
				!aParametres.nonEditable &&
					aParametres &&
					aParametres.avecSuppression &&
					this._avecSuppression(aParametres),
			);
			if (lCommande.actif) {
				lAvecCommandeActive = true;
			}
			return lAvecCommandeActive;
		}
	}
	evenementMenuContextuel(aParametres) {
		switch (aParametres.numeroMenu) {
			case CommandeMenuContextuelCompetencesQCM.ChoisirCompetenceDansReferentiel:
				if (!!this.callbackChoixCompetenceDansReferentiel) {
					this.callbackChoixCompetenceDansReferentiel();
				}
				break;
		}
		return false;
	}
	surCreation(D, V) {
		if (!!D) {
			const lLibelle = V && V[0] ? V[0].trim() : "";
			if (V.data) {
				const lPalierReferentielUniqueConcerne = V.data.palierRefUniqueConcerne;
				if (lPalierReferentielUniqueConcerne) {
					D.palier = lPalierReferentielUniqueConcerne;
				}
			}
			const lEstUnLibelleUnique = this._estUnLibelleUnique(D, lLibelle);
			if (lEstUnLibelleUnique) {
				D.Numero = "0";
				D.Genre = Enumere_Ressource_1.EGenreRessource.Competence;
				D.coefficient = 1;
				D.setLibelle(lLibelle);
			} else {
				return D;
			}
		}
	}
	static getOptionsListe(aPourEdition) {
		const lColonnes = [
			{
				id: DonneesListe_EvaluationsQCM.colonnes.libelle,
				taille: "100%",
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.listeCompetences.colLibelleCompetences",
				),
			},
			{
				id: DonneesListe_EvaluationsQCM.colonnes.maitrise,
				taille: 40,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.listeCompetences.colMaitrise",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.listeCompetences.hintColMaitrise",
				),
			},
			{
				id: DonneesListe_EvaluationsQCM.colonnes.coef,
				taille: 40,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.listeCompetences.colCoef",
				),
			},
		];
		const lOptions = {
			colonnes: lColonnes,
			colonnesCachees: [],
			avecListeNeutre: true,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 150,
			paddingCelluleTB: 3,
		};
		if (aPourEdition) {
			$.extend(lOptions, {
				titreCreation: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.listeCompetences.ajouterCompetences",
				),
				avecLigneCreation: true,
				listeCreations: 0,
				hauteurMaxAdapteContenu: 130,
			});
		}
		return lOptions;
	}
}
exports.DonneesListe_EvaluationsQCM = DonneesListe_EvaluationsQCM;
(function (DonneesListe_EvaluationsQCM) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "DL_EvalQCM_Libelle";
		colonnes["maitrise"] = "DL_EvalQCM_Maitrise";
		colonnes["coef"] = "DL_EvalQCM_Coeff";
	})(
		(colonnes =
			DonneesListe_EvaluationsQCM.colonnes ||
			(DonneesListe_EvaluationsQCM.colonnes = {})),
	);
})(
	DonneesListe_EvaluationsQCM ||
		(exports.DonneesListe_EvaluationsQCM = DonneesListe_EvaluationsQCM = {}),
);
