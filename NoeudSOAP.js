exports.NoeudSOAP = exports.EGenreRoleSOAP = void 0;
var EGenreRoleSOAP;
(function (EGenreRoleSOAP) {
  EGenreRoleSOAP[(EGenreRoleSOAP["emetteur"] = 0)] = "emetteur";
  EGenreRoleSOAP[(EGenreRoleSOAP["recepteur"] = 1)] = "recepteur";
})(EGenreRoleSOAP || (exports.EGenreRoleSOAP = EGenreRoleSOAP = {}));
class NoeudSOAP {
  constructor(aURI, aRoles) {
    this.uri = aURI;
    this.roles = aRoles;
    this.versionSupportee = "";
  }
  traiterMessage(aDonnees) {
    return "";
  }
}
exports.NoeudSOAP = NoeudSOAP;
