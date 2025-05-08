const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetElement } = require("ObjetElement.js");
class ObjetRequeteSaisieAppreciationFinDeStage extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON.eleve = new ObjetElement("", aParam.numEleve);
    aParam.stage.setEtat(EGenreEtat.Modification);
    this.JSON.stage = aParam.stage.toJSON();
    serialiserAnnexe(aParam.stage, this.JSON.stage);
    aParam.listePJ.setSerialisateurJSON({
      methodeSerialisation: serialiserDocumentsJoints.bind(this),
    });
    this.JSON.listeFichiers = aParam.listePJ;
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieAppreciationFinDeStage",
  ObjetRequeteSaisieAppreciationFinDeStage,
);
function serialiserAnnexe(aStage, aJSON) {
  aJSON.sujet = aStage.sujet.toJSON();
  aJSON.sujetDetaille = aStage.sujetDetaille;
  aJSON.activitesDejaRealisees = aStage.activitesDejaRealisees;
  aJSON.competencesMobilisees = aStage.competencesMobilisees;
  aJSON.objectifs = aStage.objectifs;
  aJSON.activitesPrevues = aStage.activitesPrevues;
  aJSON.moyensMobilises = aStage.moyensMobilises;
  aJSON.competencesVisees = aStage.competencesVisees;
  aJSON.travauxAuxMineurs = aStage.travauxAuxMineurs;
  aJSON.modalitesConcertation = aStage.modalitesConcertation;
  aJSON.typeModalitesEvaluation = aStage.typeModalitesEvaluation.toJSON();
  aJSON.modalitesEvaluation = aStage.modalitesEvaluation;
  aStage.suiviStage.setSerialisateurJSON({
    methodeSerialisation: serialiserSuiviStage.bind(this),
  });
  aJSON.suiviStage = aStage.suiviStage;
  aStage.appreciations.setSerialisateurJSON({
    methodeSerialisation: serialiserAppreciations.bind(this),
  });
  aJSON.appreciations = aStage.appreciations;
  aStage.listePJ.setSerialisateurJSON({
    methodeSerialisation: serialiserDocumentsJoints.bind(this),
  });
  aJSON.listePJ = aStage.listePJ;
}
function serialiserSuiviStage(aElement, aJSON) {
  $.extend(aJSON, aElement.copieToJSON());
  if (aElement.listePJ) {
    aElement.listePJ.setSerialisateurJSON({
      methodeSerialisation: serialiserDocumentsJoints.bind(this),
    });
    aJSON.listePJ = aElement.listePJ;
  }
}
function serialiserDocumentsJoints(aDocument, aJSON) {
  $.extend(aJSON, aDocument.copieToJSON());
}
function serialiserAppreciations(aElement, aJSON) {
  $.extend(aJSON, aElement.copieToJSON());
}
module.exports = ObjetRequeteSaisieAppreciationFinDeStage;
