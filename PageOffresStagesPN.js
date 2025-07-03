exports.PageOffresStagesPN = void 0;
const PageOffresStages_1 = require("PageOffresStages");
const ObjetRequeteListeOffresStages_1 = require("ObjetRequeteListeOffresStages");
const InterfacePage_1 = require("InterfacePage");
class PageOffresStagesPN extends InterfacePage_1.InterfacePage {
	construireInstances() {
		this.identPage = this.add(
			PageOffresStages_1.PageOffresStages,
			null,
			_initPageOffresStage.bind(this),
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identPage;
	}
	recupererDonnees() {
		new ObjetRequeteListeOffresStages_1.ObjetRequeteListeOffresStages(
			this,
			this.actionSurRecupererListeOffres.bind(this),
		).lancerRequete();
	}
	actionSurRecupererListeOffres(aParam) {
		this.getInstance(this.identPage).setDonnees(aParam.listeEntreprises);
	}
}
exports.PageOffresStagesPN = PageOffresStagesPN;
function _initPageOffresStage(aInstance) {
	aInstance.setOptions({ avecPeriode: true, avecPeriodeUnique: false });
}
