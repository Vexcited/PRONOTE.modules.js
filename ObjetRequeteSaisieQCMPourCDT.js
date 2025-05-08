const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieQCMPourCDT extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParametres) {
    this.JSON = {
      cours: null,
      numeroCycle: 0,
      QCM: null,
      estPourTAF: true,
      dateTAF: null,
      cahier: null,
    };
    $.extend(this.JSON, aParametres);
    return this.appelAsynchrone();
  }
  actionApresRequete(aGenreReponse, aJSONRapport) {
    this.callbackReussite.appel(aGenreReponse, aJSONRapport);
  }
}
Requetes.inscrire("SaisieQCMPourCDT", ObjetRequeteSaisieQCMPourCDT);
module.exports = { ObjetRequeteSaisieQCMPourCDT };
