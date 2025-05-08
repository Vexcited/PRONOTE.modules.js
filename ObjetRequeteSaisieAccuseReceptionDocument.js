const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieAccuseReceptionDocument extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    this.JSON = { periode: aParams.periode };
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieAccuseReceptionDocument",
  ObjetRequeteSaisieAccuseReceptionDocument,
);
module.exports = ObjetRequeteSaisieAccuseReceptionDocument;
