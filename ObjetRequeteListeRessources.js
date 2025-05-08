exports.ObjetRequeteListeRessources = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeRessources extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParametres) {
    const lParametres = $.extend(
      { classe: undefined, periode: undefined },
      aParametres,
    );
    $.extend(this.JSON, lParametres);
    return this.appelAsynchrone();
  }
}
exports.ObjetRequeteListeRessources = ObjetRequeteListeRessources;
CollectionRequetes_1.Requetes.inscrire(
  "ListeRessources",
  ObjetRequeteListeRessources,
);
