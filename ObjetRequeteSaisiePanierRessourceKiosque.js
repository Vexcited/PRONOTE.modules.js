exports.ObjetRequeteSaisiePanierRessourceKiosque = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisiePanierRessourceKiosque extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisiePanierRessourceKiosque =
	ObjetRequeteSaisiePanierRessourceKiosque;
CollectionRequetes_1.Requetes.inscrire(
	"SaisiePanierRessourceKiosque",
	ObjetRequeteSaisiePanierRessourceKiosque,
);
