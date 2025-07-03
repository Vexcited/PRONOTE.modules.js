exports.DonneesListe_FicheBrevetBilan = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_FicheBrevetBilan extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aBrevet) {
		super(aBrevet.listeBrevet);
		this.brevet = aBrevet;
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetBilan.colonnes.bilan:
				return aParams.article.getLibelle();
			case DonneesListe_FicheBrevetBilan.colonnes.points:
				if (aParams.colonne === 1 && aParams.article.Genre === 0) {
					return aParams.article.points.getNoteEntier();
				}
				return aParams.article.points.getNote();
			case DonneesListe_FicheBrevetBilan.colonnes.bareme:
				return aParams.article.bareme.getNoteEntier();
		}
		return "";
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetBilan.colonnes.bilan:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.TotalDesPoints",
				);
			case DonneesListe_FicheBrevetBilan.colonnes.points:
				return this.brevet.totalPoints ? this.brevet.totalPoints.getNote() : "";
			case DonneesListe_FicheBrevetBilan.colonnes.bareme:
				return this.brevet.totalBareme.getNoteEntier();
		}
		return "";
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetBilan.colonnes.points:
			case DonneesListe_FicheBrevetBilan.colonnes.bareme:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
	getClassTotal(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetBilan.colonnes.points:
			case DonneesListe_FicheBrevetBilan.colonnes.bareme:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
}
exports.DonneesListe_FicheBrevetBilan = DonneesListe_FicheBrevetBilan;
(function (DonneesListe_FicheBrevetBilan) {
	let colonnes;
	(function (colonnes) {
		colonnes["bilan"] = "FicheBrevetBilan";
		colonnes["points"] = "FicheBrevetBilanPoints";
		colonnes["bareme"] = "FicheBrevetBilanBareme";
	})(
		(colonnes =
			DonneesListe_FicheBrevetBilan.colonnes ||
			(DonneesListe_FicheBrevetBilan.colonnes = {})),
	);
})(
	DonneesListe_FicheBrevetBilan ||
		(exports.DonneesListe_FicheBrevetBilan = DonneesListe_FicheBrevetBilan =
			{}),
);
