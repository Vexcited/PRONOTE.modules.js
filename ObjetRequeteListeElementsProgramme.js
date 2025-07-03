exports.ObjetRequeteListeElementsProgramme = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeElementsProgramme extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeElementsProgramme = ObjetRequeteListeElementsProgramme;
CollectionRequetes_1.Requetes.inscrire(
	"ListeElementsProgramme",
	ObjetRequeteListeElementsProgramme,
);
