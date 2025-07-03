exports.ObjetRequeteListePunitions = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListePunitions extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListePunitions = ObjetRequeteListePunitions;
CollectionRequetes_1.Requetes.inscrire(
	"ListePunitions",
	ObjetRequeteListePunitions,
);
