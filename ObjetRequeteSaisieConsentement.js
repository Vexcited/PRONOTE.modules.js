const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieConsentement extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    Object.assign(this.JSON, aParam);
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieConsentement", ObjetRequeteSaisieConsentement);
module.exports = ObjetRequeteSaisieConsentement;
