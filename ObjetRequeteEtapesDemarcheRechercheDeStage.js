exports.ObjetEtapesDemarcheRequeteRechercheDeStage = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
class ObjetEtapesDemarcheRequeteRechercheDeStage extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetEtapesDemarcheRequeteRechercheDeStage =
	ObjetEtapesDemarcheRequeteRechercheDeStage;
CollectionRequetes_1.Requetes.inscrire(
	"ListeEtapesDemarcheRechercheDeStage",
	ObjetEtapesDemarcheRequeteRechercheDeStage,
);
