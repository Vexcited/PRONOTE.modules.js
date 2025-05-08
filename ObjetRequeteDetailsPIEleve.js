const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteDetailsPIEleve extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON.eleve = aParams.eleve;
		this.JSON.matiere = aParams.matiere;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel({
			listeProjetsEleve: this.JSONReponse.listeProjetsEleve,
			listeDetailsProjets: this.JSONReponse.listeDetailsProjets,
		});
	}
}
Requetes.inscrire("DetailsPIEleve", ObjetRequeteDetailsPIEleve);
module.exports = { ObjetRequeteDetailsPIEleve };
