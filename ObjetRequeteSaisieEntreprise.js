exports.ObjetRequeteSaisieEntreprise = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieEntreprise extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aEntreprise) {
		this.JSON = aEntreprise.copieToJSON();
		this.JSON.contacts.setSerialisateurJSON({
			methodeSerialisation: function (aElement, aJSON) {
				$.extend(aJSON, aElement.copieToJSON());
			},
		});
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieEntreprise = ObjetRequeteSaisieEntreprise;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieEntreprise",
	ObjetRequeteSaisieEntreprise,
);
