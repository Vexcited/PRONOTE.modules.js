const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSerialiser } = require("ObjetSerialiser.js");
class ObjetRequeteSaisieBulletin extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = {
      classe: aParam.classe,
      periode: aParam.periode,
      eleve: aParam.eleve,
    };
    if (!!aParam.listeDonnees) {
      aParam.listeDonnees.setSerialisateurJSON({
        methodeSerialisation: _ajouterService,
      });
      this.JSON.listeServices = aParam.listeDonnees;
    }
    const lListeAppreciationsPiedDeBulletin = new ObjetListeElements();
    if (!!aParam.listeGeneral) {
      aParam.listeGeneral.parcourir((D) => {
        lListeAppreciationsPiedDeBulletin.add(D.ListeAppreciations);
      });
    }
    if (!!aParam.listeCdClasse) {
      aParam.listeCdClasse.parcourir((D) => {
        lListeAppreciationsPiedDeBulletin.add(D.ListeAppreciations);
      });
    }
    if (!!aParam.listeComm) {
      aParam.listeComm.parcourir((D) => {
        lListeAppreciationsPiedDeBulletin.add(D.ListeAppreciations);
      });
    }
    if (!!aParam.listeCPE) {
      aParam.listeCPE.parcourir((D) => {
        lListeAppreciationsPiedDeBulletin.add(D.ListeAppreciations);
      });
    }
    if (lListeAppreciationsPiedDeBulletin.count() > 0) {
      lListeAppreciationsPiedDeBulletin.setSerialisateurJSON({
        methodeSerialisation: _ajouterPeriode,
      });
      this.JSON.listeAppreciationsPiedDeBulletin =
        lListeAppreciationsPiedDeBulletin;
    }
    if (
      !!aParam.parcoursEducatif &&
      !!aParam.parcoursEducatif.listeParcours &&
      aParam.parcoursEducatif.listeParcours.count() > 0
    ) {
      aParam.parcoursEducatif.listeParcours.setSerialisateurJSON({
        methodeSerialisation: new ObjetSerialiser().parcoursEducatif,
      });
      this.JSON.parcoursEducatif = {
        listeParcours: aParam.parcoursEducatif.listeParcours,
        periode: aParam.periode,
      };
    }
    if (!!aParam.competences && !!aParam.competences.listePiliers) {
      aParam.competences.listePiliers.setSerialisateurJSON({
        methodeSerialisation: function (aElement, aJSON) {
          if (aElement.palier) {
            aJSON.palier = aElement.palier;
          }
          if (aElement.niveauDAcquisition) {
            aJSON.niveauDAcquisition = aElement.niveauDAcquisition;
            if (aElement.niveauDAcquisition.periode) {
              aJSON.niveauDAcquisition.periode =
                aElement.niveauDAcquisition.periode;
            }
          }
        },
      });
      this.JSON.competences = { listePiliers: aParam.competences.listePiliers };
    }
    if (aParam.listeAttestations) {
      aParam.listeAttestations.setSerialisateurJSON({
        methodeSerialisation: new ObjetSerialiser().serialiseAttestation,
      });
      this.JSON.listeAttestations = aParam.listeAttestations;
    }
    if (!!aParam.listeTypesAppreciations) {
      const lObjetSerialiser = new ObjetSerialiser();
      aParam.listeTypesAppreciations.setSerialisateurJSON({
        ignorerEtatsElements: true,
        methodeSerialisation:
          lObjetSerialiser.serialiseTypeAppreciationAssistSaisie.bind(
            lObjetSerialiser,
          ),
      });
      this.JSON.listeTypeAppreciations = aParam.listeTypesAppreciations;
    }
    if (!!aParam.listeNiveauDAcquisitions) {
      aParam.listeNiveauDAcquisitions.setSerialisateurJSON({
        methodeSerialisation: function (aElement, aJSON) {
          aJSON.position = aElement.position;
          aJSON.periode = aElement.periode;
        },
      });
      this.JSON.listeNiveauDAcquisitions = aParam.listeNiveauDAcquisitions;
    }
    if (!!aParam.listeMoyennes) {
      aParam.listeMoyennes.setSerialisateurJSON({
        ignorerEtatsElements: true,
        methodeSerialisation: function (aElement, aJSON) {
          aJSON.moyenne = aElement.moyenne;
          aJSON.periode = aElement.periode;
        },
      });
      this.JSON.listeMoyennes = aParam.listeMoyennes;
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieBulletin", ObjetRequeteSaisieBulletin);
function _ajouterService(aElement, aJSON) {
  aElement.ListeAppreciations.setSerialisateurJSON({
    methodeSerialisation: _ajouterPeriode,
  });
  aJSON.listeAppreciations = aElement.ListeAppreciations;
  if (!!aElement.ECTS) {
    aJSON.ECTS = aElement.ECTS;
  }
  if (aElement.moyenneDeliberee) {
    aJSON.moyenneDeliberee = aElement.moyenneDeliberee;
  }
  if (aElement.moyenneProposee) {
    aJSON.moyenneProposee = aElement.moyenneProposee;
  }
  if (aElement.avisReligionPropose) {
    aJSON.avisReligionPropose = aElement.avisReligionPropose;
  }
  if (aElement.avisReligionDelibere) {
    aJSON.avisReligionDelibere = aElement.avisReligionDelibere;
  }
  if (
    !!aElement.ElementsProgrammeBulletin &&
    aElement.ElementsProgrammeBulletin.avecSaisie
  ) {
    aJSON.listeElementsProgrammes = aElement.ElementsProgrammeBulletin;
  }
}
function _ajouterPeriode(aElement, aJSON) {
  if (aElement.periode) {
    aJSON.periode = aElement.periode;
  }
}
module.exports = ObjetRequeteSaisieBulletin;
