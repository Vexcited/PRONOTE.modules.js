exports.DonneesListe_InfoMedicale = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_Etat_1 = require("Enumere_Etat");
class DonneesListe_InfoMedicale extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecCB: true,
			avecSelection: false,
			avecDeploiement: true,
			avecCocheCBSurLigne: true,
		});
	}
	getValueCB(aParams) {
		return aParams.article ? aParams.article.Actif : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		aParams.article.Actif = aValue;
	}
	avecMenuContextuel() {
		return false;
	}
	avecBoutonActionLigne() {
		return false;
	}
}
exports.DonneesListe_InfoMedicale = DonneesListe_InfoMedicale;
