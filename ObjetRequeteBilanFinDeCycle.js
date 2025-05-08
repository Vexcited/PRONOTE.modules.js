exports.ObjetRequeteBilanFinDeCycle = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteBilanFinDeCycle extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParam) {
		super(...aParam);
	}
	lancerRequete(aParam) {
		aParam.listeEleves.setSerialisateurJSON({ ignorerEtatsElements: true });
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteBilanFinDeCycle = ObjetRequeteBilanFinDeCycle;
CollectionRequetes_1.Requetes.inscrire(
	"BilanFinDeCycle",
	ObjetRequeteBilanFinDeCycle,
);
