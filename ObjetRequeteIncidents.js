exports.ObjetRequeteIncidents = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteIncidents extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteIncidents = ObjetRequeteIncidents;
CollectionRequetes_1.Requetes.inscrire("Incidents", ObjetRequeteIncidents);
