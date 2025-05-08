exports.ObjetRequeteCloudAttente = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteCloudAttente extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteCloudAttente = ObjetRequeteCloudAttente;
CollectionRequetes_1.Requetes.inscrire(
	"CloudAttente",
	ObjetRequeteCloudAttente,
);
