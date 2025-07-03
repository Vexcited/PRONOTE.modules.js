exports.ObjetRequeteCreationDevoirDNL = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteCreationDevoirDNL extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteCreationDevoirDNL = ObjetRequeteCreationDevoirDNL;
CollectionRequetes_1.Requetes.inscrire(
	"CreationDevoirDNL",
	ObjetRequeteCreationDevoirDNL,
);
