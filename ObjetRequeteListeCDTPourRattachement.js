exports.ObjetRequeteListeCDTPourRattachement = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeCDTPourRattachement extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeCDTPourRattachement =
	ObjetRequeteListeCDTPourRattachement;
CollectionRequetes_1.Requetes.inscrire(
	"ListeCDTPourRattachement",
	ObjetRequeteListeCDTPourRattachement,
);
