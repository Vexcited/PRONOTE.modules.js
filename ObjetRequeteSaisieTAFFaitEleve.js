exports.ObjetRequeteSaisieTAFFaitEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieTAFFaitEleve extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON.listeTAF = aParam.listeTAF.setSerialisateurJSON({
			methodeSerialisation: _serialiserTAF,
		});
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieTAFFaitEleve = ObjetRequeteSaisieTAFFaitEleve;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieTAFFaitEleve",
	ObjetRequeteSaisieTAFFaitEleve,
);
function _serialiserTAF(aElement, aJSON) {
	aJSON.TAFFait = aElement.TAFFait;
}
