const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteNiveauxDeMaitriseParMatiere extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = {
      classe: aParam.classe,
      periode: aParam.periode,
      eleve: aParam.eleve,
    };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire(
  "NiveauxDeMaitriseParMatiere",
  ObjetRequeteNiveauxDeMaitriseParMatiere,
);
module.exports = ObjetRequeteNiveauxDeMaitriseParMatiere;
