const { DonneesListe_Dispenses } = require("DonneesListe_Dispenses.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { MethodesObjet } = require("MethodesObjet.js");
class TUtilitaireDispenses {
  constructor() {}
  static serialisationDonnees(aElement, aJSON, aIndice) {
    _serialisation.call(this, aElement, aJSON, aIndice);
  }
  static saisieDocument(
    aDonnees,
    aConfirmation,
    aConfirmation_continue,
    aListeFichiersUpload,
  ) {
    _saisieDocument.call(
      this,
      aDonnees,
      aConfirmation,
      aConfirmation_continue,
      aListeFichiersUpload,
    );
  }
}
function _serialisation(aElement, aJSON) {
  aJSON.eleve = aElement.eleve;
  aJSON.classe = aElement.classe;
  aJSON.matiere = aElement.matiere;
  aJSON.placeDebut = aElement.placeDebut;
  aJSON.placeFin = aElement.placeFin;
  aJSON.dateDebut = aElement.dateDebut;
  aJSON.dateFin = aElement.dateFin;
  aJSON.commentaire = aElement.commentaire;
  aJSON.presenceOblig = aElement.presenceOblig;
  aJSON.publierPJFeuilleDAppel = aElement.publierPJFeuilleDAppel;
  aElement.documents.setSerialisateurJSON({
    methodeSerialisation: _serialisationDoc.bind(this),
  });
  aJSON.documents = aElement.documents;
}
function _serialisationDoc(aElement, aJSON) {
  aJSON.idFichier = aElement.idFichier;
  aJSON.nomOriginal = aElement.nomOriginal;
}
function _saisieDocument(
  aDonnees,
  aConfirmation,
  aConfirmation_continue,
  aListeFichiersUpload,
) {
  const lParametres = $.extend(
    {
      genreSaisie: null,
      eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
    },
    aDonnees,
  );
  if (aConfirmation) {
    lParametres.confirmation = aConfirmation;
  }
  lParametres.confirmation_continue = aConfirmation_continue;
  this.listeFichiersUpload = aListeFichiersUpload;
  let lDoc;
  switch (lParametres.genreSaisie) {
    case DonneesListe_Dispenses.genreAction.AjouterDocument: {
      const lIdx = this.listeFichiersUpload.getIndiceElementParFiltre(
        (aElement) => {
          return aElement.idFichier === lParametres.idFichier;
        },
      );
      lDoc = this.listeFichiersUpload.get(lIdx);
      lParametres.article.documents.addElement(lDoc);
      lParametres.article.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
      break;
    }
    case DonneesListe_Dispenses.genreAction.SupprimerDocument:
      if (!!lParametres.document) {
        lDoc = lParametres.article.documents.getElementParNumero(
          lParametres.document.getNumero(),
        );
        if (!!lDoc) {
          lDoc.setEtat(EGenreEtat.Suppression);
          lParametres.article.setEtat(EGenreEtat.Modification);
          this.setEtatSaisie(true);
        }
      }
      break;
    default:
      break;
  }
  if (this.actionApresSaisieDocument) {
    this.actionApresSaisieDocument();
  }
}
module.exports = { TUtilitaireDispenses };
