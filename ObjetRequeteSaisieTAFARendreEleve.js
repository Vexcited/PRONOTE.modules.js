exports.ObjetRequeteSaisieTAFARendreEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieTAFARendreEleve extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aListeFichiers) {
		if (aListeFichiers) {
			this.JSON.listeFichiers = aListeFichiers.setSerialisateurJSON({
				methodeSerialisation: _serialiserFichier,
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieTAFARendreEleve = ObjetRequeteSaisieTAFARendreEleve;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieTAFARendreEleve",
	ObjetRequeteSaisieTAFARendreEleve,
);
function _serialiserFichier(aElement, aJSON) {
	aJSON.idFichier = aElement.idFichier;
	aJSON.TAF = aElement.TAF;
}
