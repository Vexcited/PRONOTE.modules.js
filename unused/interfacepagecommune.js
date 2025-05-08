exports.ObjetApplicationCommunPN = void 0;
const ObjetApplicationCommunSco_1 = require("ObjetApplicationCommunSco");
require("DeclarationImagePN.js");
require("DeclarationImagesConnexionDynamiques.js");
global.Start = function (aParametres) {
	GApplication = new ObjetApplicationCommunPN();
	GApplication.lancer(aParametres);
};
class ObjetApplicationCommunPN extends ObjetApplicationCommunSco_1.ObjetApplicationCommunSco {}
exports.ObjetApplicationCommunPN = ObjetApplicationCommunPN;
