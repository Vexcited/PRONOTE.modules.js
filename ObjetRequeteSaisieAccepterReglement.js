exports.ObjetRequeteSaisieAccepterReglement = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieAccepterReglement extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieAccepterReglement =
  ObjetRequeteSaisieAccepterReglement;
CollectionRequetes_1.Requetes.inscrire(
  "SaisieAccepterReglement",
  ObjetRequeteSaisieAccepterReglement,
);
