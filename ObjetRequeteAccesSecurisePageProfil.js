const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteAccesSecurisePageProfil extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON = aParam;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(
			this.JSONReponse.titre,
			this.JSONReponse.message,
			this.JSONReponse.url,
		);
	}
}
Requetes.inscrire(
	"AccesSecurisePageProfil",
	ObjetRequeteAccesSecurisePageProfil,
);
module.exports = { ObjetRequeteAccesSecurisePageProfil };
