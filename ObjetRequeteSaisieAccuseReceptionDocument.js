exports.ObjetRequeteSaisieAccuseReceptionDocument = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieAccuseReceptionDocument extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		this.JSON = { periode: aParams.periode };
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieAccuseReceptionDocument =
	ObjetRequeteSaisieAccuseReceptionDocument;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAccuseReceptionDocument",
	ObjetRequeteSaisieAccuseReceptionDocument,
);
