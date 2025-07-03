exports.ObjetRequeteListeElevesBIA = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteListeElevesBIA extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		return super.lancerRequete(aParams);
	}
}
exports.ObjetRequeteListeElevesBIA = ObjetRequeteListeElevesBIA;
CollectionRequetes_1.Requetes.inscrire(
	"ListeElevesBIA",
	ObjetRequeteListeElevesBIA,
);
