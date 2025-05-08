const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
class ObjetRequeteQCMPourCDT_InfosCours extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON = {
			cours: new ObjetElement(),
			numeroCycle: 0,
			avecJoursPresence: true,
		};
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire("QCMPourCDT_InfosCours", ObjetRequeteQCMPourCDT_InfosCours);
module.exports = { ObjetRequeteQCMPourCDT_InfosCours };
