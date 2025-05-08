const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteCategorieEvaluation extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON = { classe: aParam.classe, service: aParam.service };
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire("CategorieEvaluation", ObjetRequeteCategorieEvaluation);
module.exports = { ObjetRequeteCategorieEvaluation };
