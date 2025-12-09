exports.DonneesListe_FicheBrevetControle = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeColonneFicheBrevet_1 = require("TypeColonneFicheBrevet");
class DonneesListe_FicheBrevetControle extends ObjetDonneesListe_1.ObjetDonneesListe {
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
		var _a;
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Libelle:
				return aParams.article.getLibelle();
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Points:
				return aParams.article.points.getNote();
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Bareme:
				return aParams.article.bareme.getNoteEntier();
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Coeff:
				return (_a = aParams.article.coeff) !== null && _a !== void 0 ? _a : "";
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Libelle:
				return aParams.article.hint || "";
		}
		return "";
	}
	getContenuTotal(aParams) {
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Libelle:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.TotalDesPoints",
				);
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Points:
				return this.controlFinal.totalPoints.getNote();
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Bareme:
				return this.controlFinal.totalBareme.getNoteEntier();
		}
		return "";
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Points:
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Bareme:
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Coeff:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
	getClassTotal(aParams) {
		const lClasses = [];
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Points:
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Bareme:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
}
exports.DonneesListe_FicheBrevetControle = DonneesListe_FicheBrevetControle;
