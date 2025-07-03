exports.ObjetRequeteListeSessionsDeStage = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeSessionsDeStage extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete() {
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteListeSessionsDeStage = ObjetRequeteListeSessionsDeStage;
CollectionRequetes_1.Requetes.inscrire(
	"ListeSessionsDeStage",
	ObjetRequeteListeSessionsDeStage,
);
