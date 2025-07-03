exports.ObjetRequetePageEntreprise = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
class ObjetRequetePageEntreprise extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		if (this.JSONReponse.entreprise && this.JSONReponse.entreprise.civilites) {
			this.JSONReponse.entreprise.civilites.trier();
			this.JSONReponse.entreprise.civilites.insererElement(
				new ObjetElement_1.ObjetElement(" ", 0, 0, 0, true),
				0,
			);
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequetePageEntreprise = ObjetRequetePageEntreprise;
CollectionRequetes_1.Requetes.inscrire(
	"InfosEntreprise",
	ObjetRequetePageEntreprise,
);
