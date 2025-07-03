exports.ObjetRequeteSaisieCompetencesNumeriques = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteSaisieCompetencesNumeriques extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		this.JSON.classe = aParams.classe;
		this.JSON.eleve = aParams.eleve;
		if (!!aParams.listeElementsCompetences) {
			aParams.listeElementsCompetences.setSerialisateurJSON({
				methodeSerialisation: this._serialiseElementCompetence,
			});
			this.JSON.listeElementsCompetences = aParams.listeElementsCompetences;
		}
		this.JSON.appreciation = aParams.appreciation || "";
		return this.appelAsynchrone();
	}
	_serialiseElementCompetence(aElementCompetence, aJSON) {
		aJSON.niveauDAcquisition = aElementCompetence.niveauDAcquisition;
		aJSON.niveauDEquivalenceCE = aElementCompetence.niveauDEquivalenceCE;
		aJSON.dateValidation = aElementCompetence.dateValidation;
		if (
			aElementCompetence.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.Evaluation
		) {
			aJSON.relationESI = aElementCompetence.relationESI;
		} else {
			aJSON.relationEP = aElementCompetence.relationEP;
		}
	}
}
exports.ObjetRequeteSaisieCompetencesNumeriques =
	ObjetRequeteSaisieCompetencesNumeriques;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCompetencesNumeriques",
	ObjetRequeteSaisieCompetencesNumeriques,
);
