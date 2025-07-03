exports.ObjetApplicationPNEspace = void 0;
const ObjetApplicationScoEspace_1 = require("ObjetApplicationScoEspace");
require("DeclarationImagePN.js");
require("DeclarationCollectivite.js");
require("DeclarationImagesConnexionDynamiques.js");
const AccessApp_1 = require("AccessApp");
global.Start = function (aParam) {
	(0, AccessApp_1.setApp)(new ObjetApplicationPNEspace());
	GApplication.lancer(aParam);
};
class ObjetApplicationPNEspace extends ObjetApplicationScoEspace_1.ObjetApplicationScoEspace {
	constructor() {
		super();
	}
}
exports.ObjetApplicationPNEspace = ObjetApplicationPNEspace;
