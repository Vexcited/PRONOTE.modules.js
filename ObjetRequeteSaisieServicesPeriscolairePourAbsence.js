exports.ObjetRequeteSaisieServicesPeriscolairePourAbsence = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieServicesPeriscolairePourAbsence extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		aParams.liste.setSerialisateurJSON({ ignorerEtatsElements: true });
		this.JSON = aParams;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieServicesPeriscolairePourAbsence =
	ObjetRequeteSaisieServicesPeriscolairePourAbsence;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieServicesPeriscolairePourAbsence",
	ObjetRequeteSaisieServicesPeriscolairePourAbsence,
);
