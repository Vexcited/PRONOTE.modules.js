exports.ObjetRequeteSortiesPedaDeCours = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
class ObjetRequeteSortiesPedaDeCours extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteSortiesPedaDeCours = ObjetRequeteSortiesPedaDeCours;
CollectionRequetes_1.Requetes.inscrire(
	"SortiesPedaDeCours",
	ObjetRequeteSortiesPedaDeCours,
);
