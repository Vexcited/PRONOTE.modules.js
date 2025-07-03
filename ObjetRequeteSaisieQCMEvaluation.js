exports.ObjetRequeteSaisieQCMEvaluation = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const SerialiserQCM_PN_1 = require("SerialiserQCM_PN");
class ObjetRequeteSaisieQCMEvaluation extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		const lEvaluationJSON = aParametres.evaluation.toJSON();
		lEvaluationJSON.service = aParametres.evaluation.service;
		lEvaluationJSON.date = aParametres.evaluation.dateValidation;
		lEvaluationJSON.datePublication = aParametres.evaluation.datePublication;
		lEvaluationJSON.coefficient = aParametres.evaluation.coefficient;
		lEvaluationJSON.periode = aParametres.evaluation.periode;
		lEvaluationJSON.periodeSecondaire =
			aParametres.evaluation.periodeSecondaire;
		lEvaluationJSON.priseEnCompteDansBilan =
			aParametres.evaluation.priseEnCompteDansBilan;
		aParametres.evaluation.listeCompetences.setSerialisateurJSON({
			methodeSerialisation: serialiserCompetences,
			ignorerEtatsElements: true,
			nePasTrierPourValidation: true,
		});
		const lExecutionQCMJSON = aParametres.evaluation.executionQCM.toJSON();
		new SerialiserQCM_PN_1.SerialiserQCM_PN().executionQCM(
			aParametres.evaluation.executionQCM,
			lExecutionQCMJSON,
		);
		this.JSON = {
			evaluation: lEvaluationJSON,
			executionQCM: lExecutionQCMJSON,
			listeCompetences: aParametres.evaluation.listeCompetences,
			avecCreationDevoir: !!aParametres.evaluation.avecDevoir,
		};
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieQCMEvaluation = ObjetRequeteSaisieQCMEvaluation;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieQCMEvaluation",
	ObjetRequeteSaisieQCMEvaluation,
);
function serialiserCompetences(aElement, aJSON) {
	aJSON.coefficient = aElement.coefficient;
	aJSON.listeQuestions = aElement.listeQuestions.setSerialisateurJSON({
		ignorerEtatsElements: true,
		nePasTrierPourValidation: true,
	});
}
