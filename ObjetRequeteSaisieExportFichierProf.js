const {
	ObjetRequeteSaisie,
	EGenreReponseSaisie,
} = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeGenreEchangeDonnees } = require("TypeGenreEchangeDonnees.js");
class ObjetRequeteSaisieExportFichierProf extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
			case TypeGenreEchangeDonnees.GED_PAS:
				lStrMsgDetail = GTraductions.getValeur(
					"Commande.CreerUnFichierDeRessources",
				);
				break;
			default:
				lStrMsgDetail = "";
		}
		return this.appelAsynchrone({ messageDetail: lStrMsgDetail });
	}
	traiterReponseSaisieMessage(aMessagesErreurRapportSaisie) {
		let lDetails = "";
		if (aMessagesErreurRapportSaisie && aMessagesErreurRapportSaisie.join) {
			lDetails = aMessagesErreurRapportSaisie.join("\n");
		}
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message:
				GTraductions.getValeur("EchecSauvegarderUnFichierDeRessourcesPeda") +
				(lDetails ? "\n\n" + lDetails : ""),
		});
	}
	actionApresRequete(aGenreReponse) {
		this.callbackReussite.appel(
			aGenreReponse !== EGenreReponseSaisie.succes,
			this.JSONReponse.url,
		);
	}
}
Requetes.inscrire(
	"SaisieExportFichierProf",
	ObjetRequeteSaisieExportFichierProf,
);
module.exports = ObjetRequeteSaisieExportFichierProf;
