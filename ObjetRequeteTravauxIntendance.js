exports.ObjetRequeteTravauxIntendance = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteTravauxIntendance extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  actionApresRequete() {
    if (this.JSONReponse.listeLignes) {
      this.JSONReponse.listeLignes.parcourir((aDemande) => {
        if (!aDemande.listePJ) {
          aDemande.listePJ = new ObjetListeElements_1.ObjetListeElements();
        }
        if (!aDemande.listeExecutants) {
          aDemande.listeExecutants =
            new ObjetListeElements_1.ObjetListeElements();
        }
      });
    }
    this.callbackReussite.appel(this.JSONReponse);
  }
}
exports.ObjetRequeteTravauxIntendance = ObjetRequeteTravauxIntendance;
CollectionRequetes_1.Requetes.inscrire(
  "TravauxIntendance",
  ObjetRequeteTravauxIntendance,
);
