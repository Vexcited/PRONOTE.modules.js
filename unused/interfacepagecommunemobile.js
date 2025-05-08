exports.ObjetApplicationCommunMobilePN = void 0;
const ObjetApplicationCommunMobileSco_1 = require("ObjetApplicationCommunMobileSco");
require("DeclarationImagePN.js");
global.Start = function (aParametres) {
	GApplication = new ObjetApplicationCommunMobilePN(aParametres);
	GApplication.lancer(aParametres);
};
class ObjetApplicationCommunMobilePN extends ObjetApplicationCommunMobileSco_1.ObjetApplicationCommunMobileSco {
	constructor(aParametres) {
		super();
	}
}
exports.ObjetApplicationCommunMobilePN = ObjetApplicationCommunMobilePN;
