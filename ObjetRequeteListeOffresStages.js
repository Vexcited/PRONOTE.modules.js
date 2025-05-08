exports.ObjetRequeteListeOffresStages = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteListeOffresStages extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete() {
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    let lListeEntreprises = new ObjetListeElements_1.ObjetListeElements();
    if (this.JSONReponse.listeEntreprises) {
      lListeEntreprises = this.JSONReponse.listeEntreprises;
    }
    this.callbackReussite.appel({ listeEntreprises: lListeEntreprises });
  }
}
exports.ObjetRequeteListeOffresStages = ObjetRequeteListeOffresStages;
CollectionRequetes_1.Requetes.inscrire(
  "ListeOffresStages",
  ObjetRequeteListeOffresStages,
);
