exports.ObjetRequeteListeRegimesEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeRegimesEleve extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParametres) {
    $.extend(this.JSON, aParametres);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
exports.ObjetRequeteListeRegimesEleve = ObjetRequeteListeRegimesEleve;
CollectionRequetes_1.Requetes.inscrire(
  "ListeRegimesEleve",
  ObjetRequeteListeRegimesEleve,
);
