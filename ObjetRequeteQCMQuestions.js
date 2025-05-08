exports.ObjetRequeteQCMQuestions = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteQCMQuestions extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParam) {
    this.JSON = {};
    $.extend(this.JSON, aParam);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lParam = {};
    if (this.JSONReponse.message) {
      lParam.message = this.JSONReponse.message;
    } else {
      lParam.QCM = new ObjetElement_1.ObjetElement().fromJSON(
        this.JSONReponse.QCM,
      );
      lParam.QCM.copieJSON(this.JSONReponse.QCM);
      lParam.QCM.listeQuestions =
        new ObjetListeElements_1.ObjetListeElements().fromJSON(
          this.JSONReponse.QCM.listeQuestions,
          _ajouterQuestion.bind(this),
        );
    }
    this.callbackReussite.appel(lParam);
  }
}
exports.ObjetRequeteQCMQuestions = ObjetRequeteQCMQuestions;
CollectionRequetes_1.Requetes.inscrire(
  "ListeQCMQuestions",
  ObjetRequeteQCMQuestions,
);
function _ajouterQuestion(aJSON, aElement) {
  aElement.copieJSON(aJSON);
  aElement.nouvellePosition = aElement.position;
  if (aJSON.listeReponses) {
    aElement.listeReponses =
      new ObjetListeElements_1.ObjetListeElements().fromJSON(
        aJSON.listeReponses,
        _ajouterReponse.bind(this),
      );
  }
}
function _ajouterReponse(aJSON, aElement) {
  aElement.copieJSON(aJSON);
}
