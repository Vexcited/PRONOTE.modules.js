exports.ObjetRequeteSaisieParcoursEducatifs = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetSerialiser_1 = require("ObjetSerialiser");
class ObjetRequeteSaisieParcoursEducatifs extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		const lSerialisateur = new ObjetSerialiser_1.ObjetSerialiser();
		aParam.listeParcours.setSerialisateurJSON({
			methodeSerialisation:
				lSerialisateur.parcoursEducatif.bind(lSerialisateur),
		});
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieParcoursEducatifs =
	ObjetRequeteSaisieParcoursEducatifs;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieParcoursEducatifs",
	ObjetRequeteSaisieParcoursEducatifs,
);
