exports.ObjetRequeteSaisieCopieCDTSurDossier = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieCopieCDTSurDossier extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieCopieCDTSurDossier =
  ObjetRequeteSaisieCopieCDTSurDossier;
CollectionRequetes_1.Requetes.inscrire(
  "SaisieCopieCDTSurDossier",
  ObjetRequeteSaisieCopieCDTSurDossier,
);
