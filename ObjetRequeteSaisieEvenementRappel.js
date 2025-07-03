exports.ObjetRequeteSaisieEvenementRappel = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieEvenementRappel extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieEvenementRappel = ObjetRequeteSaisieEvenementRappel;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieEvenementRappel",
	ObjetRequeteSaisieEvenementRappel,
);
