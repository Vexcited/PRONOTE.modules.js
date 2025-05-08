exports.ObjetRequeteRecapitulatifExportLSU = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteRecapitulatifExportLSU extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParametres) {
    $.extend(this.JSON, aParametres);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
exports.ObjetRequeteRecapitulatifExportLSU = ObjetRequeteRecapitulatifExportLSU;
CollectionRequetes_1.Requetes.inscrire(
  "RecapitulatifExportLSU",
  ObjetRequeteRecapitulatifExportLSU,
);
