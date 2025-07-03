exports.ObjetRequeteSaisieSousServices = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieSousServices extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
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
}
exports.ObjetRequeteSaisieSousServices = ObjetRequeteSaisieSousServices;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieSousServices",
	ObjetRequeteSaisieSousServices,
);
function _serialiser_SousService(aElement, aJSON) {
	aJSON.sousMatiere = aElement.sousMatiere;
}
