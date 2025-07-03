exports.ObjetRequeteTelechargerCopiesEleves = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteTelechargerCopiesEleves extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteTelechargerCopiesEleves =
	ObjetRequeteTelechargerCopiesEleves;
CollectionRequetes_1.Requetes.inscrire(
	"TelechargerCopiesEleves",
	ObjetRequeteTelechargerCopiesEleves,
);
