const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_FicheBrevetControle extends ObjetDonneesListe {
	constructor(aControlFinal) {
		super(aControlFinal.listeControleFinal);
		this.controlFinal = aControlFinal;
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetControle.colonnes.controle:
				return aParams.article.getLibelle();
			case DonneesListe_FicheBrevetControle.colonnes.points:
				return aParams.article.points.getNote();
			case DonneesListe_FicheBrevetControle.colonnes.bareme:
				return aParams.article.bareme.getNoteEntier();
		}
		return "";
	}
	getHintHtmlForce(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetControle.colonnes.controle:
				return aParams.article.hint || "";
		}
		return "";
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetControle.colonnes.controle:
				return GTraductions.getValeur("FicheBrevet.TotalDesPoints");
			case DonneesListe_FicheBrevetControle.colonnes.points:
				return this.controlFinal.totalPoints.getNote();
			case DonneesListe_FicheBrevetControle.colonnes.bareme:
				return this.controlFinal.totalBareme.getNoteEntier();
		}
		return "";
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetControle.colonnes.points:
			case DonneesListe_FicheBrevetControle.colonnes.bareme:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
	getClassTotal(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetControle.colonnes.points:
			case DonneesListe_FicheBrevetControle.colonnes.bareme:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
}
DonneesListe_FicheBrevetControle.colonnes = {
	controle: "FicheBrevetControle",
	points: "FicheBrevetControlePoints",
	bareme: "FicheBrevetControleBareme",
};
module.exports = { DonneesListe_FicheBrevetControle };
