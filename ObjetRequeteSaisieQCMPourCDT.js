exports.ObjetRequeteSaisieQCMPourCDT = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieQCMPourCDT extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		this.JSON = {
			cours: null,
			numeroCycle: 0,
			QCM: null,
			estPourTAF: true,
			dateTAF: null,
			cahier: null,
		};
		$.extend(this.JSON, aParametres);
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieQCMPourCDT = ObjetRequeteSaisieQCMPourCDT;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieQCMPourCDT",
	ObjetRequeteSaisieQCMPourCDT,
);
