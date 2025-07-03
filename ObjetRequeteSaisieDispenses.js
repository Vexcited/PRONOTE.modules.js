exports.ObjetRequeteSaisieDispenses = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
class ObjetRequeteSaisieDispenses extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieDispenses = ObjetRequeteSaisieDispenses;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieDispenses",
	ObjetRequeteSaisieDispenses,
);
