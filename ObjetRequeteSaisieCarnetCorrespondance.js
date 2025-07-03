exports.ObjetRequeteSaisieCarnetCorrespondance = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieCarnetCorrespondance extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aEleve, aListeObservations) {
		this.JSON = { eleve: aEleve };
		if (!!aListeObservations) {
			this.JSON.listeObservations = aListeObservations;
			this.JSON.listeObservations.setSerialisateurJSON({
				methodeSerialisation: function (aObs, aJSON) {
					aJSON.commentaire = aObs.commentaire;
					aJSON.date = aObs.date;
					aJSON.estPubliee = aObs.estPubliee;
					if (aObs.dateFinMiseEnEvidence) {
						aJSON.dateFinMiseEnEvidence = aObs.dateFinMiseEnEvidence;
					}
				},
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieCarnetCorrespondance =
	ObjetRequeteSaisieCarnetCorrespondance;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCarnetCorrespondance",
	ObjetRequeteSaisieCarnetCorrespondance,
);
