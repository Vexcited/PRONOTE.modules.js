const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteDetailEvaluationsCompetences extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = {
      eleve: aParam.eleve,
      pilier: aParam.pilier,
      periode: aParam.periode,
      relationsESI: aParam.numRelESI,
      resultatSansLigneDeCumul: aParam.resultatSansLigneDeCumul,
      avecEdition: aParam.avecEdition,
    };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire(
  "DetailEvaluationsCompetences",
  ObjetRequeteDetailEvaluationsCompetences,
);
module.exports = { ObjetRequeteDetailEvaluationsCompetences };
