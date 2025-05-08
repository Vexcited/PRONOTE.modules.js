const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetRequetePageAbsencesEtRetards extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aDateDebut, aDateFin) {
    this.JSON = { dateDebut: aDateDebut, dateFin: aDateFin };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    let lListeAbsences = new ObjetListeElements();
    if (!!this.JSONReponse.ListeAbsencesEtRetards) {
      lListeAbsences = this.JSONReponse.ListeAbsencesEtRetards;
      lListeAbsences.setTri([
        ObjetTri.init("eleve.Libelle"),
        ObjetTri.init("DateDebut"),
      ]);
      lListeAbsences.trier();
    }
    this.callbackReussite.appel(lListeAbsences, this.JSONReponse.avecSaisieRA);
  }
}
Requetes.inscrire("PageAbsencesEtRetards", ObjetRequetePageAbsencesEtRetards);
module.exports = { ObjetRequetePageAbsencesEtRetards };
