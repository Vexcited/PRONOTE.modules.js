const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListeCDTPourRattachement extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete() {
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse.listeCDT);
  }
}
Requetes.inscrire(
  "ListeCDTPourRattachement",
  ObjetRequeteListeCDTPourRattachement,
);
module.exports = { ObjetRequeteListeCDTPourRattachement };
