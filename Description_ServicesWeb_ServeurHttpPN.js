exports.Description_ServicesWeb_ServeurHttpPN = void 0;
const Description_WS_1 = require("Description_WS");
const WS_Administration_ServeurHttpPN_1 = require("WS_Administration_ServeurHttpPN");
class Description_ServicesWeb_ServeurHttpPN extends Description_WS_1.Description_WS {
	constructor(aParams) {
		super();
		const lParamServeurHttpSco = Object.assign(
			{ urlAcces: "", versionSoap: "1.2" },
			aParams,
		);
		this.administration_Serveur =
			new WS_Administration_ServeurHttpPN_1.WS_Administration_ServeurHttpPN(
				lParamServeurHttpSco,
			);
	}
}
exports.Description_ServicesWeb_ServeurHttpPN =
	Description_ServicesWeb_ServeurHttpPN;
