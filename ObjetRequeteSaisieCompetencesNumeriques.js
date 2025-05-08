const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequeteSaisieCompetencesNumeriques extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON.classe = aParams.classe;
		this.JSON.eleve = aParams.eleve;
		if (!!aParams.listeElementsCompetences) {
			aParams.listeElementsCompetences.setSerialisateurJSON({
				methodeSerialisation: _serialiseElementCompetence,
			});
			this.JSON.listeElementsCompetences = aParams.listeElementsCompetences;
		}
		this.JSON.appreciation = aParams.appreciation || "";
		return this.appelAsynchrone();
	}
}
Requetes.inscrire(
	"SaisieCompetencesNumeriques",
	ObjetRequeteSaisieCompetencesNumeriques,
);
function _serialiseElementCompetence(aElementCompetence, aJSON) {
	aJSON.niveauDAcquisition = aElementCompetence.niveauDAcquisition;
	aJSON.niveauDEquivalenceCE = aElementCompetence.niveauDEquivalenceCE;
	aJSON.dateValidation = aElementCompetence.dateValidation;
	if (aElementCompetence.getGenre() === EGenreRessource.Evaluation) {
		aJSON.relationESI = aElementCompetence.relationESI;
	} else {
		aJSON.relationEP = aElementCompetence.relationEP;
	}
}
module.exports = { ObjetRequeteSaisieCompetencesNumeriques };
