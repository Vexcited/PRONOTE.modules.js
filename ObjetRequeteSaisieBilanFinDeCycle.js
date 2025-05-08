exports.ObjetRequeteSaisieBilanFinDeCycle = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieBilanFinDeCycle extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		if ("eleves" in this.JSON && !!this.JSON.eleves) {
			this.JSON.eleves.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieBilanFinDeCycle = ObjetRequeteSaisieBilanFinDeCycle;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieBilanFinDeCycle",
	ObjetRequeteSaisieBilanFinDeCycle,
);
