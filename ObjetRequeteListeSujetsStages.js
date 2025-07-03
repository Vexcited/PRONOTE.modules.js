exports.ObjetRequeteListeSujetsStages = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeSujetsStages extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeSujetsStages = ObjetRequeteListeSujetsStages;
CollectionRequetes_1.Requetes.inscrire(
	"ListeSujetsStages",
	ObjetRequeteListeSujetsStages,
);
