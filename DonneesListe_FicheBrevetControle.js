exports.DonneesListe_FicheBrevetControle = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
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
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetControle.colonnes.controle:
				return aParams.article.hint || "";
		}
		return "";
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetControle.colonnes.controle:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.TotalDesPoints",
				);
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
exports.DonneesListe_FicheBrevetControle = DonneesListe_FicheBrevetControle;
(function (DonneesListe_FicheBrevetControle) {
	let colonnes;
	(function (colonnes) {
		colonnes["controle"] = "FicheBrevetControle";
		colonnes["points"] = "FicheBrevetControlePoints";
		colonnes["bareme"] = "FicheBrevetControleBareme";
	})(
		(colonnes =
			DonneesListe_FicheBrevetControle.colonnes ||
			(DonneesListe_FicheBrevetControle.colonnes = {})),
	);
})(
	DonneesListe_FicheBrevetControle ||
		(exports.DonneesListe_FicheBrevetControle =
			DonneesListe_FicheBrevetControle =
				{}),
);
