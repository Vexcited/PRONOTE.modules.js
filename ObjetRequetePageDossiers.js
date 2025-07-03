exports.ObjetRequetePageDossiers = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequetePageDossiers extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		const lListeGenres = this.JSONReponse.listeGenres
			? this.JSONReponse.listeGenres
			: new ObjetListeElements_1.ObjetListeElements();
		const lListeDossiers = this.JSONReponse.listeDossiers;
		if (!!lListeDossiers) {
			lListeDossiers.parcourir((aElement) => {
				aElement.avecDeploiement =
					aElement.listeElements && aElement.listeElements.count() > 0;
				aElement.deploye = aElement.avecDeploiement;
			});
		}
		const lListePJEleve = this.JSONReponse.listeDJEleve
			? this.JSONReponse.listeDJEleve
			: new ObjetListeElements_1.ObjetListeElements();
		const lMessage = this.JSONReponse.message ? this.JSONReponse.message : "";
		this.callbackReussite.appel({
			listeGenres: lListeGenres,
			listeDossiers: lListeDossiers,
			listePJ: lListePJEleve,
			msg: lMessage,
		});
	}
}
exports.ObjetRequetePageDossiers = ObjetRequetePageDossiers;
CollectionRequetes_1.Requetes.inscrire(
	"PageDossiers",
	ObjetRequetePageDossiers,
);
