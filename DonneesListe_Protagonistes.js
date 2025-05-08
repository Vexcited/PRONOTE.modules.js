const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	TypeGenreStatutProtagonisteIncident,
} = require("TypeGenreStatutProtagonisteIncident.js");
const { GDate } = require("ObjetDate.js");
class DonneesListe_Protagonistes extends ObjetDonneesListe {
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
				return ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecEdition(aParams) {
		if (
			!this._avecSaisie &&
			(aParams.idColonne !== DonneesListe_Protagonistes.colonnes.publication ||
				[EGenreEspace.Administrateur, EGenreEspace.PrimDirection].includes(
					GEtatUtilisateur.GenreEspace,
				))
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
						TypeGenreStatutProtagonisteIncident.GSP_Auteur
				);
			case DonneesListe_Protagonistes.colonnes.date:
				return (
					aParams.article.avecEditionDate &&
					this._saisiePunition &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
					aParams.article.mesure
				);
			case DonneesListe_Protagonistes.colonnes.pubDossier:
				return (
					aParams.article.avecEditionPublicationDossier &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
					aParams.article.dossier
				);
			case DonneesListe_Protagonistes.colonnes.publication:
				return (
					aParams.article.avecEditionPublication &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident.GSP_Auteur
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
						TypeGenreStatutProtagonisteIncident.GSP_Auteur
				);
			case DonneesListe_Protagonistes.colonnes.date:
				return (
					aParams.article.avecEditionDate &&
					this._saisiePunition &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident.GSP_Auteur
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
				return (
					aParams.article.avecEditionPublicationDossier &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
					aParams.article.dossier
				);
			case DonneesListe_Protagonistes.colonnes.publication:
				return (
					aParams.article.avecEditionPublication &&
					aParams.article.Genre ===
						TypeGenreStatutProtagonisteIncident.GSP_Auteur
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
					TypeGenreStatutProtagonisteIncident.GSP_Auteur)
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
						? GTraductions.getValeur("incidents.protagonistes.aucuneMesure")
						: aParams.article.avecSanction
							? GTraductions.getValeur("incidents.protagonistes.enAttente")
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
					? GDate.formatDate(aParams.article.dateARParent, "%JJ/%MM/%AAAA")
					: "";
		}
		return "";
	}
	getHintForce(aParams) {
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
						case TypeGenreStatutProtagonisteIncident.GSP_Auteur:
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Auteur,
								lTypeProtagoniste.getLibelle(),
								true,
								lTypeProtagoniste,
							);
							break;
						case TypeGenreStatutProtagonisteIncident.GSP_Victime:
							aParametres.menuContextuel.addSeparateur();
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Victime_Eleve,
								lTypeProtagoniste.getLibelle() +
									" > " +
									GTraductions.getValeur("Eleve"),
								true,
								lTypeProtagoniste,
							);
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Victime_Professeur,
								lTypeProtagoniste.getLibelle() +
									" > " +
									GTraductions.getValeur("Professeur"),
								true,
								lTypeProtagoniste,
							);
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Victime_Personnel,
								lTypeProtagoniste.getLibelle() +
									" > " +
									GTraductions.getValeur("Personnel"),
								true,
								lTypeProtagoniste,
							);
							break;
						case TypeGenreStatutProtagonisteIncident.GSP_Temoin:
							aParametres.menuContextuel.addSeparateur();
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Temoin_Eleve,
								lTypeProtagoniste.getLibelle() +
									" > " +
									GTraductions.getValeur("Eleve"),
								true,
								lTypeProtagoniste,
							);
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Temoin_Professeur,
								lTypeProtagoniste.getLibelle() +
									" > " +
									GTraductions.getValeur("Professeur"),
								true,
								lTypeProtagoniste,
							);
							aParametres.menuContextuel.addCommande(
								DonneesListe_Protagonistes.genreAction.ajout_Temoin_Personnel,
								lTypeProtagoniste.getLibelle() +
									" > " +
									GTraductions.getValeur("Personnel"),
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
				EGenreCommandeMenu.Suppression,
				GTraductions.getValeur("incidents.protagonistes.supprimer"),
				this.avecSuppression(aParametres) && !aParametres.nonEditable,
			);
		}
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		this.callbackMenuContextuel(aParametres.ligneMenu);
	}
}
DonneesListe_Protagonistes.colonnes = {
	identite: "DL_Protagonistes_identite",
	implication: "DL_Protagonistes_implication",
	avecSanction: "DL_Protagonistes_avecSanction",
	sansSanction: "DL_Protagonistes_sansSanction",
	mesure: "DL_Protagonistes_mesure",
	date: "DL_Protagonistes_date",
	pubDossier: "DL_Protagonistes_pubDossier",
	publication: "DL_Protagonistes_publication",
	vuLe: "DL_Protagonistes_vuLe",
};
DonneesListe_Protagonistes.genreAction = {
	ajout_Auteur: 1,
	ajout_Victime_Eleve: 2,
	ajout_Victime_Professeur: 3,
	ajout_Victime_Personnel: 4,
	ajout_Temoin_Eleve: 5,
	ajout_Temoin_Professeur: 6,
	ajout_Temoin_Personnel: 7,
};
module.exports = { DonneesListe_Protagonistes };
