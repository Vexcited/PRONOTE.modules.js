exports.DonneesListe_Simple_Fd = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_Simple_Fd extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_SelectionClick: true,
			avecEvnt_Selection: true,
			avecDeploiement: true,
		});
	}
	getTitreZonePrincipale(aDonnee) {
		return aDonnee.article.getLibelle();
	}
	avecBoutonActionLigne(aParams) {
		return false;
	}
}
exports.DonneesListe_Simple_Fd = DonneesListe_Simple_Fd;
