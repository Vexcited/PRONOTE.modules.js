const { PageOffresStages } = require("PageOffresStages.js");
const {
	ObjetRequeteListeOffresStages,
} = require("ObjetRequeteListeOffresStages.js");
const { InterfacePage } = require("InterfacePage.js");
class PageOffresStagesPN extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identPage = this.add(
			PageOffresStages,
			_evntPageOffresStage.bind(this),
			_initPageOffresStage.bind(this),
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identPage;
	}
	recupererDonnees() {
		new ObjetRequeteListeOffresStages(
			this,
			_actionSurRecupererListeOffres.bind(this),
		).lancerRequete();
	}
}
function _evntPageOffresStage() {}
function _initPageOffresStage(aInstance) {
	aInstance.setOptions({ avecPeriode: true, avecPeriodeUnique: false });
}
function _actionSurRecupererListeOffres(aParam) {
	this.listeEntreprises = aParam.listeEntreprises;
	this.getInstance(this.identPage).setDonnees(this.listeEntreprises);
}
module.exports = { PageOffresStagesPN };
