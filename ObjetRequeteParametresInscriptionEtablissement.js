exports.ObjetRequeteParametresInscriptionEtablissement = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteParametresInscriptionEtablissement extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
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
			listeLienParente: this.JSONReponse.listeLienParente,
			listeProjetsAccompagnement: this.JSONReponse.listeProjetsAccompagnement,
			listeLV1: this.JSONReponse.listeLV1,
			listeLV2: this.JSONReponse.listeLV2,
			listeNiveauxResponsabilites: this.JSONReponse.listeNiveauxResponsabilites,
			listeSessionsInscriptions: this.JSONReponse.listeSessionsInscriptions,
			historiqueDemandes: this.JSONReponse.historiqueDemandes,
		};
		this.callbackReussite.appel(lParam);
	}
}
exports.ObjetRequeteParametresInscriptionEtablissement =
	ObjetRequeteParametresInscriptionEtablissement;
CollectionRequetes_1.Requetes.inscrire(
	"ParametresInscriptionEtablissement",
	ObjetRequeteParametresInscriptionEtablissement,
);
