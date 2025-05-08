exports.ObjetRequetePageInfosPerso = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageInfosPerso extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  actionApresRequete() {
    if (this.JSONReponse.messagerieSignature) {
      GApplication.getEtatUtilisateur().messagerieSignature =
        this.JSONReponse.messagerieSignature;
    }
    this.callbackReussite.appel(this.JSONReponse);
  }
}
exports.ObjetRequetePageInfosPerso = ObjetRequetePageInfosPerso;
CollectionRequetes_1.Requetes.inscrire(
  "PageInfosPerso",
  ObjetRequetePageInfosPerso,
);
