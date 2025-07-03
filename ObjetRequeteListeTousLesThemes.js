exports.ObjetRequeteListeTousLesThemes = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeTousLesThemes extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		this.callbackReussite.appel({
			listeTousLesThemes: this.JSONReponse.ListeTousLesThemes,
			listeMatieres: this.JSONReponse.listeMatieres,
			matiereNonDesignee: this.JSONReponse.matiereNonDesignee,
			tailleLibelleTheme: this.JSONReponse.tailleLibelleTheme,
		});
	}
}
exports.ObjetRequeteListeTousLesThemes = ObjetRequeteListeTousLesThemes;
CollectionRequetes_1.Requetes.inscrire(
	"ListeTousLesThemes",
	ObjetRequeteListeTousLesThemes,
);
