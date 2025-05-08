const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
class DonneesListe_FicheBrevetResultat extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetResultat.colonnes.competences:
				return aParams.article.getLibelle();
			case DonneesListe_FicheBrevetResultat.colonnes.objectifs:
				return aParams.article.getGenre();
			case DonneesListe_FicheBrevetResultat.colonnes.points:
				return aParams.article.points.getNoteEntier();
		}
		return "";
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetResultat.colonnes.points:
				return "AlignementDroit";
		}
		return "";
	}
}
DonneesListe_FicheBrevetResultat.colonnes = {
	competences: "FicheBrevetEnseignCompl",
	objectifs: "FicheBrevetEnseignComplObjectif",
	points: "FicheBrevetEnseignComplPoint",
};
module.exports = { DonneesListe_FicheBrevetResultat };
