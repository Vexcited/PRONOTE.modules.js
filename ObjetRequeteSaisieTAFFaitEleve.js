const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieTAFFaitEleve extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON.listeTAF = aParam.listeTAF.setSerialisateurJSON({
      methodeSerialisation: _serialiserTAF,
    });
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieTAFFaitEleve", ObjetRequeteSaisieTAFFaitEleve);
function _serialiserTAF(aElement, aJSON) {
  aJSON.TAFFait = aElement.TAFFait;
}
module.exports = { ObjetRequeteSaisieTAFFaitEleve };
