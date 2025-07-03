exports.ObjetRequeteSaisieDossierVS = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieDossierVS extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		aParam.listeDossiers.setSerialisateurJSON({
			methodeSerialisation: this.serialiserDossiers.bind(this),
		});
		this.JSON.listeDossiers = aParam.listeDossiers;
		if (!!aParam.listeCategories) {
			aParam.listeCategories.setSerialisateurJSON({
				methodeSerialisation: this.serialiserCategories.bind(this),
			});
		}
		this.JSON.listeCategories = aParam.listeCategories;
		this.JSON.eleve = aParam.eleve;
		aParam.listePJ.setSerialisateurJSON({
			methodeSerialisation: this.serialiserDocumentsJoints.bind(this),
		});
		this.JSON.listeFichiers = aParam.listePJ;
		return this.appelAsynchrone();
	}
	serialiserDossiers(aDossier, aJSON) {
		$.extend(aJSON, aDossier.copieToJSON());
		aDossier.listeMotifs.setSerialisateurJSON({
			methodeSerialisation: this.serialiserMotifs.bind(this),
			ignorerEtatsElements: true,
		});
		aJSON.listeMotifs = aDossier.listeMotifs;
		aDossier.listeElements.setSerialisateurJSON({
			methodeSerialisation: this.serialiserElements.bind(this),
		});
		aJSON.listeElements = aDossier.listeElements;
	}
	serialiserMotifs(aMotif, aJSON) {
		$.extend(aJSON, aMotif.copieToJSON());
	}
	serialiserCategories(aMotif, aJSON) {
		$.extend(aJSON, aMotif.copieToJSON());
	}
	serialiserDocumentsJoints(aDocument, aJSON) {
		$.extend(aJSON, aDocument.copieToJSON());
	}
	serialiserMessage(aMessage, aJSON) {
		$.extend(aJSON, aMessage.copieToJSON());
	}
	serialiserElements(aElement, aJSON) {
		$.extend(aJSON, aElement.copieToJSON());
		aJSON.respAdmin = aElement.element.respAdmin;
		if (aElement.element.type) {
			aJSON.genre = aElement.element.type.getGenre();
		}
		if (aElement.estUneDiscussion && aElement.listeMessages) {
			aElement.listeMessages.setSerialisateurJSON({
				methodeSerialisation: this.serialiserMessage.bind(this),
				ignorerEtatsElements: true,
			});
			aJSON.listeMessages = aElement.listeMessages;
		}
	}
}
exports.ObjetRequeteSaisieDossierVS = ObjetRequeteSaisieDossierVS;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieDossiersVieScolaire",
	ObjetRequeteSaisieDossierVS,
);
