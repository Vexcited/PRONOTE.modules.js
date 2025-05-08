const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListeSujetsStages extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete() {
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lParam = {};
		lParam.listeSujetsStages = this.JSONReponse.listeSujetsStages;
		this.callbackReussite.appel(lParam);
	}
}
Requetes.inscrire("ListeSujetsStages", ObjetRequeteListeSujetsStages);
module.exports = { ObjetRequeteListeSujetsStages };
