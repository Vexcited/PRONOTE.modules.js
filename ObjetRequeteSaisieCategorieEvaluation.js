exports.ObjetRequeteSaisieCategorieEvaluation = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieCategorieEvaluation extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aListeCategorie) {
		aListeCategorie.setSerialisateurJSON({
			methodeSerialisation: this._serialisation.bind(this),
		});
		this.JSON = { categoriesEvaluation: aListeCategorie };
		return this.appelAsynchrone();
	}
	_serialisation(aElement, aJSON) {
		aJSON.libelle = aElement.getLibelle();
		aJSON.couleur = aElement.couleur;
	}
}
exports.ObjetRequeteSaisieCategorieEvaluation =
	ObjetRequeteSaisieCategorieEvaluation;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCategorieEvaluation",
	ObjetRequeteSaisieCategorieEvaluation,
);
