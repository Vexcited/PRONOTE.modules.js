const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetRequeteDernieresEvaluations extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (!!this.JSONReponse.listeEvaluations) {
			this.JSONReponse.listeEvaluations.parcourir((D) => {
				if (!!D.listeNiveauxDAcquisitions) {
					D.listeNiveauxDAcquisitions.setTri([ObjetTri.init("ordre")]);
					D.listeNiveauxDAcquisitions.trier();
				}
			});
		}
		this.callbackReussite.appel(this.JSONReponse.listeEvaluations);
	}
}
Requetes.inscrire("DernieresEvaluations", ObjetRequeteDernieresEvaluations);
module.exports = { ObjetRequeteDernieresEvaluations };
