const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieSousServices extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON = {
			confirmation: aParam.confirmation,
			service: aParam.service.toJSON(),
			periode: aParam.periode,
		};
		if (!!this.JSON.service) {
			this.JSON.service.facultatif = aParam.service.facultatif;
			this.JSON.service.coefficient = aParam.service.coefficient;
		}
		if (!!aParam.listeSousServices) {
			aParam.listeSousServices.setSerialisateurJSON({
				methodeSerialisation: _serialiser_SousService.bind(this),
			});
			this.JSON.listeSousServices = aParam.listeSousServices;
		}
		if (!!aParam.listeSousMatieres) {
			this.JSON.listeSousMatieres = aParam.listeSousMatieres;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie, this.JSONReponse);
	}
}
Requetes.inscrire("SaisieSousServices", ObjetRequeteSaisieSousServices);
function _serialiser_SousService(aElement, aJSON) {
	aJSON.sousMatiere = aElement.sousMatiere;
}
module.exports = ObjetRequeteSaisieSousServices;
