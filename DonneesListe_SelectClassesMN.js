const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
class DonneesListe_SelectClassesMN extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			flatDesignMinimal: true,
			avecCB: true,
			avecCocheCBSurLigne: true,
			avecDeploiement: true,
			avecEventDeploiementSurCellule: false,
			avecTri: false,
			avecMenuContextuel: false,
			avecBoutonActionLigne: false,
		});
	}
	getValueCB(aParams) {
		return aParams.article.estUnDeploiement
			? this.getEtatCocheSelonFils(aParams.article, aParams)
			: !!aParams.article.cmsActif;
	}
	setValueCB(aParams, aValue) {
		aParams.article.cmsActif = aValue;
		if (aParams.article.estUnDeploiement) {
			this.Donnees.parcourir((aFils) => {
				if (aFils.pere === aParams.article) {
					aFils.cmsActif = aValue;
				}
			});
		} else {
			let lTousLesFilsSelectionne = true;
			let lPere;
			this.Donnees.parcourir((aFils) => {
				if (aFils.estUnDeploiement) {
					lPere = aFils;
				}
				if (aFils.pere && lTousLesFilsSelectionne) {
					lTousLesFilsSelectionne = aFils.cmsActif;
				}
			});
			lPere.cmsActif = lTousLesFilsSelectionne;
		}
	}
}
module.exports = DonneesListe_SelectClassesMN;
