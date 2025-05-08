const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { SerialiserQCM_PN } = require("SerialiserQCM_PN.js");
class ObjetRequeteSaisieQCMEvaluation extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
		new SerialiserQCM_PN().executionQCM(
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
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie);
	}
}
Requetes.inscrire("SaisieQCMEvaluation", ObjetRequeteSaisieQCMEvaluation);
function serialiserCompetences(aElement, aJSON) {
	aJSON.coefficient = aElement.coefficient;
	aJSON.listeQuestions = aElement.listeQuestions.setSerialisateurJSON({
		ignorerEtatsElements: true,
		nePasTrierPourValidation: true,
	});
}
module.exports = { ObjetRequeteSaisieQCMEvaluation };
