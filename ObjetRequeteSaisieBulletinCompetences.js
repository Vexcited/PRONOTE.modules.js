const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetSerialiser } = require("ObjetSerialiser.js");
class ObjetRequeteSaisieBulletinCompetences extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    const lEleveRessource = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Eleve,
    );
    $.extend(this.JSON, {
      classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
      periode: GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Periode,
      ),
      eleve: lEleveRessource,
    });
    if (!!aParam.aPrisConnaissance) {
      this.JSON.aPrisConnaissance = aParam.aPrisConnaissance;
    }
    if (aParam.rangAppreciation) {
      this.JSON.rangAppA = aParam.rangAppreciation.appA;
      if (!!lEleveRessource && lEleveRessource.existeNumero()) {
        this.JSON.rangAppB = aParam.rangAppreciation.appB;
        this.JSON.rangAppC = aParam.rangAppreciation.appC;
      }
    }
    if (aParam.listeServices) {
      aParam.listeServices.setSerialisateurJSON({
        methodeSerialisation: _serialiseListeServices,
      });
      this.JSON.listeServices = aParam.listeServices;
    }
    const lApprPdB = new ObjetListeElements();
    if (aParam.listeConseils) {
      for (let i = 0, lNbr = aParam.listeConseils.count(); i < lNbr; i++) {
        lApprPdB.add(aParam.listeConseils.get(i).ListeAppreciations);
      }
    }
    if (aParam.listeCommentaires) {
      for (let i = 0, lNbr = aParam.listeCommentaires.count(); i < lNbr; i++) {
        lApprPdB.add(aParam.listeCommentaires.get(i).ListeAppreciations);
      }
    }
    if (aParam.listeCpe) {
      for (let i = 0, lNbr = aParam.listeCpe.count(); i < lNbr; i++) {
        lApprPdB.add(aParam.listeCpe.get(i).ListeAppreciations);
      }
    }
    this.JSON.apprPiedBull = lApprPdB.toJSON();
    if (aParam.parcoursEducatif && aParam.parcoursEducatif.listeParcours) {
      const lSerialisateur = new ObjetSerialiser();
      aParam.parcoursEducatif.listeParcours.setSerialisateurJSON({
        methodeSerialisation:
          lSerialisateur.parcoursEducatif.bind(lSerialisateur),
      });
      this.JSON.parcoursEducatif = aParam.parcoursEducatif;
    }
    if (aParam.competences && aParam.competences.listePiliers) {
      aParam.competences.listePiliers.setSerialisateurJSON({
        methodeSerialisation: function (aElement, aJSON) {
          if (aElement.palier) {
            aJSON.palier = aElement.palier.toJSON();
          }
          if (aElement.niveauDAcquisition) {
            aJSON.niveauDAcquisition = aElement.niveauDAcquisition.toJSON();
          }
        },
      });
      this.JSON.competences = aParam.competences;
    }
    if (aParam.listeAttestations) {
      aParam.listeAttestations.setSerialisateurJSON({
        methodeSerialisation: new ObjetSerialiser().serialiseAttestation,
      });
      this.JSON.listeAttestations = aParam.listeAttestations;
    }
    if (!!aParam.listeAppreciationsAssistSaisie) {
      aParam.listeAppreciationsAssistSaisie.setSerialisateurJSON({
        ignorerEtatsElements: true,
        methodeSerialisation: _serialiseTypeAppreciationAssistSaisie,
      });
      this.JSON.listeTypeAppreciations = aParam.listeAppreciationsAssistSaisie;
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieBulletinCompetences",
  ObjetRequeteSaisieBulletinCompetences,
);
function _serialiseListeServices(aElement, aJSON) {
  if (!!aElement.appreciationA) {
    aJSON.appreciationA = aElement.appreciationA;
  }
  if (!!aElement.appreciationB) {
    aJSON.appreciationB = aElement.appreciationB;
  }
  if (!!aElement.appreciationC) {
    aJSON.appreciationC = aElement.appreciationC;
  }
  if (
    !!aElement.posLSUNiveau &&
    aElement.posLSUNiveau.getEtat() !== EGenreEtat.Aucun
  ) {
    aJSON.posLSUNiveau = aElement.posLSUNiveau.toJSON();
  }
  if (!!aElement.posLSUNote) {
    aJSON.posLSUNote = aElement.posLSUNote;
  }
  if (!!aElement.listeEltProgramme) {
    aJSON.listeEltProgramme = aElement.listeEltProgramme;
  }
  if (!!aElement.listeColonnesTransv) {
    aElement.listeColonnesTransv.setSerialisateurJSON({
      methodeSerialisation: _serialiseColonnesTransv,
    });
    aJSON.listeColonnesTransv = aElement.listeColonnesTransv;
  }
}
function _serialiseColonnesTransv(aElement, aJSON) {
  aJSON.niveauAcquiEstCalcule = !aElement.niveauAcqui;
  if (!!aElement.niveauAcqui) {
    aJSON.niveauAcqui = aElement.niveauAcqui.toJSON();
  }
}
function _serialiseTypeAppreciationAssistSaisie(aTypeAppreciation, aJSON) {
  if (!!aTypeAppreciation.listeCategories) {
    aTypeAppreciation.listeCategories.setSerialisateurJSON({
      methodeSerialisation: _serialiseCategorieAppreciationAssistSaisie,
    });
    aJSON.listeCategories = aTypeAppreciation.listeCategories;
  }
}
function _serialiseCategorieAppreciationAssistSaisie(aCategorie, aJSON) {
  if (!!aCategorie.listeAppreciations) {
    aJSON.listeAppreciations = aCategorie.listeAppreciations;
  }
}
module.exports = { ObjetRequeteSaisieBulletinCompetences };
