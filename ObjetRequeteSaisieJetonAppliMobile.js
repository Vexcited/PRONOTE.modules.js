exports.ObjetRequeteSaisieJetonAppliMobile = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieJetonAppliMobile extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieJetonAppliMobile = ObjetRequeteSaisieJetonAppliMobile;
CollectionRequetes_1.Requetes.inscrire(
  "JetonAppliMobile",
  ObjetRequeteSaisieJetonAppliMobile,
);
