exports.GestionnaireBlocSaisieContenu = void 0;
const GestionnaireBloc_1 = require("GestionnaireBloc");
const ObjetBlocSaisieContenu_1 = require("ObjetBlocSaisieContenu");
const ObjetIdentite_1 = require("ObjetIdentite");
const BlocCard_1 = require("BlocCard");
class GestionnaireBlocSaisieContenu extends GestionnaireBloc_1.GestionnaireBlocDeBase {
	composeBloc(aDataBloc) {
		const lInstance = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocSaisieContenu_1.ObjetBlocSaisieContenu,
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
exports.GestionnaireBlocSaisieContenu = GestionnaireBlocSaisieContenu;
