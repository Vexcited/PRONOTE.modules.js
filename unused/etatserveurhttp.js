exports.EtatServeurHttp = void 0;
const Enumere_CategorieEvenement_1 = require("Enumere_CategorieEvenement");
const Enumere_Statut_1 = require("Enumere_Statut");
const Evenement_1 = require("Evenement");
const WSPublicationServeurHttp_1 = require("WSPublicationServeurHttp");
class EtatServeurHttp {
  constructor() {
    this.publication = new WSPublicationServeurHttp_1.TInfosPublicationHttp();
    this.objetApplicationConsoles = GApplication;
    this.messagesEvenements =
      this.objetApplicationConsoles.msgEvnts.getMessagesUnite(
        "EtatServeurHttp.js",
      );
  }
  initialiserPublication(aDonnees) {
    let lMessage;
    try {
      this.publication = aDonnees.getElement("return").valeur;
    } catch (e) {
      lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
      this.objetApplicationConsoles.gestionEvnts.traiter(
        new Evenement_1.Evenement(
          Enumere_Statut_1.EStatut.erreur,
          Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
          this.messagesEvenements.getUnite(),
          "initialiserPublication",
          lMessage,
        ),
      );
    }
  }
  initialiserEtat(aDonnees) {
    let lMessage;
    try {
      this.etat = aDonnees.getElement("return").valeur;
    } catch (e) {
      lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
      this.objetApplicationConsoles.gestionEvnts.traiter(
        new Evenement_1.Evenement(
          Enumere_Statut_1.EStatut.erreur,
          Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
          this.messagesEvenements.getUnite(),
          "initialiserEtat",
          lMessage,
        ),
      );
    }
  }
  getAdressePublique() {
    return this.publication.getAdressePublique();
  }
  getAutoPublication() {
    return this.publication.getAutoPublication();
  }
  setHistoriqueAccessible(aAccessible) {
    this.publication.setHistoriqueAccessible(aAccessible);
  }
  setPublieEspace(aIdentifiant, aPublie) {
    const lEspace = this.getEspaceDIdentifiant(aIdentifiant);
    lEspace.setPublie(aPublie);
  }
  avecGestionENT() {
    return this.publication.getAvecGestionENT();
  }
  avecGestionDelegationParEspace() {
    return this.publication.getAvecGestionDelegationParEspace();
  }
  getListeEspaces() {
    return this.publication.getEspaces();
  }
  getNbrEspaces() {
    return this.publication.getEspaces().length;
  }
  getEspaceDIdentifiant(aIdentifiantEspace) {
    for (const lEspace of this.publication.getEspaces()) {
      if (lEspace.getIdentifiant() === aIdentifiantEspace) {
        return lEspace;
      }
    }
    return null;
  }
  getEspacesDeType(aTypeEspace) {
    const lResult = [];
    for (const lEspace of this.publication.getEspaces()) {
      if (lEspace.getTypeEspace() === aTypeEspace) {
        lResult.push(lEspace);
      }
    }
    return lResult;
  }
  getEtatActif() {
    return this.etat.getActif();
  }
  getNomBaseChargee() {
    return this.etat.getNomBaseChargee();
  }
  getModeExclusif() {
    return this.etat.getModeExclusif();
  }
  getConnecteAuServeur() {
    return this.etat.getConnecteAuServeur();
  }
}
exports.EtatServeurHttp = EtatServeurHttp;
