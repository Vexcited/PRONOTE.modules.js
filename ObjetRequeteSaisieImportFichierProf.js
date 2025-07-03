exports.ObjetRequeteSaisieImportFichierProf = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreEchangeDonnees_1 = require("TypeGenreEchangeDonnees");
class ObjetRequeteSaisieImportFichierProf extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		let lStrMsgDetail;
		switch (aParam.genreFichier) {
			case TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees.GED_PAS:
				lStrMsgDetail = ObjetTraduction_1.GTraductions.getValeur(
					"Commande.RecupererFichierDeRessources",
				);
				break;
			default:
				lStrMsgDetail = "";
		}
		this.setOptions({ messageDetail: lStrMsgDetail });
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieImportFichierProf =
	ObjetRequeteSaisieImportFichierProf;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieImportFichierProf",
	ObjetRequeteSaisieImportFichierProf,
);
