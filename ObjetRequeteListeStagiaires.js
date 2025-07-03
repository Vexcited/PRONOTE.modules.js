exports.ObjetRequeteListeStagiaires = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeStagiaires extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON = aParams;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteListeStagiaires = ObjetRequeteListeStagiaires;
CollectionRequetes_1.Requetes.inscrire(
	"ListeStagiaires",
	ObjetRequeteListeStagiaires,
);
