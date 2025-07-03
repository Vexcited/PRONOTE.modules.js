exports.ObjetRequeteCategorieEvaluation = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteCategorieEvaluation extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteCategorieEvaluation = ObjetRequeteCategorieEvaluation;
CollectionRequetes_1.Requetes.inscrire(
	"CategorieEvaluation",
	ObjetRequeteCategorieEvaluation,
);
