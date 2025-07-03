exports.DonneesListe_BilanParDomaine = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class DonneesListe_BilanParDomaine extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParametres) {
		super(aDonnees);
		this.parametres = Object.assign(
			{ callbackInitMenuContextuel: null },
			aParametres,
		);
		this.setOptions({
			avecSuppression: false,
			avecDeploiement: true,
			avecTri: false,
			avecEvnt_KeyUpListe: true,
			editionApresSelection: false,
			avecSelectionSurNavigationClavier: true,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BilanParDomaine.colonnes.items:
				return (
					aParams.article.getLibelle() +
					(!!aParams.article.libelleCorrige
						? " - ( " +
							ObjetChaine_1.GChaine.composerUrlLienExterne({
								libelle: aParams.article.libelleCorrige,
								documentJoint: aParams.article,
								title:
									ObjetTraduction_1.GTraductions.getValeur("AfficherCorrige"),
							}) +
							" )"
						: "")
				);
			case DonneesListe_BilanParDomaine.colonnes.coefficient:
				return !!aParams.article.coeff || aParams.article.coeff === 0
					? aParams.article.coeff
					: "";
			case DonneesListe_BilanParDomaine.colonnes.niveau: {
				const lHtml = [];
				if (
					!!aParams.article.niveauDAcquisition &&
					aParams.article.niveauDAcquisition.getGenre() ===
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Multiple
				) {
					lHtml.push(ObjetTraduction_1.GTraductions.getValeur("Multiple"));
				} else if (!!aParams.article.niveauDAcquisition) {
					const lNiveauDAcquisition =
						GParametres.listeNiveauxDAcquisitions.getElementParNumero(
							aParams.article.niveauDAcquisition.getNumero(),
						);
					lHtml.push(
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveauDAcquisition,
							{ avecTitle: false },
						),
					);
				}
				if (aParams.article.observation) {
					lHtml.push(
						'<i style="position:absolute; right:0px; bottom:0px;" class=" icon_comment" role="presentation"></i>',
					);
				} else if (aParams.article.avecVerrou) {
					lHtml.push(
						'<div class="Image_VerrouNoirPetit" style="position:absolute; right:0; bottom:-1px;"></div>',
					);
				}
				return lHtml.join("");
			}
			case DonneesListe_BilanParDomaine.colonnes.valider:
				return !!aParams.article.estUneDateValidationMultiple
					? ObjetTraduction_1.GTraductions.getValeur("Multiple")
					: this.avecAffichageDeLaDate(aParams.article) &&
							!!aParams.article.dateValidation
						? ObjetDate_1.GDate.formatDate(
								aParams.article.dateValidation,
								"%JJ/%MM/%AAAA",
							)
						: "";
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BilanParDomaine.colonnes.niveau: {
				const lHintNiveauAcquisition = [];
				if (
					!!aParams.article.niveauDAcquisition &&
					aParams.article.niveauDAcquisition.getGenre() !==
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Multiple
				) {
					lHintNiveauAcquisition.push(
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
							aParams.article.niveauDAcquisition,
						),
					);
					if (!!aParams.article.observation) {
						const lObs = aParams.article.observation.replace(/\n/g, "<br/>");
						lHintNiveauAcquisition.push("<br>", lObs);
						if (!!aParams.article.observationPubliee) {
							lHintNiveauAcquisition.push(
								" (",
								ObjetTraduction_1.GTraductions.getValeur(
									"competences.PublieSurEspaceParent",
								),
								")",
							);
						}
					}
				}
				return lHintNiveauAcquisition.join("");
			}
			case DonneesListe_BilanParDomaine.colonnes.coefficient:
				return aParams.article.hintCoeff || "";
			case DonneesListe_BilanParDomaine.colonnes.items:
				return aParams.article.libelleLong ? aParams.article.libelleLong : "";
			case DonneesListe_BilanParDomaine.colonnes.valider:
				return this.avecAffichageDeLaDate(aParams.article) &&
					!!aParams.article.dateValidation &&
					!!aParams.article.strIndividuValidation
					? ObjetChaine_1.GChaine.format("%s %s\n%s", [
							ObjetTraduction_1.GTraductions.getValeur("competences.ValidePar"),
							aParams.article.strIndividuValidation,
							ObjetDate_1.GDate.formatDate(
								aParams.article.dateValidation,
								"%JJ/%MM/%AAAA",
							),
						])
					: "";
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BilanParDomaine.colonnes.items:
			case DonneesListe_BilanParDomaine.colonnes.niveau:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BilanParDomaine.colonnes.niveau:
				return !!aParams.article.niveauEstEditable;
			case DonneesListe_BilanParDomaine.colonnes.valider: {
				let estDateEditable = false;
				if (!!aParams.article.dateEstEditable) {
					const lNiveauAcqui = aParams.article.niveauDAcquisition;
					if (!!lNiveauAcqui) {
						estDateEditable =
							UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
								lNiveauAcqui,
							);
					}
				}
				return estDateEditable;
			}
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		return this.avecEdition(aParams);
	}
	getClass(aParams) {
		const lClass = [];
		if (aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.niveau) {
			lClass.push("AlignementMilieu");
		} else if (
			aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.coefficient
		) {
			lClass.push("AlignementDroit");
		}
		if (aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items) {
			if (
				aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier ||
				aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.MetaMatiere
			) {
				lClass.push("Gras");
			}
			if (aParams.article.estUnDeploiement) {
				lClass.push("AvecMain");
			}
		}
		if (
			aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items ||
			aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.valider
		) {
			if (
				aParams.article.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.EvaluationHistorique
			) {
				lClass.push("Italique");
			}
		}
		return lClass.join(" ");
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.article.estUnDeploiement &&
			aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items
		);
	}
	avecDeploiementSurColonne(aParams) {
		return aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items;
	}
	getCouleurCellule(aParams) {
		if (this.avecEdition(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		if (!!aParams.article) {
			switch (aParams.article.getGenre()) {
				case Enumere_Ressource_1.EGenreRessource.MetaMatiere:
					return GCouleur.liste.cumul[0];
				case Enumere_Ressource_1.EGenreRessource.ElementPilier:
					return GCouleur.liste.cumul[1];
				case Enumere_Ressource_1.EGenreRessource.Competence:
				case Enumere_Ressource_1.EGenreRessource.SousItem:
					return GCouleur.liste.cumul[2];
				case Enumere_Ressource_1.EGenreRessource.Evaluation:
				case Enumere_Ressource_1.EGenreRessource.EvaluationHistorique:
					return GCouleur.liste.cumul[3];
			}
		}
		return GCouleur.liste.colonneFixe;
	}
	getIndentationCellule(aParams) {
		if (aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items) {
			return this.getIndentationCelluleSelonParente(aParams);
		}
		return 0;
	}
	avecMenuContextuel(aParams) {
		return !!aParams.article && !!this.parametres.callbackInitMenuContextuel;
	}
	remplirMenuContextuel(aParams) {
		this.parametres.callbackInitMenuContextuel(aParams);
	}
	avecAffichageDeLaDate(aArticle) {
		const result = false;
		if (
			!!aArticle &&
			!!aArticle.niveauDAcquisition &&
			UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
				aArticle.niveauDAcquisition,
			)
		) {
			return (
				aArticle.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier ||
				aArticle.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Competence ||
				aArticle.getGenre() === Enumere_Ressource_1.EGenreRessource.SousItem
			);
		}
		return result;
	}
}
exports.DonneesListe_BilanParDomaine = DonneesListe_BilanParDomaine;
DonneesListe_BilanParDomaine.colonnes = {
	items: "DCR_items",
	coefficient: "DCR_coefficient",
	niveau: "DCR_niveau",
	valider: "DCR_valider",
};
