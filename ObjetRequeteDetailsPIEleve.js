exports.ObjetRequeteDetailsPIEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteDetailsPIEleve extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		this.JSON.eleve = aParams.eleve;
		this.JSON.matiere = aParams.matiere;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteDetailsPIEleve = ObjetRequeteDetailsPIEleve;
CollectionRequetes_1.Requetes.inscrire(
	"DetailsPIEleve",
	ObjetRequeteDetailsPIEleve,
);
