exports.ObjetRequeteDetailAbsences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteDetailAbsences extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		let lDeploiement;
		this.JSONReponse.listeAbsences.parcourir((D) => {
			if (D.estUnDeploiement) {
				D.pere = null;
				lDeploiement = D;
			} else {
				D.pere = lDeploiement;
				D.Libelle = D.pere !== undefined ? D.pere.Libelle : "";
			}
		});
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteDetailAbsences = ObjetRequeteDetailAbsences;
CollectionRequetes_1.Requetes.inscrire(
	"DetailAbsences",
	ObjetRequeteDetailAbsences,
);
