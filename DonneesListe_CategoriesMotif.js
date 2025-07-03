exports.DonneesListe_CategoriesMotif = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
class DonneesListe_CategoriesMotif extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEvnt_Selection: true });
	}
	getValeur(aParams) {
		return aParams.article.getLibelle();
	}
}
exports.DonneesListe_CategoriesMotif = DonneesListe_CategoriesMotif;
