exports.GestionnaireBlocVignettesMediatheque = void 0;
const GestionnaireBloc_1 = require("GestionnaireBloc");
const ObjetVignetteMediatheque_1 = require("ObjetVignetteMediatheque");
class GestionnaireBlocVignettesMediatheque extends GestionnaireBloc_1.GestionnaireBlocDeBase {
	composeBloc(aDataBloc) {
		const lInstance = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetVignetteMediatheque_1.ObjetVignetteMediatheque,
		);
		return {
			html: this.composeZoneInstance(lInstance),
			controleur: lInstance.controleur,
		};
	}
}
exports.GestionnaireBlocVignettesMediatheque =
	GestionnaireBlocVignettesMediatheque;
