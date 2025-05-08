const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { Serialiser_QCM } = require("Serialiser_QCM.js");
class ObjetRequeteSaisieQCMResultat extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    aParam.eleves.setSerialisateurJSON({
      ignorerEtatsElements: true,
      nePasTrierPourValidation: true,
    });
    this.JSON.typeSaisieQCMResultat = aParam.typeSaisieQCMResultat;
    this.JSON.eleves = aParam.eleves;
    this.JSON.execution = aParam.execution.toJSON();
    new Serialiser_QCM().executionQCM(aParam.execution, this.JSON.execution);
    this.JSON.fin = aParam.fin;
    this.JSON.debut = aParam.debut;
    this.JSON.publication = aParam.publication;
    this.JSON.garderMeilleureNote = aParam.garderMeilleureNote;
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire("SaisieQCMResultat", ObjetRequeteSaisieQCMResultat);
module.exports = { ObjetRequeteSaisieQCMResultat };
