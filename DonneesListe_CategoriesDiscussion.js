exports.DonneesListe_CategoriesDiscussion = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_CategoriesDiscussion extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aListeDonnees) {
		super(aListeDonnees);
		this.setOptions({
			avecTri: false,
			avecTrimSurEdition: true,
			avecEvnt_Edition: true,
			avecEtatSaisie: false,
			avecEvnt_ApresCreation: true,
			avecEvnt_Suppression: true,
			avecInterruptionSuppression: true,
		});
		this.creerIndexUnique(["Libelle"]);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_CategoriesDiscussion.colonnes.coche:
				return aParams.article.coche;
			case DonneesListe_CategoriesDiscussion.colonnes.couleur:
				return [
					'<div style="',
					ObjetStyle_1.GStyle.composeHeight(14),
					ObjetStyle_1.GStyle.composeWidth(14),
					ObjetStyle_1.GStyle.composeCouleurBordure("black"),
					ObjetStyle_1.GStyle.composeCouleurFond(
						aParams.article.etiquette.couleur,
					),
					'">',
					"</div>",
				].join("");
			case DonneesListe_CategoriesDiscussion.colonnes.nom:
				return aParams.article.etiquette.getLibelle();
			case DonneesListe_CategoriesDiscussion.colonnes.abr:
				return aParams.article.etiquette.abr;
			default:
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_CategoriesDiscussion.colonnes.coche:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_CategoriesDiscussion.colonnes.couleur:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecEvenementEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.couleur
		);
	}
	avecEvenementApresEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.nom ||
			aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.abr
		);
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_CategoriesDiscussion.colonnes.coche:
				aParams.article.coche = V;
				break;
			case DonneesListe_CategoriesDiscussion.colonnes.nom:
				aParams.article.Libelle = aParams.valeur;
				break;
			case DonneesListe_CategoriesDiscussion.colonnes.abr:
				aParams.article.abr = aParams.valeur;
				break;
			default:
		}
	}
	getControleCaracteresInput(aParams) {
		return {
			tailleMax:
				aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.abr
					? 1
					: 1000,
		};
	}
	autoriserChaineVideSurEdition(aParams) {
		return aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.abr;
	}
	surCreation(aArticle, V) {
		aArticle.Libelle =
			V[
				this.getNumeroColonneDId(DonneesListe_CategoriesDiscussion.colonnes.nom)
			];
		aArticle.etiquette = new ObjetElement_1.ObjetElement(aArticle.Libelle);
	}
	getMessageSuppressionConfirmation(aArticle) {
		return aArticle.etiquette && aArticle.etiquette.utilise
			? ObjetTraduction_1.GTraductions.getValeur(
					"Messagerie.categorie.CategorieEstUtilisee",
				)
			: "";
	}
	getVisible(aArticle) {
		return aArticle.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation;
	}
}
exports.DonneesListe_CategoriesDiscussion = DonneesListe_CategoriesDiscussion;
DonneesListe_CategoriesDiscussion.colonnes = {
	coche: "DLCD_coche",
	couleur: "DLCD_couleur",
	nom: "DLCD_nom",
	abr: "DLCD_abr",
};
