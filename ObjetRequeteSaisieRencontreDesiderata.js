exports.ObjetRequeteSaisieRencontreDesiderata = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieRencontreDesiderata extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		this.JSON = {
			session: aParams.session,
			listeRencontres: aParams.listeRencontres,
		};
		if (!!this.JSON.listeRencontres) {
			this.JSON.listeRencontres.setSerialisateurJSON({
				methodeSerialisation: _serialiserRencontre,
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieRencontreDesiderata =
	ObjetRequeteSaisieRencontreDesiderata;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRencontreDesiderata",
	ObjetRequeteSaisieRencontreDesiderata,
);
function _serialiserRencontre(aElement, aJSON) {
	aJSON.duree = aElement.duree;
	aJSON.voeu = aElement.voeu;
	aJSON.validationvoeu = aElement.validationvoeu;
}
