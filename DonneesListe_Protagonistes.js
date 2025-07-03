exports.DonneesListe_Protagonistes = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreStatutProtagonisteIncident_1 = require("TypeGenreStatutProtagonisteIncident");
const ObjetDate_1 = require("ObjetDate");
class DonneesListe_Protagonistes extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this._avecSaisie = aParam.avecSaisie;
		this._saisiePunition = aParam.saisiePunition;
		this.listeTypesProtagonistes = aParam.typesProtagonistes;
		this.callbackMenuContextuel = aParam.evenementMenuContextuel;
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_ApresSuppression: true,
			avecContenuTronque: true,
		});
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Protagonistes.colonnes.pubDossier:
			case DonneesListe_Protagonistes.colonnes.publication:
			case DonneesListe_Protagonistes.colonnes.avecSanction:
			case DonneesListe_Protagonistes.colonnes.sansSanction:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecEdition(aParams) {
		if (
			!this._avecSaisie &&
			(aParams.idColonne !== DonneesListe_Protagonistes.colonnes.publication ||
				[
					Enumere_Espace_1.EGenreEspace.Administrateur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
				].includes(GEtatUtilisateur.GenreEspace))
		) {
			return false;
		}
		switch (aParams.idColonne) {
			case DonneesListe_Protagonistes.colonnes.avecSanction:
			case DonneesListe_Protagonistes.colonnes.sansSanction:
			case DonneesListe_Protagonistes.colonnes.mesure:
				return (
					aParams.article.avecEditionMesure &&
					this._saisiePunition &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur
				);
			case DonneesListe_Protagonistes.colonnes.date:
				return !!(
					aParams.article.avecEditionDate &&
					this._saisiePunition &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
					aParams.article.mesure
				);
			case DonneesListe_Protagonistes.colonnes.pubDossier:
				return !!(
					aParams.article.avecEditionPublicationDossier &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
					aParams.article.dossier
				);
			case DonneesListe_Protagonistes.colonnes.publication:
				return (
					aParams.article.avecEditionPublication &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur
				);
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		if (!this._avecSaisie) {
			return false;
		}
		switch (aParams.idColonne) {
			case DonneesListe_Protagonistes.colonnes.avecSanction:
			case DonneesListe_Protagonistes.colonnes.sansSanction:
			case DonneesListe_Protagonistes.colonnes.mesure:
				return (
					aParams.article.avecEditionMesure &&
					this._saisiePunition &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur
				);
			case DonneesListe_Protagonistes.colonnes.date:
				return (
					aParams.article.avecEditionDate &&
					this._saisiePunition &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur
				);
		}
		return false;
	}
	avecEvenementApresEdition(aParams) {
		if (!this._avecSaisie) {
			return false;
		}
		switch (aParams.idColonne) {
			case DonneesListe_Protagonistes.colonnes.pubDossier:
				return !!(
					aParams.article.avecEditionPublicationDossier &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
					aParams.article.dossier
				);
			case DonneesListe_Protagonistes.colonnes.publication:
				return (
					aParams.article.avecEditionPublication &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur
				);
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_Protagonistes.colonnes.pubDossier:
				if (aParams.article.dossier) {
					aParams.article.dossier.publication = V;
				}
				break;
			case DonneesListe_Protagonistes.colonnes.publication:
				aParams.article.publication = V;
				break;
			default:
				break;
		}
	}
	avecSuppression(aParams) {
		return (
			this._avecSaisie &&
			(aParams.article.avecEditionMesure ||
				aParams.article.Genre !==
					TypeGenreStatutProtagonisteIncident_1
						.TypeGenreStatutProtagonisteIncident.GSP_Auteur)
		);
	}
	getLibelleDraggable(aParams) {
		return aParams.article.nom;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Protagonistes.colonnes.identite:
				return aParams.article.nom || "";
			case DonneesListe_Protagonistes.colonnes.implication:
				return aParams.article.getLibelle();
			case DonneesListe_Protagonistes.colonnes.avecSanction:
				return aParams.article.avecSanction;
			case DonneesListe_Protagonistes.colonnes.sansSanction:
				return aParams.article.sansSanction;
			case DonneesListe_Protagonistes.colonnes.mesure:
				return aParams.article.mesure && aParams.article.mesure.nature
					? aParams.article.mesure.nature.getLibelle()
					: aParams.article.sansSanction
						? ObjetTraduction_1.GTraductions.getValeur(
								"incidents.protagonistes.aucuneMesure",
							)
						: aParams.article.avecSanction
							? ObjetTraduction_1.GTraductions.getValeur(
									"incidents.protagonistes.enAttente",
								)
							: "";
			case DonneesListe_Protagonistes.colonnes.date:
				return aParams.article.strDate || "";
			case DonneesListe_Protagonistes.colonnes.pubDossier:
				return aParams.article.dossier
					? !!aParams.article.dossier.publication
					: false;
			case DonneesListe_Protagonistes.colonnes.publication:
				return !!aParams.article.publication;
			case DonneesListe_Protagonistes.colonnes.vuLe:
				return aParams.article.dateARParent
					? ObjetDate_1.GDate.formatDate(
							aParams.article.dateARParent,
							"%JJ/%MM/%AAAA",
						)
					: "";
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Protagonistes.colonnes.date:
				if (aParams.article.mesure && aParams.article.mesure.dateDemande) {
					return aParams.article.hintDate || "";
				}
		}
		return "";
	}
	avecMenuContextuel(aParams) {
		if (aParams.ligne === -1 && this._avecSaisie) {
			return true;
		}
		return !!(aParams.article && aParams.ligne >= 0);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.ligne === -1) {
			if (this.listeTypesProtagonistes) {
				this.listeTypesProtagonistes.parcourir((lTypeProtagoniste) => {
					switch (lTypeProtagoniste.getGenre()) {
						case TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Auteur:
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Auteur,
								lTypeProtagoniste.getLibelle(),
								true,
								lTypeProtagoniste,
							);
							break;
						case TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Victime:
							aParametres.menuContextuel.addSeparateur();
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Victime_Eleve,
								lTypeProtagoniste.getLibelle() +
									" > " +
									ObjetTraduction_1.GTraductions.getValeur("Eleve"),
								true,
								lTypeProtagoniste,
							);
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Victime_Professeur,
								lTypeProtagoniste.getLibelle() +
									" > " +
									ObjetTraduction_1.GTraductions.getValeur("Professeur"),
								true,
								lTypeProtagoniste,
							);
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Victime_Personnel,
								lTypeProtagoniste.getLibelle() +
									" > " +
									ObjetTraduction_1.GTraductions.getValeur("Personnel"),
								true,
								lTypeProtagoniste,
							);
							break;
						case TypeGenreStatutProtagonisteIncident_1
							.TypeGenreStatutProtagonisteIncident.GSP_Temoin:
							aParametres.menuContextuel.addSeparateur();
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Temoin_Eleve,
								lTypeProtagoniste.getLibelle() +
									" > " +
									ObjetTraduction_1.GTraductions.getValeur("Eleve"),
								true,
								lTypeProtagoniste,
							);
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Temoin_Professeur,
								lTypeProtagoniste.getLibelle() +
									" > " +
									ObjetTraduction_1.GTraductions.getValeur("Professeur"),
								true,
								lTypeProtagoniste,
							);
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Temoin_Personnel,
								lTypeProtagoniste.getLibelle() +
									" > " +
									ObjetTraduction_1.GTraductions.getValeur("Personnel"),
								true,
								lTypeProtagoniste,
							);
							break;
						default:
							break;
					}
				});
			}
		} else {
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				ObjetTraduction_1.GTraductions.getValeur(
					"incidents.protagonistes.supprimer",
				),
				this.avecSuppression(aParametres) && !aParametres.nonEditable,
			);
		}
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		this.callbackMenuContextuel(aParametres.ligneMenu);
	}
}
exports.DonneesListe_Protagonistes = DonneesListe_Protagonistes;
(function (DonneesListe_Protagonistes) {
	let colonnes;
	(function (colonnes) {
		colonnes["identite"] = "DL_Protagonistes_identite";
		colonnes["implication"] = "DL_Protagonistes_implication";
		colonnes["avecSanction"] = "DL_Protagonistes_avecSanction";
		colonnes["sansSanction"] = "DL_Protagonistes_sansSanction";
		colonnes["mesure"] = "DL_Protagonistes_mesure";
		colonnes["date"] = "DL_Protagonistes_date";
		colonnes["pubDossier"] = "DL_Protagonistes_pubDossier";
		colonnes["publication"] = "DL_Protagonistes_publication";
		colonnes["vuLe"] = "DL_Protagonistes_vuLe";
	})(
		(colonnes =
			DonneesListe_Protagonistes.colonnes ||
			(DonneesListe_Protagonistes.colonnes = {})),
	);
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["ajout_Auteur"] = 1)] = "ajout_Auteur";
		genreAction[(genreAction["ajout_Victime_Eleve"] = 2)] =
			"ajout_Victime_Eleve";
		genreAction[(genreAction["ajout_Victime_Professeur"] = 3)] =
			"ajout_Victime_Professeur";
		genreAction[(genreAction["ajout_Victime_Personnel"] = 4)] =
			"ajout_Victime_Personnel";
		genreAction[(genreAction["ajout_Temoin_Eleve"] = 5)] = "ajout_Temoin_Eleve";
		genreAction[(genreAction["ajout_Temoin_Professeur"] = 6)] =
			"ajout_Temoin_Professeur";
		genreAction[(genreAction["ajout_Temoin_Personnel"] = 7)] =
			"ajout_Temoin_Personnel";
	})(
		(genreAction =
			DonneesListe_Protagonistes.genreAction ||
			(DonneesListe_Protagonistes.genreAction = {})),
	);
})(
	DonneesListe_Protagonistes ||
		(exports.DonneesListe_Protagonistes = DonneesListe_Protagonistes = {}),
);
