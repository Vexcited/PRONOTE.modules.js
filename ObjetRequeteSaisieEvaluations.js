const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
class ObjetRequeteSaisieEvaluations extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(
    aService,
    aRessource,
    aListeEvaluations,
    aListeSujetsEtCorriges,
  ) {
    this.JSON = { service: aService, ressource: aRessource };
    if (!!aListeEvaluations) {
      aListeEvaluations.setTri([
        ObjetTri.init("dupliquerDepuis", EGenreTriElement.Croissant),
      ]);
      aListeEvaluations.trier();
      aListeEvaluations.setSerialisateurJSON({
        ignorerEtatsElements: true,
        methodeSerialisation: _serialiseEvaluation.bind(
          this,
          aService,
          aRessource,
        ),
        nePasTrierPourValidation: true,
      });
      this.JSON.listeEvaluations = aListeEvaluations;
    }
    if (!!aListeSujetsEtCorriges) {
      aListeSujetsEtCorriges.setSerialisateurJSON({
        methodeSerialisation: _serialisationListeCorriges,
      });
      this.JSON.listeFichiers = aListeSujetsEtCorriges;
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONRapportSaisie);
  }
}
Requetes.inscrire("SaisieEvaluations", ObjetRequeteSaisieEvaluations);
function _serialiseEvaluation(aService, aRessource, aEvaluation, AJSON) {
  if (GEtatUtilisateur.pourPrimaire()) {
    AJSON.Service = !!aEvaluation.service ? aEvaluation.service : aService;
  } else {
    AJSON.Service = !!aService ? aService : aEvaluation.service;
  }
  AJSON.Ressource = !!aRessource ? aRessource : aEvaluation.classe;
  AJSON.Periode = aEvaluation.periode;
  AJSON.periodeSecondaire = aEvaluation.periodeSecondaire;
  if (aEvaluation.ListeThemes) {
    AJSON.ListeThemes = aEvaluation.ListeThemes.setSerialisateurJSON({
      ignorerEtatsElements: true,
    });
  }
  if (!!aEvaluation.dupliquerDepuis) {
    const lEvaluationModele = new ObjetElement(
      "",
      aEvaluation.dupliquerDepuis.getNumero(),
      aEvaluation.dupliquerDepuis.getGenre(),
    );
    AJSON.dupliquerDepuis = lEvaluationModele;
  }
  AJSON.DateValidation = aEvaluation.dateValidation;
  AJSON.DatePublication = aEvaluation.datePublication;
  AJSON.Descriptif = aEvaluation.descriptif;
  AJSON.coefficient = aEvaluation.coefficient;
  AJSON.priseEnCompteDansBilan = aEvaluation.priseEnCompteDansBilan;
  AJSON.ServiceLVE = aEvaluation.serviceLVE;
  if (!!aEvaluation.devoir && aEvaluation.devoir.pourValidation()) {
    AJSON.devoir = aEvaluation.devoir.toJSON();
    AJSON.devoir.modeAssociation = aEvaluation.devoir.modeAssociation;
    AJSON.devoir.serviceDevoir = aEvaluation.devoir.serviceDevoir;
    AJSON.devoir.bareme = aEvaluation.devoir.bareme;
    AJSON.devoir.coefficient = aEvaluation.devoir.coefficient;
    AJSON.devoir.commeUnBonus = aEvaluation.devoir.commeUnBonus;
    AJSON.devoir.commeUneNote = aEvaluation.devoir.commeUneNote;
    AJSON.devoir.ramenerSur20 = aEvaluation.devoir.ramenerSur20;
  }
  let lValeurCreationCompetence = false;
  if (!!aEvaluation.listeCompetences) {
    aEvaluation.listeCompetences.parcourir((D) => {
      if (D.pourValidation()) {
        lValeurCreationCompetence = true;
        return false;
      }
    });
    if (lValeurCreationCompetence) {
      aEvaluation.listeCompetences.setSerialisateurJSON({
        methodeSerialisation: _serialiseCompetenceDEvaluation,
      });
      AJSON.listeCompetences = aEvaluation.listeCompetences;
    }
  }
  let lValeurCreationEleve = false;
  if (aEvaluation.existe() && !!aEvaluation.listeEleves) {
    aEvaluation.listeEleves.parcourir((D) => {
      if (D.pourValidation()) {
        lValeurCreationEleve = true;
        return false;
      }
    });
    if (lValeurCreationEleve) {
      aEvaluation.listeEleves.setSerialisateurJSON({
        methodeSerialisation: _serialiseEleve,
      });
      AJSON.listeEleves = aEvaluation.listeEleves;
    }
  }
  if (!!aEvaluation.listeSujets) {
    AJSON.listeSujets = aEvaluation.listeSujets;
  }
  if (!!aEvaluation.listeCorriges) {
    AJSON.listeCorriges = aEvaluation.listeCorriges;
  }
  return (
    lValeurCreationCompetence ||
    lValeurCreationEleve ||
    aEvaluation.pourValidation()
  );
}
function _serialisationListeCorriges(aElement, aJSON) {
  const lIdFichier =
    aElement.idFichier !== undefined
      ? aElement.idFichier
      : aElement.Fichier !== undefined
        ? aElement.Fichier.idFichier
        : null;
  if (lIdFichier !== null) {
    aJSON.idFichier = "" + lIdFichier;
  }
  if (aElement.url) {
    aJSON.url = aElement.url;
  }
}
function _serialiseCompetenceDEvaluation(aCompetence, aJSON) {
  aJSON.coefficient = aCompetence.coefficient;
  aJSON.relationESI = aCompetence.relationESI;
  aJSON.niveauAcquiDefaut = aCompetence.niveauAcquiDefaut;
  aJSON.ordre = aCompetence.Position;
  aJSON.palier = aCompetence.palier.toJSON();
}
function _serialiseEleve(aEleve, AJSON) {
  if (!!aEleve.listeCompetences) {
    aEleve.listeCompetences.setSerialisateurJSON({
      methodeSerialisation: _serialiseCompetenceDEleve,
    });
    AJSON.listeCompetences = aEleve.listeCompetences;
  }
  if ("commentaire" in aEleve) {
    AJSON.commentaire = aEleve.commentaire;
  }
  AJSON.note = aEleve.note;
}
function _serialiseCompetenceDEleve(aCompetence, aJSON) {
  aJSON.relationESI = aCompetence.relationESI;
  aJSON.niveauDAcquisition = aCompetence.niveauDAcquisition;
  if (
    !!aCompetence.niveauDAcquisition &&
    aCompetence.niveauDAcquisition.existeNumero() &&
    MethodesObjet.isString(aCompetence.observation)
  ) {
    aJSON.observation = aCompetence.observation;
    aJSON.observationPubliee = !!aCompetence.observationPubliee;
  }
}
module.exports = { ObjetRequeteSaisieEvaluations };
