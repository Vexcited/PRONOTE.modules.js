const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieFichierResultatsSondage extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		return this.appelAsynchrone();
	}
}
Requetes.inscrire(
	"SaisieFichierResultatsSondage",
	ObjetRequeteSaisieFichierResultatsSondage,
);
module.exports = { ObjetRequeteSaisieFichierResultatsSondage };
