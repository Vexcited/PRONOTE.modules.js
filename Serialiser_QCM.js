const { ObjetElement } = require("ObjetElement.js");
const { TypeChaineBrute } = require("TypeChaineBrute.js");
const { TypeFichierBase64 } = require("TypeFichierBase64.js");
const { TypeChaineHtml } = require("TypeChaineHtml.js");
const {
  TypeGenreElementAssociation,
} = require("TypeGenreAssociationQuestionQCM.js");
class Serialiser_QCM {
  constructor() {}
  executionQCM(aElement, aJSON) {
    aJSON.QCM = aElement.QCM.toJSON();
    if (aElement.consigne !== undefined) {
      aElement.consigne = new TypeChaineHtml(aElement.consigne);
      aJSON.consigne = aElement.consigne;
    }
    aJSON.dateDebutPublication = aElement.dateDebutPublication;
    aJSON.dateFinPublication = aElement.dateFinPublication;
    aJSON.autoriserLaNavigation = aElement.autoriserLaNavigation;
    aJSON.modeDiffusionCorrige = aElement.modeDiffusionCorrige;
    aJSON.dateCorrige = aElement.dateCorrige;
    aJSON.nombreQuestionsSoumises = aElement.nombreQuestionsSoumises;
    aJSON.homogeneiserNbQuestParNiveau = aElement.homogeneiserNbQuestParNiveau;
    aJSON.jeuQuestionFixe = aElement.jeuQuestionFixe;
    aJSON.melangerLesQuestionsGlobalement =
      aElement.melangerLesQuestionsGlobalement;
    aJSON.melangerLesQuestionsParNiveau =
      aElement.melangerLesQuestionsParNiveau;
    aJSON.melangerLesReponses = aElement.melangerLesReponses;
    aJSON.dureeMaxQCM = aElement.dureeMaxQCM;
    aJSON.nbMaxTentative = aElement.nbMaxTentative;
    aJSON.dureeSupplementaire = aElement.dureeSupplementaire;
    aJSON.nombreQuestionsEnMoins = aElement.nombreQuestionsEnMoins;
    aJSON.ressentiRepondant = aElement.ressentiRepondant;
    aJSON.publierCorrige = aElement.publierCorrige;
    aJSON.tolererFausses = aElement.tolererFausses;
    aJSON.acceptIncomplet = aElement.acceptIncomplet;
    aJSON.pointsSelonPourcentage = aElement.pointsSelonPourcentage;
    if (!!aElement.listeElevesPA) {
      aJSON.listeElevesPA = aElement.listeElevesPA;
      aElement.listeElevesPA.setSerialisateurJSON({
        methodeSerialisation: this.elevePA.bind(this),
      });
    }
    aJSON.afficherResultatNote = aElement.afficherResultatNote;
    aJSON.afficherResultatNiveauMaitrise =
      aElement.afficherResultatNiveauMaitrise;
    if (
      aElement.attribuerNotes !== null &&
      aElement.attribuerNotes !== undefined
    ) {
      aJSON.attribuerNotes = aElement.attribuerNotes;
    }
    return aElement.pourValidation();
  }
  elevePA(aElement, aJSON) {
    aJSON.eleve = aElement.eleve.toJSON();
    aJSON.dureeSupplementaire = aElement.dureeSupplementaire;
    aJSON.nombreQuestionsEnMoins = aElement.nombreQuestionsEnMoins;
  }
  qcm(aElement, aJSON) {
    let lResult = aElement.pourValidation();
    if (aElement.consigne !== undefined) {
      aElement.consigne = new TypeChaineHtml(aElement.consigne);
      aJSON.consigne = aElement.consigne;
    }
    aJSON.matiere = aElement.matiere;
    aJSON.niveau = aElement.niveau;
    aJSON.statutPrive = aElement.statutPrive;
    if (!!aElement.listeProprietaires) {
      aJSON.listeProprietaires = aElement.listeProprietaires;
      aElement.listeProprietaires.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    aJSON.autoriserLaNavigation = aElement.autoriserLaNavigation;
    aJSON.modeDiffusionCorrige = aElement.modeDiffusionCorrige;
    aJSON.nombreQuestionsSoumises = aElement.nombreQuestionsSoumises;
    aJSON.homogeneiserNbQuestParNiveau = aElement.homogeneiserNbQuestParNiveau;
    aJSON.jeuQuestionFixe = aElement.jeuQuestionFixe;
    aJSON.melangerLesQuestionsGlobalement =
      aElement.melangerLesQuestionsGlobalement;
    aJSON.melangerLesQuestionsParNiveau =
      aElement.melangerLesQuestionsParNiveau;
    aJSON.melangerLesReponses = aElement.melangerLesReponses;
    aJSON.dureeMaxQCM = aElement.dureeMaxQCM;
    aJSON.nbMaxTentative = aElement.nbMaxTentative;
    aJSON.dureeSupplementaire = aElement.dureeSupplementaire;
    aJSON.nombreQuestionsEnMoins = aElement.nombreQuestionsEnMoins;
    aJSON.ressentiRepondant = aElement.ressentiRepondant;
    aJSON.tolererFausses = aElement.tolererFausses;
    aJSON.acceptIncomplet = aElement.acceptIncomplet;
    aJSON.pointsSelonPourcentage = aElement.pointsSelonPourcentage;
    if (
      lResult &&
      aElement.contenuQCM &&
      aElement.contenuQCM.typeNumerotation
    ) {
      aJSON.typeNumerotation = aElement.contenuQCM.typeNumerotation;
    }
    if (lResult && !!aElement.categories) {
      aJSON.categories = aElement.categories;
      aElement.categories.setSerialisateurJSON({ ignorerEtatsElements: true });
    }
    if (aElement.contenuQCM && aElement.contenuQCM.listeQuestions) {
      aElement.contenuQCM.listeQuestions.setSerialisateurJSON({
        methodeSerialisation: this.questionQCM.bind(this),
        nePasTrierPourValidation: true,
      });
      aJSON.listeQuestions = aElement.contenuQCM.listeQuestions;
      aJSON.typeNumerotation = aElement.contenuQCM.typeNumerotation;
      lResult =
        lResult ||
        aElement.contenuQCM.listeQuestions.existeElementPourValidation();
    }
    return lResult;
  }
  questionQCM(aElement, aJSON) {
    let lResult = aElement.pourValidation();
    aJSON[ObjetElement.const_JSON.position.JSON] = aElement.getPosition();
    aJSON.nouvellePosition = aElement.nouvellePosition;
    aJSON.estObligatoire = aElement.estObligatoire;
    aJSON.niveauQuestion = aElement.niveauQuestion;
    aJSON.enonce = new TypeChaineBrute(aElement.enonce);
    aJSON.note = aElement.note;
    aJSON.editeur = aElement.editeur;
    aJSON.image = new TypeFichierBase64(aElement.image);
    aJSON.mp3name = aElement.mp3name;
    aJSON.mp3 = new TypeFichierBase64(aElement.mp3);
    aJSON.url = aElement.url;
    aJSON.casesensitive = aElement.casesensitive;
    aJSON.incorrectFeedback = aElement.incorrectFeedback;
    if (aElement.listeReponses) {
      aElement.listeReponses.setSerialisateurJSON({
        methodeSerialisation: _serialiserReponseQCM,
        nePasTrierPourValidation: true,
      });
      aJSON.listeReponses = aElement.listeReponses;
      lResult = lResult || aElement.listeReponses.existeElementPourValidation();
    }
    if (!!aElement.listeEvaluations) {
      aElement.listeEvaluations.setSerialisateurJSON({
        methodeSerialisation: _serialiserCompetencesQuestion,
        nePasTrierPourValidation: true,
      });
      aJSON.listeEvaluations = aElement.listeEvaluations;
    }
    return lResult;
  }
}
function _serialiserCompetencesQuestion(aElement, aJSON) {
  aJSON.tbMaitrise = aElement.tbMaitrise;
  aJSON.coefficient = aElement.coefficient;
  aJSON.palier = aElement.palier;
}
function _serialiserReponseQCM(aElement, aJSON) {
  aJSON[ObjetElement.const_JSON.position.JSON] = aElement.getPosition();
  if (!!aElement.associationA && aElement.associationA.pourValidation()) {
    aJSON.associationA = _serialiserElementAssociation(aElement.associationA);
  }
  if (!!aElement.associationB && aElement.associationB.pourValidation()) {
    aJSON.associationB = _serialiserElementAssociation(aElement.associationB);
  }
  aJSON.feedback = aElement.feedback;
  aJSON.fractionReponse = aElement.fractionReponse;
  aJSON.editionAvancee = aElement.editionAvancee;
  if (aJSON.editionAvancee === true) {
    aJSON.libelleHtml = new TypeChaineBrute(aElement.libelleHtml);
  }
  aJSON.image = new TypeFichierBase64(aElement.image);
}
function _serialiserElementAssociation(aElement) {
  const result = aElement.toJSON();
  switch (aElement.getGenre()) {
    case TypeGenreElementAssociation.GEA_Texte:
      result.strTexte = aElement.strTexte;
      break;
    case TypeGenreElementAssociation.GEA_Image:
      result.strImage = new TypeFichierBase64(aElement.strImage);
      break;
    case TypeGenreElementAssociation.GEA_Son:
      result.strNomFichier = aElement.strNomFichier;
      result.strSon = new TypeFichierBase64(aElement.strSon);
      break;
  }
  return result;
}
module.exports = { Serialiser_QCM };
