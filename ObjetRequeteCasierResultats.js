exports.ObjetRequeteCasierResultats = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteCasierResultats extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		if (aParams.casier) {
			this.JSON = { casier: aParams.casier.toJSONAll() };
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteCasierResultats = ObjetRequeteCasierResultats;
CollectionRequetes_1.Requetes.inscrire(
	"CasierResultats",
	ObjetRequeteCasierResultats,
);
