const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteDocumentsEleve extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON.eleve = aParams.eleve;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel({
			listeDocumentsEleve: this.JSONReponse.listeDocumentsEleve,
		});
	}
}
Requetes.inscrire("DocumentsEleve", ObjetRequeteDocumentsEleve);
module.exports = { ObjetRequeteDocumentsEleve };
