exports.ObjetRequeteEvaluationCours = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteEvaluationCours extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		this.JSON = $.extend(
			{
				domaine: null,
				numeroSemaineCours: null,
				cours: null,
				duree: undefined,
			},
			aParametres,
		);
		if (this.JSON.cours && this.JSON.cours.estCoursCDIFeuilleAppel) {
			this.JSON.estCoursCDIFeuilleAppel =
				this.JSON.cours.estCoursCDIFeuilleAppel;
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteEvaluationCours = ObjetRequeteEvaluationCours;
CollectionRequetes_1.Requetes.inscrire(
	"EvaluationCours",
	ObjetRequeteEvaluationCours,
);
