const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteParametresInscriptionEtablissement extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParametres) {
		const lParametres = $.extend({}, aParametres);
		$.extend(this.JSON, lParametres);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lParam = {
			listeCivilites: this.JSONReponse.listeCivilites,
			listeRegimes: this.JSONReponse.listeRegimes,
			listeEtablissements: this.JSONReponse.listeEtablissements,
			listeSituations: this.JSONReponse.listeSituations,
			listeProfessions: this.JSONReponse.listeProfessions,
			listeMatieres: this.JSONReponse.listeMatieres,
			listePays: this.JSONReponse.listePays,
			listeVilles: this.JSONReponse.listeVilles,
			listeNiveauxResponsabilites: this.JSONReponse.listeNiveauxResponsabilites,
			listeSessionsInscriptions: this.JSONReponse.listeSessionsInscriptions,
			historiqueDemandes: this.JSONReponse.historiqueDemandes,
			listeLienParente: this.JSONReponse.listeLienParente,
			listeProjetsAccompagnement: this.JSONReponse.listeProjetsAccompagnement,
			listeLV1: this.JSONReponse.listeLV1,
			listeLV2: this.JSONReponse.listeLV2,
		};
		this.callbackReussite.appel(lParam);
	}
}
Requetes.inscrire(
	"ParametresInscriptionEtablissement",
	ObjetRequeteParametresInscriptionEtablissement,
);
module.exports = { ObjetRequeteParametresInscriptionEtablissement };
