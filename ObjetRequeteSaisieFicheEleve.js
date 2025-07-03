exports.ObjetRequeteSaisieFicheEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieFicheEleve extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		if (aParam.listeProjets) {
			aParam.listeProjets.setSerialisateurJSON({
				methodeSerialisation: serialiserProjets.bind(this),
				ignorerEtatsElements: true,
			});
		}
		this.JSON.listeProjets = aParam.listeProjets;
		if (aParam.listeAttestations) {
			aParam.listeAttestations.setSerialisateurJSON({
				methodeSerialisation: serialiserAttestations.bind(this),
				ignorerEtatsElements: true,
			});
		}
		this.JSON.listeAttestations = aParam.listeAttestations;
		if (aParam.listeTypes) {
			aParam.listeTypes.setSerialisateurJSON({
				methodeSerialisation: serialiserTypes.bind(this),
			});
		}
		this.JSON.listeTypes = aParam.listeTypes;
		this.JSON.eleve = aParam.eleve;
		if (aParam.listeFichiers) {
			aParam.listeFichiers.setSerialisateurJSON({
				methodeSerialisation: serialiserDocumentsJoints.bind(this),
			});
		}
		this.JSON.listeFichiers = aParam.listeFichiers;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieFicheEleve = ObjetRequeteSaisieFicheEleve;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieFicheEleve",
	ObjetRequeteSaisieFicheEleve,
);
function serialiserProjets(aProjet, aJSON) {
	$.extend(aJSON, aProjet.copieToJSON());
	aProjet.listeHandicaps.setSerialisateurJSON({
		methodeSerialisation: serialiserHandicaps,
	});
	aJSON.listeHandicaps = aProjet.listeHandicaps;
}
function serialiserAttestations(aAttestation, aJSON) {
	$.extend(aJSON, aAttestation.copieToJSON());
}
function serialiserTypes(aType, aJSON) {
	$.extend(aJSON, aType.copieToJSON());
}
function serialiserDocumentsJoints(aDocument, aJSON) {
	$.extend(aJSON, aDocument.copieToJSON());
}
function serialiserHandicaps(aHandicap, aJSON) {
	$.extend(aJSON, aHandicap.copieToJSON());
}
module.exports = { ObjetRequeteSaisieFicheEleve };
