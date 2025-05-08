const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
class DonneesListe_ParametresWidgets extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.suffixIdContenu = "_suffContent";
		this.suffixIdDeployer = "_suffDeployer";
		this.setOptions({
			avecCB: true,
			avecCocheCBSurLigne: true,
			avecBoutonActionLigne: false,
			avecSelection: true,
		});
	}
	avecMenuContextuel() {
		return false;
	}
	getTitreZonePrincipale(aParams) {
		let lNomWidget = "";
		if (!!aParams.article.widget.titreDansParametrage) {
			lNomWidget = aParams.article.widget.titreDansParametrage;
		} else if (!!aParams.article.widget.titre) {
			lNomWidget = aParams.article.widget.titre;
		}
		return lNomWidget;
	}
	getValueCB(aParams) {
		return !!GEtatUtilisateur.widgets[aParams.article.widget.genre] &&
			!!GEtatUtilisateur.widgets[aParams.article.widget.genre].visible
			? GEtatUtilisateur.widgets[aParams.article.widget.genre].visible
			: false;
	}
	setValueCB(aParams, aValue) {
		GEtatUtilisateur.widgets[aParams.article.widget.genre] = {
			visible: aValue,
		};
	}
}
module.exports = { DonneesListe_ParametresWidgets };
