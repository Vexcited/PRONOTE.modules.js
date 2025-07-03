exports.ObjetRequeteSaisieRattachementCDT = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieRattachementCDT extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON = { numeroSemaine: aParam.numeroSemaine };
		if (aParam.cahierDeTextes) {
			this.JSON.cahierDeTextes = aParam.cahierDeTextes.toJSON();
		}
		if (aParam.cours) {
			this.JSON.cours = aParam.cours.toJSON();
		}
		if (aParam.listeCDT) {
			this.JSON.listeCDT = aParam.listeCDT;
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieRattachementCDT = ObjetRequeteSaisieRattachementCDT;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRattachementCDT",
	ObjetRequeteSaisieRattachementCDT,
);
