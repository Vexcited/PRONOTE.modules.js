exports.DonneesListe_CategoriesMotifFd = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_CategoriesMotifFd extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_Selection: true,
			avecBoutonActionLigne: false,
			avecCB: false,
			avecCocheCBSurLigne: false,
		});
	}
	getValeur(aParams) {
		return aParams.article.getLibelle();
	}
}
exports.DonneesListe_CategoriesMotifFd = DonneesListe_CategoriesMotifFd;
