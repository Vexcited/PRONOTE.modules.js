const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieElevesGAEV extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParametres) {
    this.JSON = $.extend(
      {
        domaine: null,
        cours: null,
        listeEleves: undefined,
        numeroSemaineSource: undefined,
      },
      aParametres,
    );
    return this.appelAsynchrone();
  }
  actionApresRequete(aGenreReponse) {
    if (this.JSONRapportSaisie && this.JSONRapportSaisie.erreur) {
      GApplication.getMessage().afficher({
        message: this.JSONRapportSaisie.erreur,
      });
    }
    this.callbackReussite.appel(this.JSONRapportSaisie, aGenreReponse);
  }
}
Requetes.inscrire("SaisieElevesGAEV", ObjetRequeteSaisieElevesGAEV);
module.exports = ObjetRequeteSaisieElevesGAEV;
