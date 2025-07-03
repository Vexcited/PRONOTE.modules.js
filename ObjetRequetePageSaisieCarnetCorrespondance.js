exports.ObjetRequetePageSaisieCarnetCorrespondance = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageSaisieCarnetCorrespondance extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aEleve) {
		this.JSON = { Eleve: aEleve };
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeObservations = this.JSONReponse.ListeObservations;
		lListeObservations.trier();
		const lListeEncouragements = this.JSONReponse.ListeEncouragements;
		lListeEncouragements.trier();
		const lListeAutresEvenements = this.JSONReponse.listeAutresEvenements;
		this.callbackReussite.appel({
			listeObservations: lListeObservations,
			listeEncouragements: lListeEncouragements,
			listeAutresEvenements: lListeAutresEvenements,
			estPubliable: this.JSONReponse.estPubliable,
		});
	}
}
exports.ObjetRequetePageSaisieCarnetCorrespondance =
	ObjetRequetePageSaisieCarnetCorrespondance;
CollectionRequetes_1.Requetes.inscrire(
	"PageSaisieCarnetCorrespondance",
	ObjetRequetePageSaisieCarnetCorrespondance,
);
