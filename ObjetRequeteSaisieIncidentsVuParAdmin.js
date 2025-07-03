exports.ObjetRequeteSaisieIncidentsVuParAdmin = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieIncidentsVuParAdmin extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		if (aParam.incidents) {
			aParam.incidents.setSerialisateurJSON({
				methodeSerialisation: function (aElt, aJSON) {
					aJSON.estVise = aElt.estVise;
				},
			});
			this.JSON.incidents = aParam.incidents;
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieIncidentsVuParAdmin =
	ObjetRequeteSaisieIncidentsVuParAdmin;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieIncidentsVuParAdmin",
	ObjetRequeteSaisieIncidentsVuParAdmin,
);
