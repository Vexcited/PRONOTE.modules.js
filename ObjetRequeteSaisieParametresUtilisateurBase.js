const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieParametresUtilisateurBase extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    this.JSON = {
      optionPublicationCDT: aParams.optionPublicationCDT,
      partagePJAutorisee: aParams.partagePJAutorisee,
    };
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieParametresUtilisateurBase",
  ObjetRequeteSaisieParametresUtilisateurBase,
);
module.exports = { ObjetRequeteSaisieParametresUtilisateurBase };
