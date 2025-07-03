exports.ObjetRequeteValidationAutoCompetences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteValidationAutoCompetences extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON = aParam;
		if (this.JSON.listePiliers) {
			this.JSON.listePiliers.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		if (this.JSON.listeEleves) {
			this.JSON.listeEleves.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteValidationAutoCompetences =
	ObjetRequeteValidationAutoCompetences;
CollectionRequetes_1.Requetes.inscrire(
	"ValidationAutoCompetences",
	ObjetRequeteValidationAutoCompetences,
);
