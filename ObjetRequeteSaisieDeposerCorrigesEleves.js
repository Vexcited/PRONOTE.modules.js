exports.ObjetRequeteSaisieDeposerCorrigesEleves = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieDeposerCorrigesEleves extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		this.JSON = aParametres;
		if (!!this.JSON.listeFichiers) {
			this.JSON.listeFichiers.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: _serialiserFichier,
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieDeposerCorrigesEleves =
	ObjetRequeteSaisieDeposerCorrigesEleves;
CollectionRequetes_1.Requetes.inscrire(
	"DeposerCorrigesEleves",
	ObjetRequeteSaisieDeposerCorrigesEleves,
);
function _serialiserFichier(aElement, aJSON) {
	aJSON.idFichier = aElement.idFichier;
	aJSON.eleve = aElement.eleve;
}
