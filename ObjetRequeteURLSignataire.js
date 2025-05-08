const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const TypeActionSignataire = { signer: 0, voirDocument: 1 };
class ObjetRequeteURLSignataire extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = aParam;
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("URLSignataire", ObjetRequeteURLSignataire);
module.exports = { ObjetRequeteURLSignataire, TypeActionSignataire };
