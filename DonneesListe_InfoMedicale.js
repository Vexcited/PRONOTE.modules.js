const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { EGenreEtat } = require("Enumere_Etat.js");
class DonneesListe_InfoMedicale extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecCB: true,
			avecSelection: false,
			avecSuppression: false,
			avecDeploiement: true,
			avecCocheCBSurLigne: true,
		});
	}
	getValueCB(aParams) {
		return aParams.article ? aParams.article.Actif : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.setEtat(EGenreEtat.Modification);
		aParams.article.Actif = aValue;
	}
	getCouleurCellule() {
		return ObjetDonneesListe.ECouleurCellule.Blanc;
	}
	avecMenuContextuel() {
		return false;
	}
	avecBoutonActionLigne() {
		return false;
	}
	getColonneTransfertEdition() {
		return DonneesListe_InfoMedicale.colonnes.coche;
	}
}
DonneesListe_InfoMedicale.colonnes = {
	coche: "infoMedicale_coche",
	libelle: "infoMedicale_libelle",
};
module.exports = { DonneesListe_InfoMedicale };
