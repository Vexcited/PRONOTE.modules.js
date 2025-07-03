exports.ObjetRequeteParcoursEducatif = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteParcoursEducatif extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		if (this.JSON.listeEleves) {
			this.JSON.listeEleves.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteParcoursEducatif = ObjetRequeteParcoursEducatif;
CollectionRequetes_1.Requetes.inscrire(
	"ParcoursEducatif",
	ObjetRequeteParcoursEducatif,
);
