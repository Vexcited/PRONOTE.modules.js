exports.ObjetApplicationPNMobile = void 0;
const ObjetApplicationScoMobile_1 = require("ObjetApplicationScoMobile");
require("DeclarationImagePN.js");
require("DeclarationCollectivite.js");
const AccessApp_1 = require("AccessApp");
global.Start = function (aParam) {
	ObjetApplicationScoMobile_1.ObjetApplicationScoMobile.beforeCreateAppPromise(
		"PRONOTE Mobile APP",
	).then(() => {
		(0, AccessApp_1.setApp)(new ObjetApplicationPNMobile());
		GApplication.lancer(aParam);
	});
};
class ObjetApplicationPNMobile extends ObjetApplicationScoMobile_1.ObjetApplicationScoMobile {
	constructor() {
		super();
	}
}
exports.ObjetApplicationPNMobile = ObjetApplicationPNMobile;
