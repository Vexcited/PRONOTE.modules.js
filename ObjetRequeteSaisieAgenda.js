const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { GChaine } = require("ObjetChaine.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
class ObjetRequeteSaisieAgenda extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParametres) {
    const lParam = { listeEvenements: null, listePiecesJointes: null };
    $.extend(lParam, aParametres);
    aParametres.listeEvenements.setSerialisateurJSON({
      methodeSerialisation: _serialiser_Evenement.bind(this),
    });
    this.JSON.listeEvenements = aParametres.listeEvenements;
    if (aParametres.listePiecesJointes) {
      aParametres.listePiecesJointes.setSerialisateurJSON({
        methodeSerialisation: _serialiser_Document.bind(this),
      });
      this.JSON.listePiecesJointes = aParametres.listePiecesJointes;
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONRapportSaisie);
    if (this.JSONRapportSaisie.messageCorps) {
      GApplication.getMessage().afficher({
        type: EGenreBoiteMessage.Information,
        message:
          (this.JSONRapportSaisie.messageTitre
            ? '<div class="Gras EspaceBas">' +
              this.JSONRapportSaisie.messageTitre +
              "</div>"
            : "") +
          "<div>" +
          this.JSONRapportSaisie.messageCorps +
          "</div>",
      });
    }
  }
}
Requetes.inscrire("SaisieAgenda", ObjetRequeteSaisieAgenda);
function _serialiser_Evenement(aEvenement, aJSON) {
  aJSON.commentaire = aEvenement.Commentaire;
  aJSON.dateDebut = aEvenement.DateDebut;
  aJSON.dateFin = aEvenement.DateFin;
  aJSON.publie = aEvenement.publie;
  if (aEvenement.sansHoraire) {
    aJSON.sansHoraire = true;
  }
  aJSON.estPeriodique = aEvenement.estPeriodique;
  if (aEvenement.estPeriodique) {
    _serialiser_Periodicite.bind(this)(aEvenement, aJSON);
  }
  aJSON.famille = aEvenement.famille;
  aJSON.avecElevesRattaches = aEvenement.avecElevesRattaches;
  aJSON.genresPublicEntite = aEvenement.genresPublicEntite;
  aJSON.avecDirecteur = aEvenement.avecDirecteur;
  aJSON.publicationPageEtablissement = aEvenement.publicationPageEtablissement;
  if (!!aEvenement.listePublicEntite) {
    aEvenement.listePublicEntite.setSerialisateurJSON({
      methodeSerialisation: null,
      ignorerEtatsElements: true,
    });
    aJSON.listePublicEntite = aEvenement.listePublicEntite;
  }
  if (!!aEvenement.listePublicIndividu) {
    aEvenement.listePublicIndividu.setSerialisateurJSON({
      methodeSerialisation: null,
      ignorerEtatsElements: true,
    });
    aJSON.listePublicIndividu = aEvenement.listePublicIndividu;
  }
  if (!!aEvenement.listeDocJoints) {
    aEvenement.listeDocJoints.setSerialisateurJSON({
      methodeSerialisation: _serialiser_Document.bind(this),
      ignorerEtatsElements: false,
    });
    aJSON.listeDocumentsJoints = aEvenement.listeDocJoints;
  }
}
function _serialiser_Document(aDocument, aJSON) {
  const lIdFichier =
    aDocument.idFichier !== undefined
      ? aDocument.idFichier
      : aDocument.Fichier !== undefined
        ? aDocument.Fichier.idFichier
        : null;
  if (lIdFichier !== null) {
    aJSON.idFichier = GChaine.cardinalToStr(lIdFichier);
  }
  aJSON.nomFichier = aDocument.nomFichier;
  aJSON.url = aDocument.url;
}
function _serialiser_Periodicite(aEvenement, aJSON) {
  aJSON.DateDebutP = aEvenement.periodicite.DateDebut;
  aJSON.DateFinP = aEvenement.periodicite.DateFin;
  aJSON.heureDebut = aEvenement.periodicite.heureDebut;
  aJSON.heureFin = aEvenement.periodicite.heureFin;
  aJSON.sansHoraireP = aEvenement.periodicite.sansHoraire;
  aJSON.avecJourOuvres = aEvenement.periodicite.avecJourOuvres;
  aJSON.estEvtPerso = aEvenement.periodicite.estEvtPerso;
  aJSON.indexJour = aEvenement.periodicite.indexJour;
  aJSON.jourDansSemaine = aEvenement.periodicite.jourDansSemaine;
  aJSON.intervalle = aEvenement.periodicite.intervalle;
  aJSON.jourDuMois = aEvenement.periodicite.jourDuMois;
  aJSON.joursDeLaSemaine = aEvenement.periodicite.joursDeLaSemaine;
  aJSON.type = aEvenement.periodicite.type;
  aJSON.DateEvenement = aEvenement.periodicite.DateEvenement;
}
module.exports = { ObjetRequeteSaisieAgenda };
