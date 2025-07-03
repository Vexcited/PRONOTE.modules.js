exports.ObjetRequetePageActualites = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
class ObjetRequetePageActualites extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		let lListeCategories = null;
		if (this.JSONReponse.listeCategories) {
			lListeCategories = this.JSONReponse.listeCategories;
			const lCategorie = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("actualites.ToutesCategories"),
				0,
			);
			lCategorie.toutesLesCategories = true;
			lListeCategories.addElement(lCategorie);
			lListeCategories.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return !D.toutesLesCategories;
				}),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeCategories.trier();
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequetePageActualites = ObjetRequetePageActualites;
CollectionRequetes_1.Requetes.inscrire(
	"PageActualites",
	ObjetRequetePageActualites,
);
