exports.ObjetRequeteGenererFichiersResultatsSondage = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteGenererFichiersResultatsSondage extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteGenererFichiersResultatsSondage =
	ObjetRequeteGenererFichiersResultatsSondage;
CollectionRequetes_1.Requetes.inscrire(
	"GenererFichiersResultatsSondage",
	ObjetRequeteGenererFichiersResultatsSondage,
);
