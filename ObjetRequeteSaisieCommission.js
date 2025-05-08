const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieCommission extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		if (aParam.suivi) {
			this.JSON.suivi = aParam.suivi.toJSONAll();
			this.JSON.suivi.listePJ = aParam.suivi.listePJ.setSerialisateurJSON({
				methodeSerialisation: _serialiser_Document.bind(this),
			});
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie);
	}
}
function _serialiser_Document(aElement, aJSON) {
	aJSON.idFichier = aElement.idFichier;
}
Requetes.inscrire("SaisieCommission", ObjetRequeteSaisieCommission);
module.exports = ObjetRequeteSaisieCommission;
