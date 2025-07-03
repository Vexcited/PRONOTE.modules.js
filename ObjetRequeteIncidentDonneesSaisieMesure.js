exports.ObjetRequeteIncidentDonneesSaisieMesure = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteIncidentDonneesSaisieMesure extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteIncidentDonneesSaisieMesure =
	ObjetRequeteIncidentDonneesSaisieMesure;
CollectionRequetes_1.Requetes.inscrire(
	"donneesSaisieMesure",
	ObjetRequeteIncidentDonneesSaisieMesure,
);
