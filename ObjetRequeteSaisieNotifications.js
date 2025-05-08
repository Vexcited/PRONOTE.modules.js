const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieNotifications extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = $.extend({}, aParam);
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisiePreferencesNotifications",
  ObjetRequeteSaisieNotifications,
);
module.exports = { ObjetRequeteSaisieNotifications };
