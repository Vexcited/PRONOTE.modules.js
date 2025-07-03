exports.ObjetRequeteListeTravauxRendus = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeTravauxRendus extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeTravauxRendus = ObjetRequeteListeTravauxRendus;
CollectionRequetes_1.Requetes.inscrire(
	"ListeTravauxRendus",
	ObjetRequeteListeTravauxRendus,
);
