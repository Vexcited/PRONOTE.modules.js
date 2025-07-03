exports.ObjetRequeteSaisieAssistantSaisie = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetSerialiser_1 = require("ObjetSerialiser");
class ObjetRequeteSaisieAssistantSaisie extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		if (!!aParam.listeTypesAppreciations) {
			const lObjetSerialiser = new ObjetSerialiser_1.ObjetSerialiser();
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
}
exports.ObjetRequeteSaisieAssistantSaisie = ObjetRequeteSaisieAssistantSaisie;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAssistantSaisie",
	ObjetRequeteSaisieAssistantSaisie,
);
