exports.ObjetRequeteSaisieAppelInternat = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieAppelInternat extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		this.JSON = {
			creneau: aParams.creneau.toJSONAll(),
			date: aParams.date,
			ressource: aParams.ressource.toJSONAll(),
		};
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieAppelInternat = ObjetRequeteSaisieAppelInternat;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAppelInternat",
	ObjetRequeteSaisieAppelInternat,
);
