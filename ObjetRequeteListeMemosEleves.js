exports.ObjetRequeteListeMemosEleves = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeMemosEleves extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.JSON = aParam;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteListeMemosEleves = ObjetRequeteListeMemosEleves;
CollectionRequetes_1.Requetes.inscrire(
	"ListeMemosEleves",
	ObjetRequeteListeMemosEleves,
);
