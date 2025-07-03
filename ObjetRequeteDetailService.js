exports.ObjetRequeteDetailService = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteDetailService extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteDetailService = ObjetRequeteDetailService;
CollectionRequetes_1.Requetes.inscrire(
	"DetailService",
	ObjetRequeteDetailService,
);
