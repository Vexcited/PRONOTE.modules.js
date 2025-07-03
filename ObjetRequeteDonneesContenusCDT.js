exports.ObjetRequeteDonneesContenusCDT = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteDonneesContenusCDT extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteDonneesContenusCDT = ObjetRequeteDonneesContenusCDT;
CollectionRequetes_1.Requetes.inscrire(
	"donneesContenusCDT",
	ObjetRequeteDonneesContenusCDT,
);
