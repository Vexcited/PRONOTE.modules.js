exports.DonneesListe_Actions_Fd = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_Actions_Fd extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecCB: true,
			avecEvnt_CB: true,
			avecCocheCBSurLigne: true,
			avecBoutonActionLigne: false,
			avecEllipsis: false,
		});
	}
	getValueCB(aDonnees) {
		if (!!aDonnees.article.cmsActif) {
			return aDonnees.article.cmsActif;
		}
	}
	setValueCB(aDonnees, aValue) {
		aDonnees.article.cmsActif = aValue;
	}
}
exports.DonneesListe_Actions_Fd = DonneesListe_Actions_Fd;
