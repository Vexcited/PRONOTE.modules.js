exports.GestionnaireBlocSaisieEltPgm = void 0;
const GestionnaireBloc_1 = require("GestionnaireBloc");
const ObjetBlocSaisieEltPgm_1 = require("ObjetBlocSaisieEltPgm");
const ObjetIdentite_1 = require("ObjetIdentite");
const BlocCard_1 = require("BlocCard");
class GestionnaireBlocSaisieEltPgm extends GestionnaireBloc_1.GestionnaireBlocDeBase {
	composeBloc(aDataBloc) {
		const lInstance = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocSaisieEltPgm_1.ObjetBlocSaisieEltPgm,
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
exports.GestionnaireBlocSaisieEltPgm = GestionnaireBlocSaisieEltPgm;
