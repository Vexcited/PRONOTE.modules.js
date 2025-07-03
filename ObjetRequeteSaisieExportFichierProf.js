exports.ObjetRequeteSaisieExportFichierProf = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreEchangeDonnees_1 = require("TypeGenreEchangeDonnees");
class ObjetRequeteSaisieExportFichierProf extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		if (
			this.JSON &&
			this.JSON.listeModeles !== null &&
			this.JSON.listeModeles !== undefined
		) {
			this.JSON.listeModeles.setSerialisateurJSON({
				ignorerEtatsElements: true,
				nePasTrierPourValidation: true,
			});
		}
		let lStrMsgDetail;
		switch (aParam.genreFichier) {
			case TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees.GED_PAS:
				lStrMsgDetail = ObjetTraduction_1.GTraductions.getValeur(
					"Commande.CreerUnFichierDeRessources",
				);
				break;
			default:
				lStrMsgDetail = "";
		}
		this.setOptions({ messageDetail: lStrMsgDetail });
		return this.appelAsynchrone();
	}
	traiterReponseSaisieMessage(aMessagesErreurRapportSaisie) {
		let lDetails = "";
		if (aMessagesErreurRapportSaisie && aMessagesErreurRapportSaisie.join) {
			lDetails = aMessagesErreurRapportSaisie.join("\n");
		}
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
			message:
				ObjetTraduction_1.GTraductions.getValeur(
					"EchecSauvegarderUnFichierDeRessourcesPeda",
				) + (lDetails ? "\n\n" + lDetails : ""),
		});
	}
}
exports.ObjetRequeteSaisieExportFichierProf =
	ObjetRequeteSaisieExportFichierProf;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieExportFichierProf",
	ObjetRequeteSaisieExportFichierProf,
);
