const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListeServicesDEvalPourRemplacement extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aEvaluation) {
    this.JSON.Evaluation = aEvaluation;
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse.listeServices);
  }
}
Requetes.inscrire(
  "ListeServicesDEvalPourRemplacement",
  ObjetRequeteListeServicesDEvalPourRemplacement,
);
module.exports = { ObjetRequeteListeServicesDEvalPourRemplacement };
