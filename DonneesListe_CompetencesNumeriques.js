exports.DonneesListe_CompetencesNumeriques = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class DonneesListe_CompetencesNumeriques extends ObjetDonneesListe_1.ObjetDonneesListe {
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
		const lHtml = [];
		switch (aParams.idColonne) {
			case DonneesListe_CompetencesNumeriques.colonnes.items:
				return (
					aParams.article.getLibelle() +
					(!!aParams.article.libelleCorrige
						? " - ( " +
							ObjetChaine_1.GChaine.composerUrlLienExterne({
								documentJoint: aParams.article,
								libelle: aParams.article.libelleCorrige,
								libelleEcran: aParams.article.libelleCorrige,
								title:
									ObjetTraduction_1.GTraductions.getValeur("AfficherCorrige"),
							}) +
							" )"
						: "")
				);
			case DonneesListe_CompetencesNumeriques.colonnes.evaluations:
				return UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
					{
						listeNiveaux: aParams.article.resultats,
						hint: aParams.article.hintResultats,
					},
				);
			case DonneesListe_CompetencesNumeriques.colonnes.niveau:
				if (
					aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier
				) {
					return aParams.article.niveauDEquivalenceCE
						? aParams.article.niveauDEquivalenceCE.getLibelle()
						: "";
				}
				if (!!aParams.article.niveauDAcquisition) {
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
					if (!!aParams.article.observation) {
						lHtml.push(
							'<i style="position:absolute; right:0px; bottom:0px;" class=" icon_comment" role="presentation"></i>',
						);
					}
				}
				return lHtml.join("");
		}
		return "";
	}
	getTooltip(aParams) {
		const lHintNiveau = [];
		switch (aParams.idColonne) {
			case DonneesListe_CompetencesNumeriques.colonnes.niveau:
				if (
					aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier
				) {
					lHintNiveau.push(
						aParams.article.niveauDEquivalenceCE
							? aParams.article.niveauDEquivalenceCE.getLibelle()
							: "",
					);
				} else {
					const lLibelleNiveauAcqui =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
							aParams.article.niveauDAcquisition,
						);
					if (
						aParams.article.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Evaluation ||
						aParams.article.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.EvaluationHistorique
					) {
						if (!!aParams.article.hint) {
							lHintNiveau.push(aParams.article.hint);
							lHintNiveau.push("<br/><br/>");
						}
						lHintNiveau.push(
							"<b><u>",
							ObjetTraduction_1.GTraductions.getValeur(
								"competences.evaluation",
							),
							"</u></b> : ",
							lLibelleNiveauAcqui,
						);
						if (!!aParams.article.observation) {
							const lObs = aParams.article.observation.replace(/\n/g, "<br/>");
							lHintNiveau.push("<br/>", lObs);
							if (!!aParams.article.observationPubliee) {
								lHintNiveau.push(
									" (",
									ObjetTraduction_1.GTraductions.getValeur(
										"competences.PublieSurEspaceParent",
									),
									")",
								);
							}
						}
					} else {
						lHintNiveau.push(lLibelleNiveauAcqui);
					}
				}
				return lHintNiveau.join("");
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_CompetencesNumeriques.colonnes.items:
			case DonneesListe_CompetencesNumeriques.colonnes.niveau:
			case DonneesListe_CompetencesNumeriques.colonnes.evaluations:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_CompetencesNumeriques.colonnes.niveau:
				return !!aParams.article.niveauEstEditable;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		return this.avecEdition(aParams);
	}
	getClass(aParams) {
		const lClass = [];
		if (
			aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.niveau
		) {
			lClass.push("AlignementMilieu");
		}
		if (
			aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
		) {
			if (
				aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Pilier ||
				aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier
			) {
				lClass.push("Gras");
			}
			if (aParams.article.estUnDeploiement) {
				lClass.push("AvecMain");
			}
		}
		if (
			aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
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
			aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
		);
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
		);
	}
	getCouleurCellule(aParams) {
		if (this.avecEdition(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		if (!!aParams.article) {
			switch (aParams.article.getGenre()) {
				case Enumere_Ressource_1.EGenreRessource.Pilier:
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
		if (
			aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
		) {
			return this.getIndentationCelluleSelonParente(aParams);
		}
		return 0;
	}
	avecMenuContextuel(aParams) {
		return !!aParams.article && !!this.parametres.callbackInitMenuContextuel;
	}
	remplirMenuContextuel(aParametres) {
		this.parametres.callbackInitMenuContextuel(aParametres);
	}
}
exports.DonneesListe_CompetencesNumeriques = DonneesListe_CompetencesNumeriques;
DonneesListe_CompetencesNumeriques.colonnes = {
	items: "DCR_items",
	evaluations: "DCR_evaluations",
	niveau: "DCR_niveau",
};
