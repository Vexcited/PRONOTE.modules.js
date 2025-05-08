const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieListePunitions extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    aParam.punitions.setSerialisateurJSON({
      methodeSerialisation: _serialiser_Punitions.bind(this),
    });
    this.JSON.punitions = aParam.punitions;
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONRapportSaisie);
  }
}
Requetes.inscrire("SaisieListePunitions", ObjetRequeteSaisieListePunitions);
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
    methodeSerialisation: _serialiser_Motifs.bind(this),
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
    methodeSerialisation: _serialiser_Programmation.bind(this),
  });
  aJSON.programmations = aPunition.programmations;
  aPunition.documentsTAF.setSerialisateurJSON({
    methodeSerialisation: _serialiser_Documents.bind(this),
  });
  aJSON.documentsTAF = aPunition.documentsTAF;
  aPunition.documents.setSerialisateurJSON({
    methodeSerialisation: _serialiser_Documents.bind(this),
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
module.exports = { ObjetRequeteSaisieListePunitions };
