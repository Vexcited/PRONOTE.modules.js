const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteExportQCM extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aElementQCM) {
    this.JSON = { qcm: aElementQCM };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire("ExportQCM", ObjetRequeteExportQCM);
module.exports = { ObjetRequeteExportQCM };
