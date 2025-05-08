const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieIncidents extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    aParam.incidents.setSerialisateurJSON({
      methodeSerialisation: _serialiser_Incidents.bind(this),
    });
    this.JSON.incidents = aParam.incidents;
    if (!!aParam.listeFichiers) {
      this.JSON.listeFichiers = aParam.listeFichiers.setSerialisateurJSON({
        methodeSerialisation: _serialiserFichier,
      });
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONRapportSaisie);
  }
}
Requetes.inscrire("SaisieIncidents", ObjetRequeteSaisieIncidents);
function _serialiserFichier(aElement, aJSON) {
  aJSON.idFichier = aElement.idFichier;
  aJSON.TAF = aElement.TAF;
}
function _serialiser_Incidents(aIncident, aJSON) {
  $.extend(aJSON, aIncident.copieToJSON());
  if (aIncident.gravite === "") {
    aJSON.gravite = 1;
  }
  aIncident.protagonistes.setSerialisateurJSON({
    methodeSerialisation: _serialiser_Protagonistes.bind(this),
  });
  aJSON.protagonistes = aIncident.protagonistes;
  aIncident.listeMotifs.setSerialisateurJSON({
    methodeSerialisation: _serialiser_Motifs.bind(this),
    ignorerEtatsElements: true,
  });
  aJSON.listeMotifs = aIncident.listeMotifs;
  aIncident.actionsEnvisagees.setSerialisateurJSON({
    ignorerEtatsElements: true,
  });
  aJSON.actionsEnvisagees = aIncident.actionsEnvisagees;
  aIncident.documents.setSerialisateurJSON({
    methodeSerialisation: _serialiser_Documents.bind(this),
  });
  aJSON.documents = aIncident.documents;
}
function _serialiser_Protagonistes(aRelProtagoniste, aJSON) {
  $.extend(aJSON, aRelProtagoniste.copieToJSON());
  if (aRelProtagoniste.mesure) {
    aJSON.mesure = aRelProtagoniste.mesure.toJSON();
    $.extend(aJSON.mesure, aRelProtagoniste.mesure.copieToJSON());
    if (aRelProtagoniste.mesure.documentsTAF) {
      aRelProtagoniste.mesure.documentsTAF.setSerialisateurJSON({
        methodeSerialisation: _serialiser_Documents.bind(this),
      });
      aJSON.mesure.documentsTAF = aRelProtagoniste.mesure.documentsTAF;
    }
  }
  if (aRelProtagoniste.dossier) {
    aJSON.dossier = aRelProtagoniste.dossier.toJSON();
    $.extend(aJSON.dossier, aRelProtagoniste.dossier.copieToJSON());
    if (aRelProtagoniste.dossier.element) {
      aJSON.dossier.element = aRelProtagoniste.dossier.element.toJSON();
      $.extend(
        aJSON.dossier.element,
        aRelProtagoniste.dossier.element.copieToJSON(),
      );
    }
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
module.exports = { ObjetRequeteSaisieIncidents };
