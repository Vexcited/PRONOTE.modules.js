exports.ObjetRequeteAccesSecurisePageProfil = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteAccesSecurisePageProfil extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteAccesSecurisePageProfil =
	ObjetRequeteAccesSecurisePageProfil;
CollectionRequetes_1.Requetes.inscrire(
	"AccesSecurisePageProfil",
	ObjetRequeteAccesSecurisePageProfil,
);
