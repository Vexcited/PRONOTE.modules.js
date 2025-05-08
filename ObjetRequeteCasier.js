const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteCasier extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams = {}) {
    this.JSON = $.extend({}, aParams);
    if (aParams.listeClasses) {
      aParams.listeClasses.setSerialisateurJSON({ ignorerEtatsElements: true });
      this.JSON.listeClasses = aParams.listeClasses;
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire("Casier", ObjetRequeteCasier);
module.exports = { ObjetRequeteCasier };
