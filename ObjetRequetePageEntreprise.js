const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
class ObjetRequetePageEntreprise extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete() {
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    if (this.JSONReponse.entreprise && this.JSONReponse.entreprise.civilites) {
      this.JSONReponse.entreprise.civilites.trier();
      this.JSONReponse.entreprise.civilites.insererElement(
        new ObjetElement(" ", 0, 0, 0, true),
        0,
      );
    }
    this.callbackReussite.appel(
      this.JSONReponse.entreprise,
      this.JSONReponse.autorisations,
    );
  }
}
Requetes.inscrire("InfosEntreprise", ObjetRequetePageEntreprise);
module.exports = ObjetRequetePageEntreprise;
