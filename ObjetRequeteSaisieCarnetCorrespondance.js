const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieCarnetCorrespondance extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aEleve, aListeObservations) {
    this.JSON = { eleve: aEleve };
    if (!!aListeObservations) {
      this.JSON.listeObservations = aListeObservations;
      this.JSON.listeObservations.setSerialisateurJSON({
        methodeSerialisation: function (aObs, aJSON) {
          aJSON.commentaire = aObs.commentaire;
          aJSON.date = aObs.date;
          aJSON.estPubliee = aObs.estPubliee;
        },
      });
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieCarnetCorrespondance",
  ObjetRequeteSaisieCarnetCorrespondance,
);
module.exports = ObjetRequeteSaisieCarnetCorrespondance;
