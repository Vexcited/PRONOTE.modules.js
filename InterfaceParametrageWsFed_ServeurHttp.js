exports.InterfaceParametrageWsFed_ServeurHttp = void 0;
const InterfaceParametrageWsFed_1 = require("InterfaceParametrageWsFed");
class InterfaceParametrageWsFed_ServeurHttp extends InterfaceParametrageWsFed_1.InterfaceParametrageWsFed {
	constructor(...aParams) {
		super(...aParams);
	}
	estConnecterAuServeur() {
		return this.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur();
	}
	estEnService() {
		return (
			this.objetApplicationConsoles.etatServeurHttp.getEtatActif() === true
		);
	}
}
exports.InterfaceParametrageWsFed_ServeurHttp =
	InterfaceParametrageWsFed_ServeurHttp;
