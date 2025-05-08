const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteDetailService extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aService) {
    this.JSON = { Service: aService };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel({
      ListeSousMatieres: this.JSONReponse.ListeSousMatieres,
      ListeSousServices: this.JSONReponse.ListeSousServices,
    });
  }
}
Requetes.inscrire("DetailService", ObjetRequeteDetailService);
module.exports = { ObjetRequeteDetailService };
