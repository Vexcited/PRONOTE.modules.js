exports.ObjetRequeteGenerationURLRecherchePartenaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteGenerationURLRecherchePartenaire extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteGenerationURLRecherchePartenaire =
	ObjetRequeteGenerationURLRecherchePartenaire;
CollectionRequetes_1.Requetes.inscrire(
	"GenerationURLRecherchePartenaire",
	ObjetRequeteGenerationURLRecherchePartenaire,
);
