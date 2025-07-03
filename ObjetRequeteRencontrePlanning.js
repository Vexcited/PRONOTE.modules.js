exports.ObjetRequeteRencontrePlanning = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteRencontrePlanning extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aSessionRencontre) {
		this.JSON.sessionRencontre = aSessionRencontre;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteRencontrePlanning = ObjetRequeteRencontrePlanning;
CollectionRequetes_1.Requetes.inscrire(
	"RencontrePlanning",
	ObjetRequeteRencontrePlanning,
);
