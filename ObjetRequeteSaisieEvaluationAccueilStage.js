exports.ObjetRequeteSaisieEvaluationAccueilStage = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieEvaluationAccueilStage extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		if (aParam.listeQuestions) {
			aParam.listeQuestions.setSerialisateurJSON({
				methodeSerialisation: this._serialiseQuestion.bind(this),
			});
		}
		this.JSON = aParam;
		return this.appelAsynchrone();
	}
	_serialiseQuestion(aElement, aJSON) {
		aJSON.typeSatisfaction = aElement.typeSatisfaction;
	}
}
exports.ObjetRequeteSaisieEvaluationAccueilStage =
	ObjetRequeteSaisieEvaluationAccueilStage;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieEvaluationAccueilStage",
	ObjetRequeteSaisieEvaluationAccueilStage,
);
