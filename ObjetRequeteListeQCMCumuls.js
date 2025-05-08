const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequeteListeQCMCumuls extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParamJSON, aDonnees) {
    this.JSON = aParamJSON;
    this.donnees = aDonnees;
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lListeQCM = new ObjetListeElements().fromJSON(
      this.JSONReponse.listeQCM,
      this._ajouterQCM.bind(this),
    );
    for (let I = 0, lNbr = lListeQCM.count(); I < lNbr; I++) {
      let lQCM = lListeQCM.get(I);
      if (lQCM.positionPere >= 0) {
        const lIndicePere = lListeQCM.getIndiceElementParFiltre(
          this._rechercherPere.bind(this, lQCM.positionPere),
        );
        if (lIndicePere >= 0) {
          lQCM.pere = lListeQCM.get(lIndicePere);
        }
      }
      lQCM.estUnDeploiement =
        lQCM.getGenre() && lQCM.getGenre() !== EGenreRessource.QCM;
      lQCM.estDeploye = true;
    }
    this.callbackReussite.appel(
      lListeQCM,
      this.JSONReponse.message,
      this.donnees,
    );
  }
  _rechercherPere(aPositionPere, aElement) {
    return aElement.getPosition() === aPositionPere;
  }
  _ajouterQCM(aJSON, aElement) {
    aElement.copieJSON(aJSON);
    if (aElement.getGenre() === EGenreRessource.QCM) {
      const lListeProprietes = ["proprietaire", "matiere", "niveau"];
      for (const x in lListeProprietes) {
        if (aJSON[lListeProprietes[x]]) {
          aElement[lListeProprietes[x]] = new ObjetElement().fromJSON(
            aJSON[lListeProprietes[x]],
          );
          aElement[lListeProprietes[x]].copieJSON(aJSON[lListeProprietes[x]]);
        }
      }
    }
  }
}
Requetes.inscrire("listeQCMCumuls", ObjetRequeteListeQCMCumuls);
module.exports = { ObjetRequeteListeQCMCumuls };
