exports.ObjetRequeteListesSaisiesPourIncidents = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListesSaisiesPourIncidents extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListesSaisiesPourIncidents =
	ObjetRequeteListesSaisiesPourIncidents;
CollectionRequetes_1.Requetes.inscrire(
	"ListesSaisiesPourIncidents",
	ObjetRequeteListesSaisiesPourIncidents,
);
