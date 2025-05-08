const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieServicesPeriscolairePourAbsence extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		aParams.liste.setSerialisateurJSON({ ignorerEtatsElements: true });
		this.JSON = aParams;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie, this.JSONReponse);
	}
}
Requetes.inscrire(
	"SaisieServicesPeriscolairePourAbsence",
	ObjetRequeteSaisieServicesPeriscolairePourAbsence,
);
module.exports = { ObjetRequeteSaisieServicesPeriscolairePourAbsence };
