exports.ObjetRequeteSaisieElevesGAEV = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieElevesGAEV extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		this.JSON = $.extend(
			{
				domaine: null,
				cours: null,
				listeEleves: undefined,
				numeroSemaineSource: undefined,
			},
			aParametres,
		);
		return this.appelAsynchrone();
	}
	actionApresRequete(aGenreReponse) {
		if (this.JSONRapportSaisie && this.JSONRapportSaisie.erreur) {
			GApplication.getMessage().afficher({
				message: this.JSONRapportSaisie.erreur,
			});
		}
		this.callbackReussite.appel(this.JSONRapportSaisie);
	}
}
exports.ObjetRequeteSaisieElevesGAEV = ObjetRequeteSaisieElevesGAEV;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieElevesGAEV",
	ObjetRequeteSaisieElevesGAEV,
);
