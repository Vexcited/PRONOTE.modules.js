const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieTAFARendreEleve extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aListeFichiers) {
    if (aListeFichiers) {
      this.JSON.listeFichiers = aListeFichiers.setSerialisateurJSON({
        methodeSerialisation: _serialiserFichier,
      });
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieTAFARendreEleve", ObjetRequeteSaisieTAFARendreEleve);
function _serialiserFichier(aElement, aJSON) {
  aJSON.idFichier = aElement.idFichier;
  aJSON.TAF = aElement.TAF;
}
module.exports = ObjetRequeteSaisieTAFARendreEleve;
