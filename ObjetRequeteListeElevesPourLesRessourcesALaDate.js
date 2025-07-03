exports.ObjetRequeteListeElevesPourLesRessourcesALaDate = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeElevesPourLesRessourcesALaDate extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeElevesPourLesRessourcesALaDate =
	ObjetRequeteListeElevesPourLesRessourcesALaDate;
CollectionRequetes_1.Requetes.inscrire(
	"ListeElevesPourLesRessourcesALaDate",
	ObjetRequeteListeElevesPourLesRessourcesALaDate,
);
