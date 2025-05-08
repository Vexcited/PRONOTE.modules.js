const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
class ObjetRequeteResultatsQCM extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = { element: aParam.element };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lParam = {};
    if (this.JSONReponse.message) {
      lParam.message = this.JSONReponse.message;
    } else {
      lParam.listeEleves = new ObjetListeElements().fromJSON(
        this.JSONReponse.listeEleves,
        this._ajouterEleve.bind(this),
      );
      lParam.listeEleves.trier();
      lParam.listeQuestions = new ObjetListeElements().fromJSON(
        this.JSONReponse.listeQuestions,
        _ajouterQuestion,
      );
      lParam.moyennes = {
        noteQCM: this.JSONReponse.MoyenneNoteQCM,
        tpsReponse: this.JSONReponse.MoyenneTpsDeReponseQCM,
        ressenti: this.JSONReponse.MoyenneRessentiQCM,
      };
      lParam.avecAffichage = {
        classe: this.JSONReponse.afficherColClasse,
        noteQCM: this.JSONReponse.afficherColNoteQCM,
        note2QCM: this.JSONReponse.afficherColNote2QCM,
        ressenti: this.JSONReponse.afficherColRessenti,
        tentatives: this.JSONReponse.afficherColNbTentative,
      };
      lParam.valeurs = {
        nbTotalPts: this.JSONReponse.NombrePtsExeQCM,
        nbEleves: this.JSONReponse.NombreDEleves,
        dureeMax: this.JSONReponse.DureeMaxQCM,
      };
    }
    this.callbackReussite.appel(lParam);
  }
  _ajouterEleve(aJSON, aElement) {
    aElement.copieJSON(aJSON);
    aElement.classe = new ObjetElement().fromJSON(aJSON.classe);
    aElement.listeReponses = new ObjetListeElements().fromJSON(
      aJSON.listeReponses,
      _ajouterReponse,
    );
    aElement.execution = new ObjetElement().fromJSON(aJSON.execution);
    new ObjetDeserialiser()._ajouterQCM(aJSON.execution, aElement.execution);
    if (!!aJSON.executionCachee) {
      aElement.executionCachee = new ObjetElement().fromJSON(
        aJSON.executionCachee,
      );
      new ObjetDeserialiser()._ajouterQCM(
        aJSON.executionCachee,
        aElement.executionCachee,
      );
    }
  }
}
Requetes.inscrire("ResultatsQCM", ObjetRequeteResultatsQCM);
function _ajouterReponse(aJSON, aElement) {
  aElement.copieJSON(aJSON);
}
function _ajouterQuestion(aJSON, aElement) {
  aElement.copieJSON(aJSON);
}
module.exports = { ObjetRequeteResultatsQCM };
