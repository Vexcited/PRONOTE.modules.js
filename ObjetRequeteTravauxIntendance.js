exports.ObjetRequeteTravauxIntendance = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
class ObjetRequeteTravauxIntendance extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		if (this.JSONReponse.listeLignes) {
			this.JSONReponse.listeLignes.parcourir((aDemande) => {
				if (!aDemande.listePJ) {
					aDemande.listePJ = new ObjetListeElements_1.ObjetListeElements();
				}
				if (!aDemande.listeExecutants) {
					aDemande.listeExecutants =
						new ObjetListeElements_1.ObjetListeElements();
				}
			});
		}
		if (this.JSONReponse.listeNatureTvx) {
			this.JSONReponse.listeNatureTvx.setTri([
				ObjetTri_1.ObjetTri.init(
					"Genre",
					Enumere_TriElement_1.EGenreTriElement.Croissant,
				),
				ObjetTri_1.ObjetTri.init(
					"Libelle",
					Enumere_TriElement_1.EGenreTriElement.Croissant,
				),
			]);
			this.JSONReponse.listeNatureTvx.trier();
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteTravauxIntendance = ObjetRequeteTravauxIntendance;
CollectionRequetes_1.Requetes.inscrire(
	"TravauxIntendance",
	ObjetRequeteTravauxIntendance,
);
