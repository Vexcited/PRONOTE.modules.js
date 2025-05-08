exports.ObjetRequeteRecapDevoirRendu = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteRecapDevoirRendu extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		this.JSON = {
			domaine: aParametres.domaine,
			eleve: aParametres.eleve,
			optionsAffichage: aParametres.optionsAffichage,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteRecapDevoirRendu = ObjetRequeteRecapDevoirRendu;
CollectionRequetes_1.Requetes.inscrire(
	"RecapDevoirRendu",
	ObjetRequeteRecapDevoirRendu,
);
