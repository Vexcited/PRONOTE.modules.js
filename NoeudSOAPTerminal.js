exports.NoeudSOAPTerminal = void 0;
const NoeudSOAP_1 = require("NoeudSOAP");
const NoeudSOAPEmetteur_1 = require("NoeudSOAPEmetteur");
const NoeudSOAPRecepteur_1 = require("NoeudSOAPRecepteur");
class NoeudSOAPTerminal extends NoeudSOAP_1.NoeudSOAP {
  constructor(aUri, aAppelDistant, aCallback) {
    const lRoles = [];
    lRoles.push(NoeudSOAP_1.EGenreRoleSOAP.emetteur);
    lRoles.push(NoeudSOAP_1.EGenreRoleSOAP.recepteur);
    super(aUri, lRoles);
    this.emetteur = new NoeudSOAPEmetteur_1.NoeudSOAPEmetteur(
      aUri,
      aAppelDistant,
    );
    this.recepteur = new NoeudSOAPRecepteur_1.NoeudSOAPRecepteur(
      aUri,
      aAppelDistant,
      aCallback,
    );
  }
  traiterMessage(aDonnees) {
    const lMessageSOAPAEmettre = this.emetteur.traiterMessage(aDonnees);
    this.recepteur.setDescriptionAppel(aDonnees);
    return lMessageSOAPAEmettre;
  }
  methodeCallback(aMessageSOAPReponse) {
    this.recepteur.traiterMessage(aMessageSOAPReponse);
  }
}
exports.NoeudSOAPTerminal = NoeudSOAPTerminal;
