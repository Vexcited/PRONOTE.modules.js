exports.ObjetRequeteNiveauxDeMaitriseParMatiere = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteNiveauxDeMaitriseParMatiere extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.JSON = {
			classe: aParam.classe,
			periode: aParam.periode,
			eleve: aParam.eleve,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteNiveauxDeMaitriseParMatiere =
	ObjetRequeteNiveauxDeMaitriseParMatiere;
CollectionRequetes_1.Requetes.inscrire(
	"NiveauxDeMaitriseParMatiere",
	ObjetRequeteNiveauxDeMaitriseParMatiere,
);
