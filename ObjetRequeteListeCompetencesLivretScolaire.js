const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequeteListeCompetencesLivretScolaire extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete() {
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lResult = {};
    if (this.JSONReponse.listeEvaluationsLS) {
      lResult.listeEvaluationsLS = new ObjetListeElements();
      this.recupererDonnees(
        this.JSONReponse.listeEvaluationsLS,
        lResult.listeEvaluationsLS,
      );
    }
    if (this.JSONReponse.listeEvaluationsLSLV) {
      lResult.listeEvaluationsLSLV = new ObjetListeElements();
      this.recupererDonnees(
        this.JSONReponse.listeEvaluationsLSLV,
        lResult.listeEvaluationsLSLV,
      );
    }
    this.callbackReussite.appel(lResult);
  }
  recupererDonnees(aTabJSON, aDonnees) {
    if (aTabJSON) {
      for (let i in aTabJSON) {
        this._ajouterItemEvaluation(aTabJSON[i], aDonnees);
      }
    } else {
      aDonnees = null;
    }
  }
  _ajouterItemEvaluation(aJSON, aParametre) {
    const lElement = aJSON ? new ObjetElement().fromJSON(aJSON) : null;
    lElement.abbreviation = aJSON.abbreviation ? aJSON.abbreviation : "";
    if (lElement.getGenre() === undefined) {
      lElement.Genre = -1;
    }
    aParametre.addElement(lElement);
  }
}
Requetes.inscrire(
  "ListeCompetencesLivretScolaire",
  ObjetRequeteListeCompetencesLivretScolaire,
);
module.exports = { ObjetRequeteListeCompetencesLivretScolaire };
