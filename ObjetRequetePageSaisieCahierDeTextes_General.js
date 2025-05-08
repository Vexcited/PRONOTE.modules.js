exports.ObjetRequetePageSaisieCahierDeTextes_General = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageSaisieCahierDeTextes_General extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aDemandeDomainePresence) {
		this.JSON.DemandeDomainePresence = aDemandeDomainePresence;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequetePageSaisieCahierDeTextes_General =
	ObjetRequetePageSaisieCahierDeTextes_General;
CollectionRequetes_1.Requetes.inscrire(
	"PageSaisieCahierDeTextes_General",
	ObjetRequetePageSaisieCahierDeTextes_General,
);
