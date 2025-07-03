exports.ObjetApplicationCommunPN = void 0;
const ObjetApplicationCommunSco_1 = require("ObjetApplicationCommunSco");
require("DeclarationImagePN.js");
require("DeclarationImagesConnexionDynamiques.js");
const AccessApp_1 = require("AccessApp");
global.Start = function (aParametres) {
	(0, AccessApp_1.setApp)(new ObjetApplicationCommunPN());
	GApplication.lancer(aParametres);
};
class ObjetApplicationCommunPN extends ObjetApplicationCommunSco_1.ObjetApplicationCommunSco {}
exports.ObjetApplicationCommunPN = ObjetApplicationCommunPN;
