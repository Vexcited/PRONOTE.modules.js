const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteValidationAutoCompetences extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
Requetes.inscrire(
	"ValidationAutoCompetences",
	ObjetRequeteValidationAutoCompetences,
);
module.exports = { ObjetRequeteValidationAutoCompetences };
