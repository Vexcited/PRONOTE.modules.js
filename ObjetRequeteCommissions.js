exports.ObjetRequeteCommissions = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteCommissions extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete() {
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteCommissions = ObjetRequeteCommissions;
CollectionRequetes_1.Requetes.inscrire("Commissions", ObjetRequeteCommissions);
