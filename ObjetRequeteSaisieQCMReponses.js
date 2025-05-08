const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequeteSaisieQCMReponses extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON = {
			executionQCM: aParam.element,
			indiceQuestion: aParam.indiceQuestion,
			reponse: aParam.reponse,
			ressenti: aParam.ressenti,
			pourInitialisation: aParam.pourInitialisation,
			pourCloture: aParam.pourCloture,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lParam = {};
		if (this.JSONReponse.etatCloture !== undefined) {
			lParam.etatCloture = this.JSONReponse.etatCloture;
		}
		if (this.JSONReponse.listeQuestions) {
			lParam.listeQuestions = new ObjetListeElements().fromJSON(
				this.JSONReponse.listeQuestions,
				this._ajouterQuestion.bind(this),
			);
		}
		this.callbackReussite.appel(lParam);
	}
	_ajouterQuestion(aJSON, aElement) {
		aElement.copieJSON(aJSON);
		if (aJSON.listeReponses) {
			aElement.listeReponses = new ObjetListeElements().fromJSON(
				aJSON.listeReponses,
				this._ajouterReponse.bind(this),
			);
		}
	}
	_ajouterReponse(aJSON, aElement) {
		aElement.copieJSON(aJSON);
	}
}
Requetes.inscrire("SaisieQCMReponses", ObjetRequeteSaisieQCMReponses);
module.exports = { ObjetRequeteSaisieQCMReponses };
