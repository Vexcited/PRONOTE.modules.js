exports.ObjetRequeteSaisieConsentement = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieConsentement extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete() {
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieConsentement = ObjetRequeteSaisieConsentement;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieConsentement",
	ObjetRequeteSaisieConsentement,
);
