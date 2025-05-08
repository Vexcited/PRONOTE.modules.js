const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetSerialiser } = require("ObjetSerialiser.js");
class ObjetRequeteSaisieParcoursEducatifs extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		const lSerialisateur = new ObjetSerialiser();
		aParam.listeParcours.setSerialisateurJSON({
			methodeSerialisation:
				lSerialisateur.parcoursEducatif.bind(lSerialisateur),
		});
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie);
	}
}
Requetes.inscrire(
	"SaisieParcoursEducatifs",
	ObjetRequeteSaisieParcoursEducatifs,
);
module.exports = ObjetRequeteSaisieParcoursEducatifs;
