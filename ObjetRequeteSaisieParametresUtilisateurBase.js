exports.ObjetRequeteSaisieParametresUtilisateurBase = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieParametresUtilisateurBase extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieParametresUtilisateurBase =
	ObjetRequeteSaisieParametresUtilisateurBase;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieParametresUtilisateurBase",
	ObjetRequeteSaisieParametresUtilisateurBase,
);
