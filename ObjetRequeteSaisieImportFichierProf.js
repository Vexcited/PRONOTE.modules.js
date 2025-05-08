const {
	ObjetRequeteSaisie,
	EGenreReponseSaisie,
} = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeGenreEchangeDonnees } = require("TypeGenreEchangeDonnees.js");
class ObjetRequeteSaisieImportFichierProf extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		let lStrMsgDetail;
		switch (aParam.genreFichier) {
			case TypeGenreEchangeDonnees.GED_PAS:
				lStrMsgDetail = GTraductions.getValeur(
					"Commande.RecupererFichierDeRessources",
				);
				break;
			default:
				lStrMsgDetail = "";
		}
		return this.appelAsynchrone({ messageDetail: lStrMsgDetail });
	}
	actionApresRequete(aGenreMessage) {
		this.callbackReussite.appel(aGenreMessage === EGenreReponseSaisie.succes);
	}
}
Requetes.inscrire(
	"SaisieImportFichierProf",
	ObjetRequeteSaisieImportFichierProf,
);
module.exports = ObjetRequeteSaisieImportFichierProf;
