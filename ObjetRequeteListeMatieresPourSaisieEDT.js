exports.ObjetRequeteListeMatieresPourSaisieEDT = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeMatieresPourSaisieEDT extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeMatieresPourSaisieEDT =
	ObjetRequeteListeMatieresPourSaisieEDT;
CollectionRequetes_1.Requetes.inscrire(
	"ListeMatieresPourSaisieEDT",
	ObjetRequeteListeMatieresPourSaisieEDT,
);
