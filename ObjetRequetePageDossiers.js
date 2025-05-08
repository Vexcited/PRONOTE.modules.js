const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequetePageDossiers extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	actionApresRequete() {
		const lListeGenres = this.JSONReponse.listeGenres
			? this.JSONReponse.listeGenres
			: new ObjetListeElements();
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
			: new ObjetListeElements();
		const lMessage = this.JSONReponse.message ? this.JSONReponse.message : "";
		this.callbackReussite.appel({
			listeGenres: lListeGenres,
			listeDossiers: lListeDossiers,
			listePJ: lListePJEleve,
			msg: lMessage,
		});
	}
}
Requetes.inscrire("PageDossiers", ObjetRequetePageDossiers);
module.exports = { ObjetRequetePageDossiers };
