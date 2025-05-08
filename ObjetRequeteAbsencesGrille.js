const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GCache } = require("Cache.js");
class ObjetRequeteAbsencesGrille extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    this.JSON = $.extend(
      { genreSaisie: null, eleve: null, domaine: null, genreAbsence: null },
      aParams,
    );
    if (!GCache.listeMotifsAbsenceEleve) {
      this.JSON.avecListeMotifsAbsence = true;
    }
    if (!GCache.listeMotifsRetards) {
      this.JSON.avecListeMotifsRetard = true;
    }
    if (!GCache.listeMotifsExclusion) {
      this.JSON.avecListeMotifsExclusion = true;
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    if (this.JSONReponse.listeMotifsAbsenceEleve) {
      GCache.listeMotifsAbsenceEleve = this.JSONReponse.listeMotifsAbsenceEleve;
    }
    if (this.JSONReponse.listeMotifsRetards) {
      GCache.listeMotifsRetards = this.JSONReponse.listeMotifsRetards;
    }
    if (this.JSONReponse.listeMotifsExclusion) {
      GCache.listeMotifsExclusion = this.JSONReponse.listeMotifsExclusion;
    }
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire("AbsencesGrille", ObjetRequeteAbsencesGrille);
module.exports = { ObjetRequeteAbsencesGrille };
