exports.ObjetRequeteRechercheDeStage = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
class ObjetRequeteRechercheDeStage extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		if (this.JSONReponse.listeDemarches) {
			this.JSONReponse.listeDemarches.parcourir((aDemarche) => {
				aDemarche.estDeploye = true;
				if (aDemarche.estCumul) {
					aDemarche.estUnDeploiement = true;
				} else if (aDemarche.pere) {
					aDemarche.pere = this.JSONReponse.listeDemarches.getElementParNumero(
						aDemarche.pere.getNumero(),
					);
				}
			});
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteRechercheDeStage = ObjetRequeteRechercheDeStage;
CollectionRequetes_1.Requetes.inscrire(
	"ListeRechercheDeStage",
	ObjetRequeteRechercheDeStage,
);
