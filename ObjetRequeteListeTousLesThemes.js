const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListeTousLesThemes extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete() {
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel({
			listeTousLesThemes: this.JSONReponse.ListeTousLesThemes,
			listeMatieres: this.JSONReponse.listeMatieres,
			matiereNonDesignee: this.JSONReponse.matiereNonDesignee,
			tailleLibelleTheme: this.JSONReponse.tailleLibelleTheme,
		});
	}
}
Requetes.inscrire("ListeTousLesThemes", ObjetRequeteListeTousLesThemes);
module.exports = { ObjetRequeteListeTousLesThemes };
