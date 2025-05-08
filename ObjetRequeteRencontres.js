const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteRencontres extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aSessionRencontre) {
		this.JSON.sessionRencontre = aSessionRencontre;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire("RencontresParentsProfs", ObjetRequeteRencontres);
module.exports = ObjetRequeteRencontres;
