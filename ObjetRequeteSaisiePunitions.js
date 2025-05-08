const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisiePunitions extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aListePunitions) {
    this.JSON = {};
    if (!!aListePunitions) {
      aListePunitions.setSerialisateurJSON({
        methodeSerialisation: _serialisePunition,
      });
      this.JSON.listePunitions = aListePunitions;
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisiePunitions", ObjetRequeteSaisiePunitions);
function _serialisePunition(aElement, AJSON) {
  if (!!aElement.programmation) {
    AJSON.punition = aElement.punition.toJSON();
    AJSON.programmation = aElement.programmation.toJSON();
    AJSON.programmation.dateRealisation = aElement.dateRealisation;
  }
}
module.exports = ObjetRequeteSaisiePunitions;
