const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListeSondagesDeBiblioEtablissement extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire(
	"ListeSondagesDeBiblioEtablissement",
	ObjetRequeteListeSondagesDeBiblioEtablissement,
);
module.exports = { ObjetRequeteListeSondagesDeBiblioEtablissement };
