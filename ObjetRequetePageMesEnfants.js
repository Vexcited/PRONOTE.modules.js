const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { GChaine } = require("ObjetChaine.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequetePageMesEnfants extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete() {
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    if (!!this.JSONReponse.informationsCompte) {
      const LAvecMotDePasseEnClair =
        !!this.JSONReponse.informationsCompte.MotDePasse;
      this.JSONReponse.informationsCompte.MotDePasse = LAvecMotDePasseEnClair
        ? GChaine.ajouterEntites(
            GApplication.getCommunication().getChaineDechiffreeAES(
              this.JSONReponse.informationsCompte.MotDePasse,
            ),
          )
        : "*****";
      this.JSONReponse.informationsCompte.Identifiant = GChaine.ajouterEntites(
        GApplication.getCommunication().getChaineDechiffreeAES(
          this.JSONReponse.informationsCompte.Identifiant,
        ),
      );
      this.JSONReponse.informationsCompte.MotDePasseEnClair =
        LAvecMotDePasseEnClair;
    }
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire("PageMesEnfants", ObjetRequetePageMesEnfants);
module.exports = { ObjetRequetePageMesEnfants };
