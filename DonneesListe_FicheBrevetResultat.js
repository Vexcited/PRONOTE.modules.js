exports.DonneesListe_FicheBrevetResultat = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
class DonneesListe_FicheBrevetResultat extends ObjetDonneesListe_1.ObjetDonneesListe {
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
exports.DonneesListe_FicheBrevetResultat = DonneesListe_FicheBrevetResultat;
(function (DonneesListe_FicheBrevetResultat) {
	let colonnes;
	(function (colonnes) {
		colonnes["competences"] = "FicheBrevetEnseignCompl";
		colonnes["objectifs"] = "FicheBrevetEnseignComplObjectif";
		colonnes["points"] = "FicheBrevetEnseignComplPoint";
	})(
		(colonnes =
			DonneesListe_FicheBrevetResultat.colonnes ||
			(DonneesListe_FicheBrevetResultat.colonnes = {})),
	);
})(
	DonneesListe_FicheBrevetResultat ||
		(exports.DonneesListe_FicheBrevetResultat =
			DonneesListe_FicheBrevetResultat =
				{}),
);
