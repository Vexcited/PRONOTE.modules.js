const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieAbsencesGrille extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON = $.extend(
			{ eleve: null, domaine: null, genreAbsence: null },
			aParams,
		);
		if (aParams.articles) {
			aParams.articles.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire("SaisieAbsencesGrille", ObjetRequeteSaisieAbsencesGrille);
module.exports = { ObjetRequeteSaisieAbsencesGrille };
