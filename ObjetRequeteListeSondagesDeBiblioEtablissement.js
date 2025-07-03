exports.ObjetRequeteListeSondagesDeBiblioEtablissement = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeSondagesDeBiblioEtablissement extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeSondagesDeBiblioEtablissement =
	ObjetRequeteListeSondagesDeBiblioEtablissement;
CollectionRequetes_1.Requetes.inscrire(
	"ListeSondagesDeBiblioEtablissement",
	ObjetRequeteListeSondagesDeBiblioEtablissement,
);
