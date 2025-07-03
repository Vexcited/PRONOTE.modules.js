exports.ObjetRequeteDetailEvaluationsCompetences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteDetailEvaluationsCompetences extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.JSON = {
			eleve: aParam.eleve,
			pilier: aParam.pilier,
			periode: aParam.periode,
			relationsESI: aParam.numRelESI,
			resultatSansLigneDeCumul: aParam.resultatSansLigneDeCumul,
			avecEdition: aParam.avecEdition,
		};
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteDetailEvaluationsCompetences =
	ObjetRequeteDetailEvaluationsCompetences;
CollectionRequetes_1.Requetes.inscrire(
	"DetailEvaluationsCompetences",
	ObjetRequeteDetailEvaluationsCompetences,
);
