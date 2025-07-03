exports.ObjetRequeteListeManuelsRessourcesGranulaires = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeManuelsRessourcesGranulaires extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeManuelsRessourcesGranulaires =
	ObjetRequeteListeManuelsRessourcesGranulaires;
CollectionRequetes_1.Requetes.inscrire(
	"listeManuelsRessourcesGranulaires",
	ObjetRequeteListeManuelsRessourcesGranulaires,
);
