const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieDeposerCorrigesEleves extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse, this.JSONRapportSaisie);
	}
}
Requetes.inscrire(
	"DeposerCorrigesEleves",
	ObjetRequeteSaisieDeposerCorrigesEleves,
);
function _serialiserFichier(aElement, aJSON) {
	aJSON.idFichier = aElement.idFichier;
	aJSON.eleve = aElement.eleve;
}
module.exports = ObjetRequeteSaisieDeposerCorrigesEleves;
