exports.GestionnaireEvenements = void 0;
const JournalLog = require("Enumere_EvenementsJournalLogs");
const Callback_1 = require("Callback");
const Enumere_CategorieEvenement_1 = require("Enumere_CategorieEvenement");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
class GestionnaireEvenements {
  constructor(aAvecJournal) {
    this.avecJournal = aAvecJournal;
    this.objetApplicationConsoles = GApplication;
    this.messagesEvenements =
      this.objetApplicationConsoles.msgEvnts.getMessagesUnite(
        "GestionnaireEvenements.js",
      );
    this.modeOptimise = this.objetApplicationConsoles.getModeOptimise();
  }
  traiter(aEvenement, aPrevenirUtilisateur = false) {
    if (this.avecJournal && !aEvenement.isNonJournalisable()) {
      this.enregistrerDansLeJournal(aEvenement, aPrevenirUtilisateur);
    }
    this.afficherMessageUtilisateur(aEvenement, aPrevenirUtilisateur);
  }
  afficherMessage(aMessage, aCallback) {
    try {
      if (aCallback instanceof Callback_1.Callback) {
        GApplication.getMessage().afficher({
          type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
          message: aMessage,
          callback: () => {
            aCallback.appel();
          },
        });
      } else {
        GApplication.getMessage().afficher({
          type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
          message: aMessage,
        });
      }
    } catch (e) {
      alert(aMessage);
    }
  }
  formatterMessage(aMessage, aFormatterMessage) {
    return aMessage;
  }
  afficherMessageUtilisateur(aEvenement, aPrevenirUtilisateur) {
    let lMessage;
    const lDetail = aEvenement.getDetail();
    const lAvecCallback =
      lDetail !== null &&
      lDetail !== undefined &&
      lDetail.callbackSurAffichageMessage !== null &&
      lDetail.callbackSurAffichageMessage !== undefined;
    const lCallback =
      lAvecCallback === true ? lDetail.callbackSurAffichageMessage : null;
    if (this.modeOptimise) {
      const lAfficherMessage =
        aPrevenirUtilisateur !== null && aPrevenirUtilisateur !== undefined
          ? aPrevenirUtilisateur
          : false;
      if (lAfficherMessage) {
        this.afficherMessage(
          this.formatterMessage(aEvenement.getMessage()),
          lCallback,
        );
      }
    } else {
      lMessage =
        aPrevenirUtilisateur !== null && aPrevenirUtilisateur !== undefined
          ? aEvenement.getMessage()
          : aEvenement.toString();
      this.afficherMessage(this.formatterMessage(lMessage), lCallback);
    }
  }
  enregistrerDansLeJournal(aEvenement, aPrevenirUtilisateur) {
    if (JournalLog) {
      const { ECategorieJournalLogs } = JournalLog;
      let lCategorieJournal;
      if (
        aEvenement.getCategorie() ===
          Enumere_CategorieEvenement_1.ECategorieEvenement.exception &&
        aPrevenirUtilisateur === true
      ) {
        lCategorieJournal = ECategorieJournalLogs.historique;
      } else {
        lCategorieJournal =
          aEvenement.getCategorie() ===
          Enumere_CategorieEvenement_1.ECategorieEvenement.trace
            ? aEvenement.getDetail() !== null &&
              aEvenement.getDetail().categorieJournal
              ? aEvenement.getDetail().categorieJournal
              : ECategorieJournalLogs.trace
            : ECategorieJournalLogs.trace;
      }
      const lMessageJournal =
        lCategorieJournal === ECategorieJournalLogs.historique
          ? aEvenement.getMessage()
          : aEvenement.toString();
      new JournalLog.ObjetEvenementJournal(
        lCategorieJournal,
        aEvenement.getStatut(),
        lMessageJournal,
      ).ajouter();
    }
  }
}
exports.GestionnaireEvenements = GestionnaireEvenements;
