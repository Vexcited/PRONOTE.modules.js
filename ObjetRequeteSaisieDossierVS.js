const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieDossierVS extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		aParam.listeDossiers.setSerialisateurJSON({
			methodeSerialisation: serialiserDossiers.bind(this),
		});
		this.JSON.listeDossiers = aParam.listeDossiers;
		if (!!aParam.listeCategories) {
			aParam.listeCategories.setSerialisateurJSON({
				methodeSerialisation: serialiserCategories.bind(this),
			});
		}
		this.JSON.listeCategories = aParam.listeCategories;
		this.JSON.eleve = aParam.eleve;
		aParam.listePJ.setSerialisateurJSON({
			methodeSerialisation: serialiserDocumentsJoints.bind(this),
		});
		this.JSON.listeFichiers = aParam.listePJ;
		return this.appelAsynchrone();
	}
}
Requetes.inscrire("SaisieDossiersVieScolaire", ObjetRequeteSaisieDossierVS);
function serialiserDossiers(aDossier, aJSON) {
	$.extend(aJSON, aDossier.copieToJSON());
	aDossier.listeMotifs.setSerialisateurJSON({
		methodeSerialisation: serialiserMotifs.bind(this),
		ignorerEtatsElements: true,
	});
	aJSON.listeMotifs = aDossier.listeMotifs;
	aDossier.listeElements.setSerialisateurJSON({
		methodeSerialisation: serialiserElements.bind(this),
	});
	aJSON.listeElements = aDossier.listeElements;
}
function serialiserMotifs(aMotif, aJSON) {
	$.extend(aJSON, aMotif.copieToJSON());
}
function serialiserCategories(aMotif, aJSON) {
	$.extend(aJSON, aMotif.copieToJSON());
}
function serialiserDocumentsJoints(aDocument, aJSON) {
	$.extend(aJSON, aDocument.copieToJSON());
}
function serialiserElements(aElement, aJSON) {
	$.extend(aJSON, aElement.copieToJSON());
	aJSON.respAdmin = aElement.element.respAdmin;
	if (aElement.element.type) {
		aJSON.genre = aElement.element.type.getGenre();
	}
}
module.exports = { ObjetRequeteSaisieDossierVS };
