exports.ObjetRequeteSaisieListePunitions = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieListePunitions extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		aParam.punitions.setSerialisateurJSON({
			methodeSerialisation: _serialiser_Punitions.bind(this),
		});
		this.JSON.punitions = aParam.punitions;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieListePunitions = ObjetRequeteSaisieListePunitions;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieListePunitions",
	ObjetRequeteSaisieListePunitions,
);
function _serialiser_Punitions(aPunition, aJSON) {
	$.extend(aJSON, aPunition.copieToJSON());
	aJSON.estLieIncident = aPunition.estLieIncident;
	aJSON.dateDemande = aPunition.dateDemande;
	aJSON.placeDemande = aPunition.placeDemande;
	aJSON.place = aPunition.place;
	aJSON.duree = aPunition.duree;
	aJSON.horsCours = aPunition.horsCours;
	aJSON.nature = aPunition.nature;
	aJSON.eleve = aPunition.eleve;
	aPunition.motifs.setSerialisateurJSON({
		methodeSerialisation: _serialiser_Motifs,
		ignorerEtatsElements: true,
	});
	aJSON.motifs = aPunition.motifs;
	aJSON.datePublication = aPunition.datePublication;
	aJSON.publicationDossier = aPunition.publicationDossier;
	aJSON.publierTafApresDebutRetenue = aPunition.publierTafApresDebutRetenue;
	aJSON.avecDossier = aPunition.avecDossier;
	aJSON.professeurDemandeur = aPunition.professeurDemandeur;
	aJSON.professeurDemandeur = aPunition.professeurDemandeur;
	if (!!aPunition.professeurDemandeur) {
		aJSON.professeurDemandeur = aPunition.professeurDemandeur;
	}
	if (!!aPunition.personnelDemandeur) {
		aJSON.personnelDemandeur = aPunition.personnelDemandeur;
	}
	aPunition.programmations.setSerialisateurJSON({
		methodeSerialisation: _serialiser_Programmation,
	});
	aJSON.programmations = aPunition.programmations;
	aPunition.documentsTAF.setSerialisateurJSON({
		methodeSerialisation: _serialiser_Documents,
	});
	aJSON.documentsTAF = aPunition.documentsTAF;
	aPunition.documents.setSerialisateurJSON({
		methodeSerialisation: _serialiser_Documents,
	});
	aJSON.documents = aPunition.documents;
}
function _serialiser_Programmation(aProgrammation, aJSON) {
	$.extend(aJSON, aProgrammation.copieToJSON());
	if (aProgrammation.report) {
		aJSON.report = aProgrammation.report.toJSONAll();
	}
}
function _serialiser_Motifs(aMotif, aJSON) {
	$.extend(aJSON, aMotif.copieToJSON());
	if (aMotif.sousCategorieDossier) {
		aJSON.sousCategorieDossier = aMotif.sousCategorieDossier.toJSON();
	}
}
function _serialiser_Documents(aDocument, aJSON) {
	$.extend(aJSON, aDocument.copieToJSON());
}
