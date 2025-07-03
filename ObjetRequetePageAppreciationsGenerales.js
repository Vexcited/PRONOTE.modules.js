exports.ObjetRequetePageAppreciationsGenerales = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageAppreciationsGenerales extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.JSON = {
			classe: aParam.classe,
			periode: aParam.periode,
			appreciation: aParam.appreciation,
			estUneRubrique: aParam.estUneRubrique,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequetePageAppreciationsGenerales =
	ObjetRequetePageAppreciationsGenerales;
CollectionRequetes_1.Requetes.inscrire(
	"PageAppreciationsGenerales",
	ObjetRequetePageAppreciationsGenerales,
);
