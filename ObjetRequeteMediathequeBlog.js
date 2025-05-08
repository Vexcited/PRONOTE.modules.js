exports.ObjetRequeteMediathequeBlog = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteMediathequeBlog extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  actionApresRequete() {
    const lListeMediatheques = this.JSONReponse.listeMediatheques;
    if (lListeMediatheques) {
      for (const lMediatheque of lListeMediatheques) {
        if (!lMediatheque.listeDocuments) {
          lMediatheque.listeDocuments =
            new ObjetListeElements_1.ObjetListeElements();
        }
        for (const lDoc of lMediatheque.listeDocuments) {
          if (lMediatheque.listeDossiers) {
            if (!!lDoc.dossierMediatheque) {
              const lDossierDeLaMediatheque =
                lMediatheque.listeDossiers.getElementParNumero(
                  lDoc.dossierMediatheque.getNumero(),
                );
              if (!!lDossierDeLaMediatheque) {
                lDoc.dossierMediatheque = lDossierDeLaMediatheque;
              }
            }
          }
        }
        if (lMediatheque.listeDossiers) {
          for (const lDossier of lMediatheque.listeDossiers) {
            lDossier.mediatheque = lMediatheque;
          }
        }
      }
    }
    this.callbackReussite.appel({ listeMediatheques: lListeMediatheques });
  }
}
exports.ObjetRequeteMediathequeBlog = ObjetRequeteMediathequeBlog;
CollectionRequetes_1.Requetes.inscrire(
  "PageBlogMediatheque",
  ObjetRequeteMediathequeBlog,
);
