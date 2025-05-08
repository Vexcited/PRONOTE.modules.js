exports.ObjetRequeteTrombinoscope = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteTrombinoscope extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		this.JSONReponse.ListeRessources.trier();
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteTrombinoscope = ObjetRequeteTrombinoscope;
CollectionRequetes_1.Requetes.inscrire(
	"PageTrombinoscope",
	ObjetRequeteTrombinoscope,
);
