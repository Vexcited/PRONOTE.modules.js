exports.ObjetRequeteSaisieAbsencesGrille = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieAbsencesGrille extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
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
exports.ObjetRequeteSaisieAbsencesGrille = ObjetRequeteSaisieAbsencesGrille;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAbsencesGrille",
	ObjetRequeteSaisieAbsencesGrille,
);
