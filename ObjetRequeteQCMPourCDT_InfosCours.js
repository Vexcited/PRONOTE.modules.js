exports.ObjetRequeteQCMPourCDT_InfosCours = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
class ObjetRequeteQCMPourCDT_InfosCours extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.JSON = {
			cours: new ObjetElement_1.ObjetElement(),
			numeroCycle: 0,
			avecJoursPresence: true,
		};
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteQCMPourCDT_InfosCours = ObjetRequeteQCMPourCDT_InfosCours;
CollectionRequetes_1.Requetes.inscrire(
	"QCMPourCDT_InfosCours",
	ObjetRequeteQCMPourCDT_InfosCours,
);
