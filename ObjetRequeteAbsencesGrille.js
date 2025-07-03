exports.ObjetRequeteAbsencesGrille = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Cache_1 = require("Cache");
class ObjetRequeteAbsencesGrille extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		this.JSON = $.extend(
			{ genreSaisie: null, eleve: null, domaine: null, genreAbsence: null },
			aParams,
		);
		if (!Cache_1.GCache.listeMotifsAbsenceEleve) {
			this.JSON.avecListeMotifsAbsence = true;
		}
		if (!Cache_1.GCache.listeMotifsRetards) {
			this.JSON.avecListeMotifsRetard = true;
		}
		if (!Cache_1.GCache.listeMotifsExclusion) {
			this.JSON.avecListeMotifsExclusion = true;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.listeMotifsAbsenceEleve) {
			Cache_1.GCache.listeMotifsAbsenceEleve =
				this.JSONReponse.listeMotifsAbsenceEleve;
		}
		if (this.JSONReponse.listeMotifsRetards) {
			Cache_1.GCache.listeMotifsRetards = this.JSONReponse.listeMotifsRetards;
		}
		if (this.JSONReponse.listeMotifsExclusion) {
			Cache_1.GCache.listeMotifsExclusion =
				this.JSONReponse.listeMotifsExclusion;
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteAbsencesGrille = ObjetRequeteAbsencesGrille;
CollectionRequetes_1.Requetes.inscrire(
	"AbsencesGrille",
	ObjetRequeteAbsencesGrille,
);
