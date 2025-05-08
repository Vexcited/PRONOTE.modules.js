const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteGenererFichiersResultatsSondage extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  actionApresRequete() {
    this.callbackReussite.appel({
      messageErreur: this.messageErreur,
      listeFichiersResultatsCrees: this.JSONRapportSaisie
        ? this.JSONRapportSaisie.listeFichiersResultats
        : null,
    });
  }
}
Requetes.inscrire(
  "GenererFichiersResultatsSondage",
  ObjetRequeteGenererFichiersResultatsSondage,
);
module.exports = { ObjetRequeteGenererFichiersResultatsSondage };
