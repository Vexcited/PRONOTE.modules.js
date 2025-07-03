exports.ObjetRequetePageRemplacements = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Onglet_1 = require("Enumere_Onglet");
class ObjetRequetePageRemplacements extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aGenreOnglet, aNumeroSemaine, aDomaine) {
		this.JSON = {};
		if (aGenreOnglet === Enumere_Onglet_1.EGenreOnglet.Remplacements_Grille) {
			this.JSON.numeroSemaine = aNumeroSemaine;
		} else {
			this.JSON.domaine = aDomaine;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lDureeNonAssuree = this.JSONReponse.dureeNonAssuree;
		const lDureeRemplacee = this.JSONReponse.dureeRemplacee;
		let lListeCours = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeCours) {
			lListeCours = this.JSONReponse.listeCours;
			lListeCours
				.setTri([
					ObjetTri_1.ObjetTri.init("Matiere.Libelle"),
					ObjetTri_1.ObjetTri.init("Date"),
				])
				.trier();
		}
		this.callbackReussite.appel(lDureeNonAssuree, lDureeRemplacee, lListeCours);
	}
}
exports.ObjetRequetePageRemplacements = ObjetRequetePageRemplacements;
CollectionRequetes_1.Requetes.inscrire(
	"PageRemplacements",
	ObjetRequetePageRemplacements,
);
