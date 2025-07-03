exports.ObjetRequeteListeRessourcesDEvalPourDuplication = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeRessourcesDEvalPourDuplication extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aEvaluation) {
		this.JSON.Evaluation = aEvaluation;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteListeRessourcesDEvalPourDuplication =
	ObjetRequeteListeRessourcesDEvalPourDuplication;
CollectionRequetes_1.Requetes.inscrire(
	"ListeRessourcesDEvalPourDuplication",
	ObjetRequeteListeRessourcesDEvalPourDuplication,
);
