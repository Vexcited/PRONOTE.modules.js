const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequeteSaisieImport extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    if (aParam) {
      this.JSON = { fichierTxt: aParam.fichierTxt };
      if (aParam.mapping) {
        const lListe = new ObjetListeElements();
        lListe.addElement(aParam.mapping);
        lListe.setSerialisateurJSON({
          methodeSerialisation: _serialiserMappingTable,
          ignorerEtatsElements: true,
        });
        this.JSON.listeMappingTable = lListe;
      }
      if (aParam.service) {
        this.JSON.service = aParam.service;
      }
      if (aParam.periode) {
        this.JSON.periode = aParam.periode;
      }
      if (aParam.professeur) {
        this.JSON.professeur = aParam.professeur;
      }
      if (aParam.niveau) {
        this.JSON.niveau = aParam.niveau;
      }
      if (aParam.avecBareme) {
        this.JSON.avecBareme = aParam.avecBareme;
      }
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieImportDonnees", ObjetRequeteSaisieImport);
function _serialiserMappingTable(aElement, aJSON) {
  aJSON.nomRef = aElement.nomRef;
  aJSON.correspondances = aElement.correspondances.setSerialisateurJSON({
    methodeSerialisation: _serialiserCorresp,
    ignorerEtatsElements: true,
  });
}
function _serialiserCorresp(aElement, aJSON, I) {
  aJSON.indiceCol = I + 1;
  aJSON.nomRefChamp = aElement.nomRefChamp;
}
module.exports = ObjetRequeteSaisieImport;
