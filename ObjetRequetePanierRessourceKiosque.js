exports.ObjetRequetePanierRessourceKiosque = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePanierRessourceKiosque extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequetePanierRessourceKiosque = ObjetRequetePanierRessourceKiosque;
CollectionRequetes_1.Requetes.inscrire(
	"listeRessourceKiosque",
	ObjetRequetePanierRessourceKiosque,
);
