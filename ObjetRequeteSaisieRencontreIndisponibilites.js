exports.ObjetRequeteSaisieRencontreIndisponibilites = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieRencontreIndisponibilites extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		const lParametres = { session: null, indisponibilites: null };
		$.extend(lParametres, aParam);
		this.JSON = {
			session: lParametres.session,
			indisponibilites: lParametres.indisponibilites,
		};
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieRencontreIndisponibilites =
	ObjetRequeteSaisieRencontreIndisponibilites;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRencontreIndisponibilites",
	ObjetRequeteSaisieRencontreIndisponibilites,
);
