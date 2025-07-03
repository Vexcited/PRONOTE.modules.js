exports.ObjetRequeteRechercheEntreprise = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
class ObjetRequeteRechercheEntreprise extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteRechercheEntreprise = ObjetRequeteRechercheEntreprise;
CollectionRequetes_1.Requetes.inscrire(
	"RechercheEntreprise",
	ObjetRequeteRechercheEntreprise,
);
