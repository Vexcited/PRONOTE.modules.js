exports.ObjetApplicationPNEspace = void 0;
const ObjetApplicationScoEspace_1 = require("ObjetApplicationScoEspace");
require("DeclarationImagePN.js");
require("DeclarationCollectivite.js");
require("DeclarationImagesConnexionDynamiques.js");
global.Start = function (aParam) {
  GApplication = new ObjetApplicationPNEspace();
  GApplication.lancer(aParam);
};
class ObjetApplicationPNEspace extends ObjetApplicationScoEspace_1.ObjetApplicationScoEspace {
  constructor() {
    super();
  }
}
exports.ObjetApplicationPNEspace = ObjetApplicationPNEspace;
