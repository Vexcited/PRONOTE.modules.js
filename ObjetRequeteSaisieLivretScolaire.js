const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ObjetSerialiser } = require("ObjetSerialiser.js");
class ObjetRequeteSaisieLivretScolaire extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aDonnees) {
    let lListe;
    this.JSON.classe = aDonnees.classeSelectionne.toJSON();
    switch (aDonnees.genre) {
      case EGenreOnglet.LivretScolaire_Fiche:
        if (aDonnees.eleve) {
          this.JSON.eleve = aDonnees.eleve.toJSON();
        }
        lListe = aDonnees.eleve.listeLivret.getListeElements((aElement) => {
          const lEnModification = aElement.getEtat() !== EGenreEtat.Aucun;
          const lAppreciationModifie =
            aElement.appreciationAnnuelle &&
            aElement.appreciationAnnuelle.getEtat() !== EGenreEtat.Aucun;
          const lAvecModifConserverAnciennesNotes =
            aDonnees.eleve.estRedoublant &&
            aElement.modifConserveAnciennesNotes === true;
          return (
            lEnModification ||
            lAppreciationModifie ||
            lAvecModifConserverAnciennesNotes
          );
        });
        break;
      case EGenreOnglet.LivretScolaire_Appreciations:
      case EGenreOnglet.LivretScolaire_Competences:
        if (aDonnees.service) {
          this.JSON.service = aDonnees.service.toJSON();
        }
        lListe = aDonnees.service.listeLivret.getListeElements((aElement) => {
          const lEnModification = aElement.getEtat() !== EGenreEtat.Aucun;
          const lAppreciationModifie =
            aElement.appreciationAnnuelle &&
            aElement.appreciationAnnuelle.getEtat() !== EGenreEtat.Aucun;
          return lEnModification || lAppreciationModifie;
        });
        break;
      default:
    }
    lListe.setSerialisateurJSON({
      ignorerEtatsElements: true,
      methodeSerialisation: _serialisation.bind(this),
    });
    this.JSON.listeLivret = lListe;
    const lParametres = aDonnees.piedDePage;
    if (
      lParametres &&
      lParametres.avisCE &&
      lParametres.avisCE.infosLivret &&
      lParametres.avisCE.infosLivret.pourValidation()
    ) {
      this.JSON.infosAvisCE = lParametres.avisCE.infosLivret.toJSON();
      this.JSON.infosAvisCE.commentaire =
        lParametres.avisCE.infosLivret.commentaire;
      if (lParametres.avisCE.infosLivret.date) {
        this.JSON.infosAvisCE.date = lParametres.avisCE.infosLivret.date;
      }
      if (lParametres.avisCE.infosLivret.auteur) {
        this.JSON.infosAvisCE.auteur = lParametres.avisCE.infosLivret.auteur;
      }
      if (lParametres.avisCE.infosLivret.avis) {
        this.JSON.infosAvisCE.avis =
          lParametres.avisCE.infosLivret.avis.toJSON();
      }
    }
    if (
      lParametres &&
      lParametres.engagements &&
      lParametres.engagements.infosLivret &&
      lParametres.engagements.estModifie
    ) {
      lParametres.engagements.listeEngagements.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
      this.JSON.infosEngagements = lParametres.engagements.infosLivret.toJSON();
      if (lParametres.engagements.infosLivret.pourValidation()) {
        this.JSON.infosEngagements.commentaire =
          lParametres.engagements.infosLivret.commentaire;
      }
      if (lParametres.engagements.infosLivret.date) {
        this.JSON.infosEngagements.date =
          lParametres.engagements.infosLivret.date;
      }
      if (lParametres.engagements.infosLivret.auteur) {
        this.JSON.infosEngagements.auteur =
          lParametres.engagements.infosLivret.auteur;
      }
      this.JSON.infosEngagements.listeEngagements =
        lParametres.engagements.listeEngagements;
    }
    if (
      lParametres &&
      lParametres.investissement &&
      lParametres.investissement.infosLivret &&
      lParametres.investissement.estModifie
    ) {
      this.JSON.infosInvestissement =
        lParametres.investissement.infosLivret.toJSON();
      if (lParametres.investissement.infosLivret.pourValidation()) {
        this.JSON.infosInvestissement.commentaire =
          lParametres.investissement.infosLivret.commentaire;
      }
      if (lParametres.investissement.infosLivret.date) {
        this.JSON.infosInvestissement.date =
          lParametres.investissement.infosLivret.date;
      }
      if (lParametres.investissement.infosLivret.auteur) {
        this.JSON.infosInvestissement.auteur =
          lParametres.investissement.infosLivret.auteur;
      }
    }
    if (
      lParametres &&
      lParametres.pfmp &&
      lParametres.pfmp.infosLSEleve &&
      lParametres.pfmp.infosLSEleve.pourValidation()
    ) {
      this.JSON.infosPfmp = lParametres.pfmp.infosLSEleve.toJSON();
      this.JSON.infosPfmp.nombreSemaines =
        lParametres.pfmp.infosLSEleve.nombreSemaines;
      this.JSON.infosPfmp.aLEtranger = lParametres.pfmp.infosLSEleve.aLEtranger;
      this.JSON.infosPfmp.appreciation =
        lParametres.pfmp.infosLSEleve.appreciation;
    }
    if (
      lParametres &&
      lParametres.parcoursDifferencie &&
      lParametres.parcoursDifferencie.infosLivret &&
      lParametres.parcoursDifferencie.infosLivret.pourValidation()
    ) {
      this.JSON.parcoursDifferencie =
        lParametres.parcoursDifferencie.infosLivret.toJSON();
      this.JSON.parcoursDifferencie.commentaire =
        lParametres.parcoursDifferencie.infosLivret.commentaire;
      this.JSON.parcoursDifferencie.date =
        lParametres.parcoursDifferencie.infosLivret.date;
      this.JSON.parcoursDifferencie.auteur =
        lParametres.parcoursDifferencie.infosLivret.auteur;
    }
    if (!!aDonnees.listeTypesAppreciations) {
      const lObjetSerialiser = new ObjetSerialiser();
      aDonnees.listeTypesAppreciations.setSerialisateurJSON({
        ignorerEtatsElements: true,
        methodeSerialisation:
          lObjetSerialiser.serialiseTypeAppreciationAssistSaisie.bind(
            lObjetSerialiser,
          ),
      });
      this.JSON.listeTypeAppreciations = aDonnees.listeTypesAppreciations;
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieLivretScolaire", ObjetRequeteSaisieLivretScolaire);
function _serialisation(aElement, aJSON) {
  if (aElement.service) {
    aJSON.service = aElement.service.toJSON();
  }
  if (aElement.services && aElement.services.count() > 1) {
    aElement.services.setSerialisateurJSON({
      methodeSerialisation: _serialisationService.bind(this),
    });
    aJSON.services = aElement.services;
  }
  if (aElement.metaMatiere) {
    aJSON.metaMatiere = aElement.metaMatiere.toJSON();
  }
  if (aElement.periode) {
    aJSON.periode = aElement.periode.toJSON();
  }
  if (aElement.eleve) {
    aJSON.eleve = aElement.eleve.toJSON();
  }
  if (aElement.modifConserveAnciennesNotes) {
    aJSON.conserveAnciennesNotes = aElement.conserveAnciennesNotes;
  }
  if (aElement.itemLivretScolaire) {
    if (
      aElement.itemLivretScolaire.getEtat() !== EGenreEtat.Aucun ||
      aElement.modifConserveAnciennesNotes
    ) {
      aJSON.itemLivretScolaire = aElement.itemLivretScolaire.toJSON();
      if (aElement.itemLivretScolaire.getEtat() !== EGenreEtat.Aucun) {
        aJSON.itemLivretScolaire.evaluation =
          aElement.itemLivretScolaire.evaluation.toJSON();
      }
    }
  }
  if (aElement.listeCompetences) {
    aElement.listeCompetences.setSerialisateurJSON({
      methodeSerialisation: _serialisationCompetence.bind(this),
    });
    aJSON.listeCompetences = aElement.listeCompetences;
  }
  if (
    aElement.appreciationAnnuelle &&
    aElement.appreciationAnnuelle.getEtat() !== EGenreEtat.Aucun
  ) {
    aJSON.appreciationAnnuelle = aElement.appreciationAnnuelle.toJSON();
  }
}
function _serialisationService(aElement, aJSON) {
  aJSON.appreciationAnnuelle = aElement.appreciationAnnuelle.toJSON();
}
function _serialisationCompetence(aElement, aJSON) {
  aJSON.evaluation = aElement.evaluation.toJSON();
}
module.exports = { ObjetRequeteSaisieLivretScolaire };
