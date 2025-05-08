const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequetePageSaisieCarnetCorrespondance extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aEleve) {
    this.JSON = { Eleve: aEleve };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lListeObservations = this.JSONReponse.ListeObservations;
    lListeObservations.trier();
    const lListeEncouragements = this.JSONReponse.ListeEncouragements;
    lListeEncouragements.trier();
    const lListeAutresEvenements = this.JSONReponse.listeAutresEvenements;
    this.callbackReussite.appel({
      listeObservations: lListeObservations,
      listeEncouragements: lListeEncouragements,
      listeAutresEvenements: lListeAutresEvenements,
      estPubliable: this.JSONReponse.estPubliable,
    });
  }
}
Requetes.inscrire(
  "PageSaisieCarnetCorrespondance",
  ObjetRequetePageSaisieCarnetCorrespondance,
);
module.exports = { ObjetRequetePageSaisieCarnetCorrespondance };
