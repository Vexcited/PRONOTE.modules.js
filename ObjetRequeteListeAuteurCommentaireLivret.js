exports.ObjetRequeteListeAuteurCommentaireLivret = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Cache_1 = require("Cache");
class ObjetRequeteListeAuteurCommentaireLivret extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.genreCommentaire = aParam.genre;
		this.classe = aParam.classe;
		this.estParcoursDifferencie = aParam.estParcoursDifferencie;
		this.JSON = {
			genre: this.genreCommentaire,
			classe: this.classe,
			estParcoursDifferencie: this.estParcoursDifferencie,
		};
		if (
			Cache_1.GCache &&
			Cache_1.GCache.general.existeDonnee(
				"listeAuteurCommentaireLivret" + "_" + this.genreCommentaire,
			)
		) {
			this.callbackReussite.appel({
				listeAuteurs: Cache_1.GCache.general.getDonnee(
					"listeAuteurCommentaireLivret" + "_" + this.genreCommentaire,
				),
				genre: this.genreCommentaire,
			});
		} else {
			return this.appelAsynchrone();
		}
	}
	actionApresRequete() {
		const lObjet = { genre: this.genreCommentaire };
		if (Cache_1.GCache) {
			Cache_1.GCache.general.setDonnee(
				"listeAuteurCommentaireLivret" + "_" + this.genreCommentaire,
				this.JSONReponse.listeAuteurs,
			);
		}
		lObjet.listeAuteurs = this.JSONReponse.listeAuteurs;
		this.callbackReussite.appel(lObjet);
	}
}
exports.ObjetRequeteListeAuteurCommentaireLivret =
	ObjetRequeteListeAuteurCommentaireLivret;
CollectionRequetes_1.Requetes.inscrire(
	"ListeAuteurCommentaireLivret",
	ObjetRequeteListeAuteurCommentaireLivret,
);
