const { GestionnaireBlocDeBase } = require("GestionnaireBloc.js");
const { ObjetBlocSaisieContenu } = require("ObjetBlocSaisieContenu.js");
const { Identite } = require("ObjetIdentite.js");
const { BlocCard } = require("BlocCard.js");
class GestionnaireBlocSaisieContenu extends GestionnaireBlocDeBase {
	constructor(...aParams) {
		super(...aParams);
	}
	composeBloc(aDataBloc) {
		const lInstance = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocSaisieContenu,
		);
		return {
			html: this.composeZoneInstance(lInstance),
			controleur: lInstance.controleur,
		};
	}
	composeBlocMsg(aMsg) {
		const lBloc = Identite.creerInstance(BlocCard, { pere: this });
		return { html: lBloc.composeHtmlMsg(aMsg) };
	}
}
module.exports = { GestionnaireBlocSaisieContenu };
