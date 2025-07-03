exports.ObjetRequeteSaisieDocumentsATelecharger = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieDocumentsATelecharger extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		$.extend(this.JSON, aParams);
		if (!!aParams.listeNaturesDocumentsAFournir) {
			this.JSON.listeNaturesDocumentsAFournir.setSerialisateurJSON({
				methodeSerialisation: this._ajouterNatureDocuments.bind(this),
			});
		}
		return this.appelAsynchrone();
	}
	_ajouterNatureDocuments(aElement, aJSON) {
		if ("genreDestinataireCollecte" in aElement) {
			aJSON.genreDestinataireCollecte = aElement.genreDestinataireCollecte;
		}
		if (!!aElement.listePJ) {
			aJSON.listePJ = aElement.listePJ;
			aJSON.listePJ.setSerialisateurJSON({
				methodeSerialisation: this._serialiserFichier.bind(this),
			});
		}
	}
	_serialiserFichier(aElement, aJSON) {
		aJSON.idFichier = aElement.idFichier;
	}
}
exports.ObjetRequeteSaisieDocumentsATelecharger =
	ObjetRequeteSaisieDocumentsATelecharger;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieDocumentATelecharger",
	ObjetRequeteSaisieDocumentsATelecharger,
);
