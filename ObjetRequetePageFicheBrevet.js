exports.ObjetRequetePageFicheBrevet = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageFicheBrevet extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequetePageFicheBrevet = ObjetRequetePageFicheBrevet;
CollectionRequetes_1.Requetes.inscrire(
	"PageFicheBrevet",
	ObjetRequetePageFicheBrevet,
);
