exports.ObjetRequeteListeCompetencesQCM = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeCompetencesQCM extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeCompetencesQCM = ObjetRequeteListeCompetencesQCM;
CollectionRequetes_1.Requetes.inscrire(
	"ListeCompetencesQCM",
	ObjetRequeteListeCompetencesQCM,
);
