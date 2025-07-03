exports.ObjetRequetePageAbsencesEtRetards = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
class ObjetRequetePageAbsencesEtRetards extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aDateDebut, aDateFin) {
		this.JSON = { dateDebut: aDateDebut, dateFin: aDateFin };
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.JSONReponse.ListeAbsencesEtRetards =
			this.JSONReponse.ListeAbsencesEtRetards ||
			new ObjetListeElements_1.ObjetListeElements();
		this.JSONReponse.ListeAbsencesEtRetards.setTri([
			ObjetTri_1.ObjetTri.init("eleve.Libelle"),
			ObjetTri_1.ObjetTri.init("DateDebut"),
		]);
		this.JSONReponse.ListeAbsencesEtRetards.trier();
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequetePageAbsencesEtRetards = ObjetRequetePageAbsencesEtRetards;
CollectionRequetes_1.Requetes.inscrire(
	"PageAbsencesEtRetards",
	ObjetRequetePageAbsencesEtRetards,
);
