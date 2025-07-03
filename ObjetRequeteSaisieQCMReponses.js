exports.ObjetRequeteSaisieQCMReponses = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteSaisieQCMReponses extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
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
			lParam.listeQuestions =
				new ObjetListeElements_1.ObjetListeElements().fromJSON(
					this.JSONReponse.listeQuestions,
					this._ajouterQuestion.bind(this),
				);
		}
		this.callbackReussite.appel(lParam);
	}
	_ajouterQuestion(aJSON, aElement) {
		aElement.copieJSON(aJSON);
		if (aJSON.listeReponses) {
			aElement.listeReponses =
				new ObjetListeElements_1.ObjetListeElements().fromJSON(
					aJSON.listeReponses,
					this._ajouterReponse.bind(this),
				);
		}
	}
	_ajouterReponse(aJSON, aElement) {
		aElement.copieJSON(aJSON);
	}
}
exports.ObjetRequeteSaisieQCMReponses = ObjetRequeteSaisieQCMReponses;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieQCMReponses",
	ObjetRequeteSaisieQCMReponses,
);
