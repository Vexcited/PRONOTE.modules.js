exports.ObjetRequetePageEmploiDuTemps_DomainePresence = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageEmploiDuTemps_DomainePresence extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(aPere) {
		super(aPere);
	}
	lancerRequete(aRessource) {
		this.JSON.Ressource = aRessource;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequetePageEmploiDuTemps_DomainePresence =
	ObjetRequetePageEmploiDuTemps_DomainePresence;
CollectionRequetes_1.Requetes.inscrire(
	"PageEmploiDuTemps_DomainePresence",
	ObjetRequetePageEmploiDuTemps_DomainePresence,
);
