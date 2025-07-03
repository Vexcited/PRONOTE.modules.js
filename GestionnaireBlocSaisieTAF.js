exports.GestionnaireBlocSaisieTAF = void 0;
const GestionnaireBloc_1 = require("GestionnaireBloc");
const ObjetBlocSaisieTAF_1 = require("ObjetBlocSaisieTAF");
const ObjetIdentite_1 = require("ObjetIdentite");
const BlocCard_1 = require("BlocCard");
class GestionnaireBlocSaisieTAF extends GestionnaireBloc_1.GestionnaireBlocDeBase {
	composeBloc(aDataBloc) {
		const lInstance = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocSaisieTAF_1.ObjetBlocSaisieTAF,
		);
		return {
			html: this.composeZoneInstance(lInstance),
			controleur: lInstance.controleur,
		};
	}
	composeBlocMsg(aMsg) {
		const lBloc = ObjetIdentite_1.Identite.creerInstance(BlocCard_1.BlocCard, {
			pere: this,
		});
		return { html: lBloc.composeHtmlMsg(aMsg) };
	}
}
exports.GestionnaireBlocSaisieTAF = GestionnaireBlocSaisieTAF;
