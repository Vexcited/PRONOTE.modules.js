exports.ObjetRequeteSaisieFichierResultatsSondage = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieFichierResultatsSondage extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieFichierResultatsSondage =
	ObjetRequeteSaisieFichierResultatsSondage;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieFichierResultatsSondage",
	ObjetRequeteSaisieFichierResultatsSondage,
);
