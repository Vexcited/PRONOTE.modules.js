const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetRequeteDernieresNotes extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    this.JSON.Periode = aParams.periode;
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    if (!!this.JSONReponse.listeDevoirs) {
      this.JSONReponse.listeDevoirs.setTri([
        ObjetTri.init("date", EGenreTriElement.Decroissant),
      ]);
      this.JSONReponse.listeDevoirs.trier();
      if (!!this.JSONReponse.listeServices) {
        const lListeServices = this.JSONReponse.listeServices;
        this.JSONReponse.listeDevoirs.parcourir((D) => {
          if (!!D.service) {
            D.service = lListeServices.getElementParNumero(
              D.service.getNumero(),
            );
          }
        });
      }
    }
    const lJSONResult = { listeDevoirs: this.JSONReponse.listeDevoirs };
    if (
      !!this.JSONReponse.moyGenerale &&
      !this.JSONReponse.moyGenerale.estVide() &&
      !!this.JSONReponse.moyGeneraleClasse &&
      !this.JSONReponse.moyGeneraleClasse.estVide()
    ) {
      lJSONResult.moyenneGenerale = {
        note: this.JSONReponse.moyGenerale,
        noteClasse: this.JSONReponse.moyGeneraleClasse,
        bareme: this.JSONReponse.baremeMoyGenerale,
        baremeParDefaut: this.JSONReponse.baremeMoyGeneraleParDefaut,
      };
    }
    lJSONResult.avecDetailDevoir = this.JSONReponse.avecDetailDevoir;
    lJSONResult.avecDetailService = this.JSONReponse.avecDetailService;
    this.callbackReussite.appel(lJSONResult);
  }
}
Requetes.inscrire("DernieresNotes", ObjetRequeteDernieresNotes);
module.exports = { ObjetRequeteDernieresNotes };
