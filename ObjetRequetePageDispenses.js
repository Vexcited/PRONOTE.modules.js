exports.ObjetRequetePageDispenses = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageDispenses extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequetePageDispenses = ObjetRequetePageDispenses;
CollectionRequetes_1.Requetes.inscrire(
	"PageDispenses",
	ObjetRequetePageDispenses,
);
