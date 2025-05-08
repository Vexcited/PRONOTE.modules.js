const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieRencontreIndisponibilites extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    const lParametres = { session: null, indisponibilites: null };
    $.extend(lParametres, aParam);
    this.JSON = {
      session: lParametres.session,
      indisponibilites: lParametres.indisponibilites,
    };
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieRencontreIndisponibilites",
  ObjetRequeteSaisieRencontreIndisponibilites,
);
module.exports = ObjetRequeteSaisieRencontreIndisponibilites;
