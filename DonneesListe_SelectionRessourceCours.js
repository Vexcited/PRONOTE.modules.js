exports.DonneesListe_SelectionRessourceCours = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class DonneesListe_SelectionRessourceCours extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aGenreRessource, aUniquementSallesReservable) {
		super(aDonnees);
		this.genreRessource = aGenreRessource;
		this.uniquementSallesReservable = aUniquementSallesReservable;
		this.setOptions({
			avecDeploiement: true,
			avecImageSurColonneDeploiement: true,
			avecEtatSaisie: false,
		});
		this.creerIndexUnique("Libelle");
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionRessourceCours.colonnes.coche:
				return (
					!this._estSalleNonReservable(aParams.article) &&
					!this._estMaterielNonReservable(aParams.article)
				);
			case DonneesListe_SelectionRessourceCours.colonnes.nbAReserver:
				return (
					this.genreRessource ===
						Enumere_Ressource_1.EGenreRessource.Materiel &&
					!aParams.article.nonEditable &&
					aParams.article.occurrencesLibres > 1
				);
			case DonneesListe_SelectionRessourceCours.colonnes.nom:
				return (
					!!this.options.optionsFenetre.editionCelluleAutorisee &&
					this.options.optionsFenetre.editionCelluleAutorisee(aParams)
				);
		}
		return false;
	}
	getColonneTransfertEdition(aParams) {
		if (this.avecEdition(aParams)) {
			return null;
		}
		return DonneesListe_SelectionRessourceCours.colonnes.coche;
	}
	avecSuppression(aParams) {
		return (
			!!this.options.optionsFenetre.suppressionLigneAutorisee &&
			this.options.optionsFenetre.suppressionLigneAutorisee(aParams.article)
		);
	}
	avecEvenementSelection(aParams) {
		return !this.avecEdition(aParams);
	}
	avecMultiSelectionSurCtrl() {
		return false;
	}
	avecMenuContextuel(Params) {
		return (
			super.avecMenuContextuel(Params) &&
			!!this.options.optionsFenetre.avecEditionListe
		);
	}
	getVisible(D) {
		switch (this.genreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Salle:
				return (
					!this.uniquementSallesReservable || !this._estSalleNonReservable(D)
				);
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				return (
					!this.uniquementSallesReservable || !this._estMaterielNonReservable(D)
				);
			default:
				return true;
		}
	}
	avecSelection(aParams) {
		if (this.genreRessource === Enumere_Ressource_1.EGenreRessource.Matiere) {
			return !!aParams.article && !aParams.article.autreMatiere;
		}
		return (
			this.genreRessource === Enumere_Ressource_1.EGenreRessource.LibelleCours
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionRessourceCours.colonnes.coche:
				return !!aParams.article.selectionne;
			case DonneesListe_SelectionRessourceCours.colonnes.nom:
				return aParams.article.getLibelle();
			case DonneesListe_SelectionRessourceCours.colonnes.nbAReserver:
				if (
					this.genreRessource !== Enumere_Ressource_1.EGenreRessource.Materiel
				) {
					return "";
				}
				return aParams.article._nbSaisieOccurrences || 1;
			case DonneesListe_SelectionRessourceCours.colonnes.nbDispo:
				return aParams.article.occurrencesLibres || 1;
			case DonneesListe_SelectionRessourceCours.colonnes.code:
				return aParams.article.code;
			case DonneesListe_SelectionRessourceCours.colonnes.capacite:
				return aParams.article.capacite || "-";
			case DonneesListe_SelectionRessourceCours.colonnes.infos:
				return aParams.article.infos || "";
			case DonneesListe_SelectionRessourceCours.colonnes.site:
				return aParams.article.strSite || "";
		}
		return "";
	}
	getTypeValeur(aParams) {
		if (
			aParams.idColonne === DonneesListe_SelectionRessourceCours.colonnes.coche
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	surCreation(aArticle, aValeurs) {
		aArticle.Libelle = aValeurs[0];
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionRessourceCours.colonnes.coche:
				aParams.article.selectionne = V;
				break;
			case DonneesListe_SelectionRessourceCours.colonnes.nbAReserver: {
				const lValeur = parseInt(V, 10);
				if (lValeur < 1 || lValeur > aParams.article.occurrencesLibres) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"ErreurMinMaxEntier",
						[1, aParams.article.occurrencesLibres],
					);
				}
				aParams.article._nbSaisieOccurrences = lValeur;
				break;
			}
			case DonneesListe_SelectionRessourceCours.colonnes.nom:
				aParams.article.Libelle = V;
				break;
			default:
		}
	}
	getMessageEditionImpossible(aParams, aErreur) {
		if (aErreur) {
			return aErreur;
		}
		return super.getMessageEditionImpossible(aParams, aErreur);
	}
	getControleCaracteresInput(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_SelectionRessourceCours.colonnes.nbAReserver
		) {
			return {
				mask: "/^0-9/i",
				tailleMax: aParams.article.occurrencesLibres.toString().length,
			};
		} else if (
			aParams.idColonne === DonneesListe_SelectionRessourceCours.colonnes.nom &&
			this.genreRessource === Enumere_Ressource_1.EGenreRessource.LibelleCours
		) {
			return { tailleMax: 20 };
		}
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionRessourceCours.colonnes.nom:
				return this.genreRessource !==
					Enumere_Ressource_1.EGenreRessource.Salle &&
					this.genreRessource !== Enumere_Ressource_1.EGenreRessource.Materiel
					? ""
					: this._estSalleNonReservable(aParams.article) ||
							this._estMaterielNonReservable(aParams.article)
						? ""
						: "Gras";
			case DonneesListe_SelectionRessourceCours.colonnes.nbAReserver:
			case DonneesListe_SelectionRessourceCours.colonnes.nbDispo:
				return "AlignementDroit";
		}
		return "";
	}
	getStyle(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionRessourceCours.colonnes.capacite:
				return aParams.article.capNonPropre &&
					this.genreRessource === Enumere_Ressource_1.EGenreRessource.Salle
					? "color:grey; font-style:italic;"
					: "";
		}
		return "";
	}
	getHintForce(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionRessourceCours.colonnes.nom:
				return this._estSalleNonReservable(aParams.article)
					? ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.SalleNonReservable",
							),
							[aParams.article.getLibelle()],
						)
					: this._estMaterielNonReservable(aParams.article)
						? ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"SaisieCours.MaterielNonReservable",
								),
								[aParams.article.getLibelle()],
							)
						: null;
		}
	}
	getIndentationCellule(aParams) {
		if (
			aParams.idColonne === DonneesListe_SelectionRessourceCours.colonnes.nom
		) {
			return this.getIndentationCelluleSelonParente(aParams);
		}
		return 0;
	}
	_estSalleNonReservable(aElement) {
		return (
			this.genreRessource === Enumere_Ressource_1.EGenreRessource.Salle &&
			aElement.nonEditable
		);
	}
	_estMaterielNonReservable(aElement) {
		return (
			this.genreRessource === Enumere_Ressource_1.EGenreRessource.Materiel &&
			aElement.nonEditable
		);
	}
}
exports.DonneesListe_SelectionRessourceCours =
	DonneesListe_SelectionRessourceCours;
(function (DonneesListe_SelectionRessourceCours) {
	let colonnes;
	(function (colonnes) {
		colonnes["coche"] = "coche";
		colonnes["nom"] = "nom";
		colonnes["code"] = "code";
		colonnes["nbAReserver"] = "nbAReserver";
		colonnes["nbDispo"] = "nbDispo";
		colonnes["capacite"] = "capacite";
		colonnes["infos"] = "infos";
		colonnes["site"] = "site";
	})(
		(colonnes =
			DonneesListe_SelectionRessourceCours.colonnes ||
			(DonneesListe_SelectionRessourceCours.colonnes = {})),
	);
})(
	DonneesListe_SelectionRessourceCours ||
		(exports.DonneesListe_SelectionRessourceCours =
			DonneesListe_SelectionRessourceCours =
				{}),
);
