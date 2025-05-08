exports.ObjetRequeteSessionRencontres = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSessionRencontres extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteSessionRencontres = ObjetRequeteSessionRencontres;
CollectionRequetes_1.Requetes.inscrire(
	"SessionRencontres",
	ObjetRequeteSessionRencontres,
);
