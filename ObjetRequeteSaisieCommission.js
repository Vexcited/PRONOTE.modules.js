exports.ObjetRequeteSaisieCommission = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieCommission extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		if (aParam.suivi) {
			this.JSON.suivi = aParam.suivi.toJSONAll();
			this.JSON.suivi.listePJ = aParam.suivi.listePJ.setSerialisateurJSON({
				methodeSerialisation: _serialiser_Document.bind(this),
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieCommission = ObjetRequeteSaisieCommission;
function _serialiser_Document(aElement, aJSON) {
	aJSON.idFichier = aElement.idFichier;
}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCommission",
	ObjetRequeteSaisieCommission,
);
