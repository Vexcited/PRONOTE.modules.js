exports.DonneesListe_SelectAnnees_Fd = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_SelectAnnees_Fd extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.donnees = aDonnees;
		this.setOptions({
			avecCB: true,
			avecEvnt_CB: true,
			avecCocheCBSurLigne: true,
			avecSelection: false,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aDonnee) {
		return aDonnee.article.getLibelle();
	}
	getValueCB(aParams) {
		return aParams.article.cmsActif;
	}
	_getNbrAnneesActives() {
		return this.donnees
			.getListeElements((D) => {
				return !!D.cmsActif;
			})
			.count();
	}
	setValueCB(aParams, aValue) {
		aParams.article.cmsActif = aValue;
		if (this._getNbrAnneesActives() === 0) {
			aParams.article.cmsActif = true;
		}
	}
}
exports.DonneesListe_SelectAnnees_Fd = DonneesListe_SelectAnnees_Fd;
