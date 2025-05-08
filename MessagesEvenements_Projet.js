exports.MessagesEvenements_Projet = void 0;
const MessagesUnite_1 = require("MessagesUnite");
const ObjetTraduction_1 = require("ObjetTraduction");
class MessagesEvenements_Projet {
  constructor() {
    this.tabMessagesUnite = {};
    this.construireGestionnaireEvenement();
  }
  ajouterMessagesUnite(aUnite) {
    if (
      !(this.tabMessagesUnite[aUnite] instanceof MessagesUnite_1.MessagesUnite)
    ) {
      this.tabMessagesUnite[aUnite] = new MessagesUnite_1.MessagesUnite(aUnite);
    }
    return this.tabMessagesUnite[aUnite];
  }
  getMessagesUnite(aUnite) {
    if (
      !(this.tabMessagesUnite[aUnite] instanceof MessagesUnite_1.MessagesUnite)
    ) {
      return this.ajouterMessagesUnite(aUnite);
    } else {
      return this.tabMessagesUnite[aUnite];
    }
  }
  construireGestionnaireEvenement() {
    const lNoeud = this.ajouterMessagesUnite("GestionnaireEvenements.js");
    lNoeud.messageUtilisateurErreurSOAP =
      ObjetTraduction_1.GTraductions.getValeur("principal.msgErreurSOAP");
  }
}
exports.MessagesEvenements_Projet = MessagesEvenements_Projet;
