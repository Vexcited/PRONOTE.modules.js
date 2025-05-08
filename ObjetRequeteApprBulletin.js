const { Requetes } = require("CollectionRequetes.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { ObjetElement } = require("ObjetElement.js");
class ObjetRequeteApprBulletin extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		const lParam = $.extend(
			{
				ressource: new ObjetElement(),
				periode: new ObjetElement(),
				service: new ObjetElement(),
			},
			aParam,
		);
		this.JSON = {
			ressource: lParam.ressource,
			periode: lParam.periode,
			service: lParam.service,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire("PageApprBulletin", ObjetRequeteApprBulletin);
module.exports = { ObjetRequeteApprBulletin };
