exports.ObjetRequeteSaisieDetailEvaluationsCompetences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieDetailEvaluationsCompetences extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		this.JSON.eleve = aParams.eleve;
		if (!!aParams.listeElementsCompetences) {
			aParams.listeElementsCompetences.setSerialisateurJSON({
				methodeSerialisation: this._serialiseElementCompetence,
			});
			this.JSON.listeElementsCompetences = aParams.listeElementsCompetences;
		}
		return this.appelAsynchrone();
	}
	_serialiseElementCompetence(aElementCompetence, aJSON) {
		aJSON.niveauDAcquisition = aElementCompetence.niveauAcqu;
		aJSON.numeroRESI = aElementCompetence.numeroRESI;
	}
}
exports.ObjetRequeteSaisieDetailEvaluationsCompetences =
	ObjetRequeteSaisieDetailEvaluationsCompetences;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieDetailEvaluationsCompetences",
	ObjetRequeteSaisieDetailEvaluationsCompetences,
);
