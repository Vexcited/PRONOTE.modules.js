const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { GChaine } = require("ObjetChaine.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieCasier extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    const lParam = {
      genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.saisieCasier,
    };
    $.extend(lParam, aParam);
    this.JSON.genreSaisie = aParam.genreSaisie;
    this.JSON.modeReception = aParam.modeReception;
    this.JSON.typeConsultation = aParam.typeConsultation;
    if (lParam.listeLignes) {
      lParam.listeLignes.setSerialisateurJSON({
        methodeSerialisation: _serialisation.bind(this),
      });
      this.JSON.listeLignes = lParam.listeLignes;
    }
    if (
      aParam.genreSaisie ===
      ObjetRequeteSaisieCasier.genreSaisie.marquerLectureDocument
    ) {
      this.JSON.documentLu = aParam.documentLu;
    }
    if (
      aParam.genreSaisie === ObjetRequeteSaisieCasier.genreSaisie.marquerLus ||
      aParam.genreSaisie === ObjetRequeteSaisieCasier.genreSaisie.marquerNonLus
    ) {
      lParam.documents.setSerialisateurJSON({ ignorerEtatsElements: true });
      this.JSON.documents = aParam.documents;
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieCasier", ObjetRequeteSaisieCasier);
ObjetRequeteSaisieCasier.genreSaisie = {
  saisieCasier: 0,
  marquerLectureDocument: 1,
  marquerLus: 2,
  marquerNonLus: 3,
};
function _serialisation(aElement, aJSON) {
  aJSON.memo = aElement.memo;
  if (aElement.listePersonnels) {
    aJSON.listePersonnels = aElement.listePersonnels.toJSON();
  }
  if (aElement.listeProfesseurs) {
    aJSON.listeProfesseurs = aElement.listeProfesseurs.toJSON();
  }
  if (aElement.listeMaitreStage) {
    aJSON.listeMaitreStage = aElement.listeMaitreStage.toJSON();
  }
  if (aElement.listeResponsables) {
    aJSON.listeResponsables = aElement.listeResponsables.toJSON();
  }
  if (aElement.listeEquipesPedagogique) {
    aJSON.listeEquipesPedagogique = aElement.listeEquipesPedagogique.toJSON();
  }
  if (aElement.dateDebut) {
    aJSON.dateDebut = aElement.dateDebut;
  }
  if (aElement.dateFin) {
    aJSON.dateFin = aElement.dateFin;
  }
  aJSON.avecEnvoiGroupePersonnel = aElement.avecEnvoiGroupePersonnel;
  aJSON.avecEnvoiGroupeProfesseur = aElement.avecEnvoiGroupeProfesseur;
  aJSON.avecEnvoiGroupeMaitreDeStage = aElement.avecEnvoiGroupeMaitreDeStage;
  aJSON.avecEnvoiGroupeResponsable = aElement.avecEnvoiGroupeResponsable;
  if (aElement.documentCasier) {
    aJSON.documentCasier = aElement.documentCasier;
    aJSON.idFichier = GChaine.cardinalToStr(aElement.documentCasier.idFichier);
    if (aElement.documentCasier.url) {
      aJSON.url = aElement.documentCasier.url;
    }
  }
  if (aElement.categorie) {
    aJSON.categorie = aElement.categorie;
  }
  if ("avecEnvoiDirecteur" in aElement) {
    aJSON.avecEnvoiDirecteur = aElement.avecEnvoiDirecteur;
  }
  aJSON.estModifiableParDestinataires =
    !!aElement.estModifiableParDestinataires;
}
module.exports = { ObjetRequeteSaisieCasier };
