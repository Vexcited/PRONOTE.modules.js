exports.ObjetApplicationCommunMobilePN = void 0;
const ObjetApplicationCommunMobileSco_1 = require("ObjetApplicationCommunMobileSco");
require("DeclarationImagePN.js");
const AccessApp_1 = require("AccessApp");
global.Start = function (aParametres) {
	(0, AccessApp_1.setApp)(new ObjetApplicationCommunMobilePN(aParametres));
	GApplication.lancer(aParametres);
};
class ObjetApplicationCommunMobilePN extends ObjetApplicationCommunMobileSco_1.ObjetApplicationCommunMobileSco {
	constructor(aParametres) {
		super();
	}
}
exports.ObjetApplicationCommunMobilePN = ObjetApplicationCommunMobilePN;
