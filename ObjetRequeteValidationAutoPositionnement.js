exports.ObjetRequeteValidationAutoPositionnement = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteValidationAutoPositionnement extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
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
exports.ObjetRequeteValidationAutoPositionnement =
	ObjetRequeteValidationAutoPositionnement;
CollectionRequetes_1.Requetes.inscrire(
	"ValidationAutoPositionnement",
	ObjetRequeteValidationAutoPositionnement,
);
