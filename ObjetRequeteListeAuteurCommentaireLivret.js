const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GCache } = require("Cache.js");
class ObjetRequeteListeAuteurCommentaireLivret extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
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
			GCache &&
			GCache.general.existeDonnee(
				"listeAuteurCommentaireLivret" + "_" + this.genreCommentaire,
			)
		) {
			this.callbackReussite.appel({
				listeAuteurs: GCache.general.getDonnee(
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
		if (GCache) {
			GCache.general.setDonnee(
				"listeAuteurCommentaireLivret" + "_" + this.genreCommentaire,
				this.JSONReponse.listeAuteurs,
			);
		}
		lObjet.listeAuteurs = this.JSONReponse.listeAuteurs;
		this.callbackReussite.appel(lObjet);
	}
}
Requetes.inscrire(
	"ListeAuteurCommentaireLivret",
	ObjetRequeteListeAuteurCommentaireLivret,
);
module.exports = { ObjetRequeteListeAuteurCommentaireLivret };
