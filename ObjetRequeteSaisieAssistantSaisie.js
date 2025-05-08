const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetSerialiser } = require("ObjetSerialiser.js");
class ObjetRequeteSaisieAssistantSaisie extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		if (!!aParam.listeTypesAppreciations) {
			const lObjetSerialiser = new ObjetSerialiser();
			aParam.listeTypesAppreciations.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation:
					lObjetSerialiser.serialiseTypeAppreciationAssistSaisie.bind(
						lObjetSerialiser,
					),
			});
			this.JSON.listeTypeAppreciations = aParam.listeTypesAppreciations;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie);
	}
}
Requetes.inscrire("SaisieAssistantSaisie", ObjetRequeteSaisieAssistantSaisie);
module.exports = { ObjetRequeteSaisieAssistantSaisie };
