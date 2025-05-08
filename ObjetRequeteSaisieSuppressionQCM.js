const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieSuppressionQCM extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON.qcm = aParam.qcm.toJSON();
		this.JSON.estUneExecution = aParam.qcm.estUneExecution;
		return this.appelAsynchrone();
	}
}
Requetes.inscrire("SaisieSuppressionQCM", ObjetRequeteSaisieSuppressionQCM);
module.exports = { ObjetRequeteSaisieSuppressionQCM };
