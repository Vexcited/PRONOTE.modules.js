exports.ObjetRequetePageBlogFilActus = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
class ObjetRequetePageBlogFilActus extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		this.moteur = new ObjetMoteurBlog_1.ObjetMoteurBlog();
	}
	lancerRequete() {
		this.JSON = {};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeCategories = this.moteur.deserialiserListeCategories(
			this.JSONReponse.listeCategories,
		);
		const lListeBlogs = this.JSONReponse.listeBlogs;
		if (lListeBlogs) {
			for (const lBlog of lListeBlogs) {
				if (lBlog) {
					if (!lBlog.listeModerateurs) {
						lBlog.listeModerateurs =
							new ObjetListeElements_1.ObjetListeElements();
					}
					if (!lBlog.listeRedacteurs) {
						lBlog.listeRedacteurs =
							new ObjetListeElements_1.ObjetListeElements();
					}
					if (!lBlog.listePublics) {
						lBlog.listePublics = new ObjetListeElements_1.ObjetListeElements();
					}
					if (lBlog.listeBillets) {
						for (const lBillet of lBlog.listeBillets) {
							lBillet.blog = lBlog;
							if (lListeCategories && lBillet.categorie) {
								lBillet.categorie = lListeCategories.getElementParNumero(
									lBillet.categorie.getNumero(),
								);
							}
							if (!lBillet.listeCoRedacteurs) {
								lBillet.listeCoRedacteurs =
									new ObjetListeElements_1.ObjetListeElements();
							}
							if (!lBillet.listeDocuments) {
								lBillet.listeDocuments =
									new ObjetListeElements_1.ObjetListeElements();
							}
							if (!lBillet.listeCommentaires) {
								lBillet.listeCommentaires =
									new ObjetListeElements_1.ObjetListeElements();
							}
							const lTriCommentaire = [
								ObjetTri_1.ObjetTri.init((D) => {
									return D.date;
								}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
							];
							lBillet.listeCommentaires.setTri(lTriCommentaire).trier();
						}
					}
				}
			}
		}
		this.callbackReussite.appel({
			message: this.JSONReponse.message,
			listeBlogs: lListeBlogs,
			listeCategories: lListeCategories,
			tailleMaxCommentaireBillet: this.JSONReponse.tailleMaxCommentaireBillet,
			avecDroitCreationBlog: this.JSONReponse.avecDroitCreationBlog,
		});
	}
}
exports.ObjetRequetePageBlogFilActus = ObjetRequetePageBlogFilActus;
CollectionRequetes_1.Requetes.inscrire(
	"PageBlogFilActus",
	ObjetRequetePageBlogFilActus,
);
