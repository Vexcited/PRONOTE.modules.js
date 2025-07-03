exports.ObjetRequeteRessourceEDT = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteRessourceEDT extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteRessourceEDT = ObjetRequeteRessourceEDT;
CollectionRequetes_1.Requetes.inscrire(
	"RessourceEDT",
	ObjetRequeteRessourceEDT,
);
