exports.ObjetRequeteRessourcesSaisieCours = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteRessourcesSaisieCours extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteRessourcesSaisieCours = ObjetRequeteRessourcesSaisieCours;
CollectionRequetes_1.Requetes.inscrire(
  "RessourcesSaisieCours",
  ObjetRequeteRessourcesSaisieCours,
);
