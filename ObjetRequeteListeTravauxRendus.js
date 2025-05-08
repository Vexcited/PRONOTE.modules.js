const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListeTravauxRendus extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire("ListeTravauxRendus", ObjetRequeteListeTravauxRendus);
module.exports = ObjetRequeteListeTravauxRendus;
