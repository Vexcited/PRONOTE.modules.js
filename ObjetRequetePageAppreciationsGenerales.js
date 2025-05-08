const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
class ObjetRequetePageAppreciationsGenerales extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		const lParam = {
			classe: new ObjetElement(),
			periode: new ObjetElement(),
			appreciation: new ObjetElement(),
			callbackWAI: null,
		};
		$.extend(lParam, aParam);
		this.estUneRubrique = lParam.appreciation.estUneRubrique;
		this.callbackWAI = lParam.callbackWAI;
		this.JSON = {
			classe: lParam.classe,
			periode: lParam.periode,
			appreciation: lParam.appreciation,
			estUneRubrique: lParam.appreciation.estUneRubrique,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
Requetes.inscrire(
	"PageAppreciationsGenerales",
	ObjetRequetePageAppreciationsGenerales,
);
module.exports = ObjetRequetePageAppreciationsGenerales;
