exports.ObjetRequeteSaisieRencontreAEuLieu = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieRencontreAEuLieu extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieRencontreAEuLieu = ObjetRequeteSaisieRencontreAEuLieu;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRencontreAEuLieu",
	ObjetRequeteSaisieRencontreAEuLieu,
);
