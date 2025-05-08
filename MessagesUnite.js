exports.MessagesUnite = void 0;
class MessagesUnite {
  constructor(aUnite) {
    this.messageUtilisateurErreurSOAP = "";
    this.plusieursBasesCourantes = "";
    this.autreQueUneSeuleBaseCourante = "";
    this.nouvelleBase_repertoireNonVide = "";
    this.nouvelleBase_serveurEnService = "";
    this.serveurEnService = "";
    this.unite = aUnite || "";
  }
  getUnite() {
    return this.unite;
  }
  getMessageEchecBlocTry(aException) {
    return "[Echec bloc Try] " + aException.name + " - " + aException.message;
  }
  getMessageEchecSurInitialiser(aException) {
    return (
      "[Echec sur le initialiser]" +
      aException.name +
      " - " +
      aException.message
    );
  }
  getMessageCasNonGere(aDetail) {
    const lDetail = aDetail || "";
    return "[Cas non géré] " + lDetail;
  }
  getMessageNoeudNonValide(aNoeud) {
    return "[Noeud invalide] On doit récuperer un " + aNoeud + ".";
  }
  getMessageTypeNonValide(aType) {
    return "[Type invalide] On doit récuperer un " + aType + ".";
  }
}
exports.MessagesUnite = MessagesUnite;
