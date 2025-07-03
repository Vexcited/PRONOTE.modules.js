exports.ObjetRequeteListeServicesDEvalPourRemplacement = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeServicesDEvalPourRemplacement extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aEvaluation) {
		this.JSON.Evaluation = aEvaluation;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteListeServicesDEvalPourRemplacement =
	ObjetRequeteListeServicesDEvalPourRemplacement;
CollectionRequetes_1.Requetes.inscrire(
	"ListeServicesDEvalPourRemplacement",
	ObjetRequeteListeServicesDEvalPourRemplacement,
);
