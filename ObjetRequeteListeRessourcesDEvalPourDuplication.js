const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListeRessourcesDEvalPourDuplication extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aEvaluation) {
    this.JSON.Evaluation = aEvaluation;
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse.liste);
  }
}
Requetes.inscrire(
  "ListeRessourcesDEvalPourDuplication",
  ObjetRequeteListeRessourcesDEvalPourDuplication,
);
module.exports = { ObjetRequeteListeRessourcesDEvalPourDuplication };
