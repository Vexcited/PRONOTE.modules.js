const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieRencontreDesiderata extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    this.JSON = {
      session: aParams.session,
      listeRencontres: aParams.listeRencontres,
    };
    if (!!this.JSON.listeRencontres) {
      this.JSON.listeRencontres.setSerialisateurJSON({
        methodeSerialisation: _serialiserRencontre,
      });
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieRencontreDesiderata",
  ObjetRequeteSaisieRencontreDesiderata,
);
function _serialiserRencontre(aElement, aJSON) {
  aJSON.duree = aElement.duree;
  aJSON.voeu = aElement.voeu;
  aJSON.validationvoeu = aElement.validationvoeu;
}
module.exports = ObjetRequeteSaisieRencontreDesiderata;
