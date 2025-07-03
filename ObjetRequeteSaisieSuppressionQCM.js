exports.ObjetRequeteSaisieSuppressionQCM = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieSuppressionQCM extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON.qcm = aParam.qcm.toJSON();
		this.JSON.estUneExecution = aParam.qcm.estUneExecution;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieSuppressionQCM = ObjetRequeteSaisieSuppressionQCM;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieSuppressionQCM",
	ObjetRequeteSaisieSuppressionQCM,
);
