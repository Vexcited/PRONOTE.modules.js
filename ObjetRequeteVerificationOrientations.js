exports.ObjetRequeteVerificationOrientations = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteVerificationOrientations extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteVerificationOrientations =
	ObjetRequeteVerificationOrientations;
CollectionRequetes_1.Requetes.inscrire(
	"VerificationOrientations",
	ObjetRequeteVerificationOrientations,
);
