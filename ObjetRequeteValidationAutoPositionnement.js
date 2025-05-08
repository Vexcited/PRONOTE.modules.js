const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteValidationAutoPositionnement extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		if (!!aParam.listeEleves) {
			this.JSON.listeEleves = aParam.listeEleves;
			this.JSON.listeEleves.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		return this.appelAsynchrone();
	}
}
Requetes.inscrire(
	"ValidationAutoPositionnement",
	ObjetRequeteValidationAutoPositionnement,
);
module.exports = { ObjetRequeteValidationAutoPositionnement };
