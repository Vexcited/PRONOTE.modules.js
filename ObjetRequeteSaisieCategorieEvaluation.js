const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieCategorieEvaluation extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
Requetes.inscrire(
	"SaisieCategorieEvaluation",
	ObjetRequeteSaisieCategorieEvaluation,
);
module.exports = { ObjetRequeteSaisieCategorieEvaluation };
