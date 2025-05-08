const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListePiliers extends ObjetRequeteConsultation {
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
Requetes.inscrire("ListePiliers", ObjetRequeteListePiliers);
module.exports = { ObjetRequeteListePiliers };
