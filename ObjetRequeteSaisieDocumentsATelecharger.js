const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieDocumentsATelecharger extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    $.extend(this.JSON, aParams);
    if (!!aParams.listeNaturesDocumentsAFournir) {
      this.JSON.listeNaturesDocumentsAFournir.setSerialisateurJSON({
        methodeSerialisation: _ajouterNatureDocuments,
      });
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieDocumentATelecharger",
  ObjetRequeteSaisieDocumentsATelecharger,
);
function _ajouterNatureDocuments(aElement, aJSON) {
  if (!!aElement.listePJ) {
    aJSON.listePJ = aElement.listePJ;
    aJSON.listePJ.setSerialisateurJSON({
      methodeSerialisation: _serialiserFichier,
    });
  }
}
function _serialiserFichier(aElement, aJSON) {
  aJSON.idFichier = aElement.idFichier;
}
module.exports = { ObjetRequeteSaisieDocumentsATelecharger };
