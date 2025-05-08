const ObjetApplicationConsoleServeurHttpSco_1 = require("ObjetApplicationConsoleServeurHttpSco");
require("DeclarationImageEspacesHebergementPN.js");
class ObjetApplicationConsoleServeurHTTPPN extends ObjetApplicationConsoleServeurHttpSco_1.ObjetApplicationConsoleServeurHttpSco {
  constructor() {
    super();
    this.avecEduConnect = true;
  }
  getParametresDescriptionWS() {
    return {
      nom: "SvcAdminServeurHttp",
      espaceNommage:
        "http://www.indexeducation.com/frahtm/SvcAdminServeurHttp.html",
      prefixeSoapAction: "urn:SvcAdminServeurHttp",
    };
  }
}
global.Main = function (aParam) {
  GApplication = new ObjetApplicationConsoleServeurHTTPPN();
  GApplication.start(aParam);
};
