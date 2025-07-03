exports.ObjetRequeteListeElevesGAEV = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeElevesGAEV extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.listeClasses) {
			for (const lClasse of this.JSONReponse.listeClasses) {
				if (!lClasse.avecEleve) {
					lClasse.avecEleve = false;
				}
			}
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteListeElevesGAEV = ObjetRequeteListeElevesGAEV;
CollectionRequetes_1.Requetes.inscrire(
	"ListeElevesGAEV",
	ObjetRequeteListeElevesGAEV,
);
