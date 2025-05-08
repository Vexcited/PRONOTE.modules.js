const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieEntreprise extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
Requetes.inscrire("SaisieEntreprise", ObjetRequeteSaisieEntreprise);
module.exports = ObjetRequeteSaisieEntreprise;
