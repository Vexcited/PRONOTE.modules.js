exports.ObjetRequeteSaisieListeAbsenceRetard = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieListeAbsenceRetard extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aListe) {
		this.JSON = {};
		if (!!aListe) {
			this.JSON.listeAbsences = aListe;
			this.JSON.listeAbsences.setSerialisateurJSON({
				methodeSerialisation: function (aAbsence, AJSON) {
					AJSON.reglee = aAbsence.reglee;
				},
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieListeAbsenceRetard =
	ObjetRequeteSaisieListeAbsenceRetard;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieListeAbsenceRetard",
	ObjetRequeteSaisieListeAbsenceRetard,
);
