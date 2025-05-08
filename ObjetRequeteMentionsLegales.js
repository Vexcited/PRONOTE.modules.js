exports.ObjetRequeteMentionsLegales = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteMentionsLegales extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteMentionsLegales = ObjetRequeteMentionsLegales;
CollectionRequetes_1.Requetes.inscrire(
  "MentionsLegales",
  ObjetRequeteMentionsLegales,
);
