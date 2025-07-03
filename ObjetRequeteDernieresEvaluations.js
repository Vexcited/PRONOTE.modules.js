exports.ObjetRequeteDernieresEvaluations = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTri_1 = require("ObjetTri");
class ObjetRequeteDernieresEvaluations extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		if (!!this.JSONReponse.listeEvaluations) {
			this.JSONReponse.listeEvaluations.parcourir((D) => {
				if (!!D.listeNiveauxDAcquisitions) {
					D.listeNiveauxDAcquisitions.setTri([
						ObjetTri_1.ObjetTri.init("ordre"),
					]);
					D.listeNiveauxDAcquisitions.trier();
				}
			});
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteDernieresEvaluations = ObjetRequeteDernieresEvaluations;
CollectionRequetes_1.Requetes.inscrire(
	"DernieresEvaluations",
	ObjetRequeteDernieresEvaluations,
);
