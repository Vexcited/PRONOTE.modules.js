exports.ObjetRequeteListeOffresStages = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeOffresStages extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeOffresStages = ObjetRequeteListeOffresStages;
CollectionRequetes_1.Requetes.inscrire(
	"ListeOffresStages",
	ObjetRequeteListeOffresStages,
);
