exports.ObjetRequeteSaisiePunitions = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisiePunitions extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aListePunitions) {
		this.JSON = {};
		if (!!aListePunitions) {
			aListePunitions.setSerialisateurJSON({
				methodeSerialisation: _serialisePunition,
			});
			this.JSON.listePunitions = aListePunitions;
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisiePunitions = ObjetRequeteSaisiePunitions;
CollectionRequetes_1.Requetes.inscrire(
	"SaisiePunitions",
	ObjetRequeteSaisiePunitions,
);
function _serialisePunition(aElement, AJSON) {
	if (!!aElement.programmation) {
		AJSON.punition = aElement.punition.toJSON();
		AJSON.programmation = aElement.programmation.toJSON();
		AJSON.programmation.dateRealisation = aElement.dateRealisation;
	}
}
