exports.ObjetRequeteEvaluationAccueilStage = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteEvaluationAccueilStage extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON = aParams;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteEvaluationAccueilStage = ObjetRequeteEvaluationAccueilStage;
CollectionRequetes_1.Requetes.inscrire(
	"EvaluationAccueilStage",
	ObjetRequeteEvaluationAccueilStage,
);
