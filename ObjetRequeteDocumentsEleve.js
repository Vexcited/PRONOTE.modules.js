exports.ObjetRequeteDocumentsEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteDocumentsEleve extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aEleve) {
		this.JSON = { eleve: aEleve };
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel({
			listeDocumentsEleve: this.JSONReponse.listeDocumentsEleve,
		});
	}
}
exports.ObjetRequeteDocumentsEleve = ObjetRequeteDocumentsEleve;
CollectionRequetes_1.Requetes.inscrire(
	"DocumentsEleve",
	ObjetRequeteDocumentsEleve,
);
