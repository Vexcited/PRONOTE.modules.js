const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { MethodesObjet } = require("MethodesObjet.js");
class ObjetRequeteSaisieNotesUnitaire extends ObjetRequeteConsultation {
  constructor(aPere, aEvenementSurReussite) {
    super(aPere, aEvenementSurReussite, false);
    this.setOptions({ sansBlocageInterface: true });
  }
  lancerRequete(aParam) {
    if (aParam.note) {
      const lDevoir = MethodesObjet.dupliquer(aParam.devoir);
      const lEleveDeDevoir = MethodesObjet.dupliquer(aParam.eleve);
      lEleveDeDevoir.note = aParam.note;
      lDevoir.listeEleves = new ObjetListeElements().addElement(lEleveDeDevoir);
      this.JSON.listeDevoirs = new ObjetListeElements().addElement(lDevoir);
      this.JSON.listeDevoirs.setSerialisateurJSON({
        ignorerEtatsElements: true,
        methodeSerialisation: _serialiseDevoir.bind(this),
      });
    }
    if (aParam.bonusMalus) {
      const lEleve = MethodesObjet.dupliquer(aParam.eleve);
      lEleve.bonusMalus = aParam.bonusMalus;
      this.JSON.periode = aParam.periode;
      this.JSON.service = aParam.service;
      this.JSON.listeEleves = new ObjetListeElements().addElement(lEleve);
      this.JSON.listeEleves.setSerialisateurJSON({
        ignorerEtatsElements: true,
        methodeSerialisation: _serialiseEleve.bind(this),
      });
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel();
  }
}
Requetes.inscrire("SaisieNotesUnitaire", ObjetRequeteSaisieNotesUnitaire);
function _serialiseDevoir(aElement, aJSON) {
  aElement.listeEleves.setSerialisateurJSON({
    ignorerEtatsElements: true,
    methodeSerialisation: _serialiseEleveDeDevoir,
  });
  aJSON.listeEleves = aElement.listeEleves;
}
function _serialiseEleveDeDevoir(aElement, AJSON) {
  if (!!aElement.note) {
    AJSON.note = aElement.note;
  }
  if ("commentaire" in aElement) {
    AJSON.commentaire = aElement.commentaire;
  }
}
function _serialiseEleve(aElement, AJSON) {
  if (!!aElement.bonusMalus) {
    AJSON.bonusMalus = aElement.bonusMalus;
  }
}
module.exports = { ObjetRequeteSaisieNotesUnitaire };
