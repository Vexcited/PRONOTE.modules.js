exports.DonneesListe_ParametresWidgets = void 0;
const AccessApp_1 = require("AccessApp");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_ParametresWidgets extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
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
		return !!this.etatUtilisateurSco.widgets[aParams.article.widget.genre] &&
			!!this.etatUtilisateurSco.widgets[aParams.article.widget.genre].visible
			? this.etatUtilisateurSco.widgets[aParams.article.widget.genre].visible
			: false;
	}
	setValueCB(aParams, aValue) {
		this.etatUtilisateurSco.widgets[aParams.article.widget.genre] = {
			visible: aValue,
		};
	}
}
exports.DonneesListe_ParametresWidgets = DonneesListe_ParametresWidgets;
module.exports = { DonneesListe_ParametresWidgets };
