exports.InterfaceParametrageCASSCO = void 0;
const InterfaceParametrageCAS_1 = require("InterfaceParametrageCAS");
class InterfaceParametrageCASSCO extends InterfaceParametrageCAS_1.InterfaceParametrageCAS {
	constructor(...aParams) {
		super(...aParams);
		this.optionsCAS.avecModeles = true;
		this.optionsCAS.accesDirectPourServeurHttp = true;
	}
	initialiserFenetreParametres(aInstance) {
		super.initialiserFenetreParametres(aInstance);
		aInstance.setDonneesFenetreParametresCAS({
			avecParametresInactifs: () => {
				var _a, _b;
				return (
					!!((_b =
						(_a = this.objetApplicationConsoles) === null || _a === void 0
							? void 0
							: _a.etatServeurHttp) === null || _b === void 0
						? void 0
						: _b.getEtatActif()) === true
				);
			},
			avec_ChercherIdParProduit: true,
		});
	}
}
exports.InterfaceParametrageCASSCO = InterfaceParametrageCASSCO;
