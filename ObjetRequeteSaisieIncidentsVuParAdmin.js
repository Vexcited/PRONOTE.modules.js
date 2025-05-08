const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieIncidentsVuParAdmin extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    if (aParam.incidents) {
      aParam.incidents.setSerialisateurJSON({
        methodeSerialisation: function (aElt, aJSON) {
          aJSON.estVise = aElt.estVise;
        },
      });
      this.JSON.incidents = aParam.incidents;
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieIncidentsVuParAdmin",
  ObjetRequeteSaisieIncidentsVuParAdmin,
);
module.exports = ObjetRequeteSaisieIncidentsVuParAdmin;
