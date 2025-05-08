const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteCreationDevoirDNL extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = { service: aParam.service.toJSON() };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONRapportSaisie);
  }
}
Requetes.inscrire(
  "CreationDevoirDNL",
  ObjetRequeteCreationDevoirDNL,
  ObjetRequeteSaisie,
);
module.exports = { ObjetRequeteCreationDevoirDNL };
