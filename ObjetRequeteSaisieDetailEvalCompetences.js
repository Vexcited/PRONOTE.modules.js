const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieDetailEvaluationsCompetences extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    this.JSON.eleve = aParams.eleve;
    if (!!aParams.listeElementsCompetences) {
      aParams.listeElementsCompetences.setSerialisateurJSON({
        methodeSerialisation: _serialiseElementCompetence,
      });
      this.JSON.listeElementsCompetences = aParams.listeElementsCompetences;
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieDetailEvaluationsCompetences",
  ObjetRequeteSaisieDetailEvaluationsCompetences,
);
function _serialiseElementCompetence(aElementCompetence, aJSON) {
  aJSON.niveauDAcquisition = aElementCompetence.niveauAcqu;
  aJSON.numeroRESI = aElementCompetence.numeroRESI;
}
module.exports = ObjetRequeteSaisieDetailEvaluationsCompetences;
