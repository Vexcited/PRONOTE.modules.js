exports.ObjetRequeteListePiliers = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListePiliers extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListePiliers = ObjetRequeteListePiliers;
CollectionRequetes_1.Requetes.inscrire(
	"ListePiliers",
	ObjetRequeteListePiliers,
);
