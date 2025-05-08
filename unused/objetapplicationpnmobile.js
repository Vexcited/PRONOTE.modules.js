exports.ObjetApplicationPNMobile = void 0;
const ObjetApplicationScoMobile_1 = require("ObjetApplicationScoMobile");
require("DeclarationImagePN.js");
require("DeclarationCollectivite.js");
global.Start = function (aParam) {
  ObjetApplicationScoMobile_1.ObjetApplicationScoMobile.beforeCreateAppPromise(
    "PRONOTE Mobile APP",
  ).then(() => {
    GApplication = new ObjetApplicationPNMobile();
    GApplication.lancer(aParam);
  });
};
class ObjetApplicationPNMobile extends ObjetApplicationScoMobile_1.ObjetApplicationScoMobile {
  constructor() {
    super();
  }
}
exports.ObjetApplicationPNMobile = ObjetApplicationPNMobile;
