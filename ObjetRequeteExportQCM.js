exports.ObjetRequeteExportQCM = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteExportQCM extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aElementQCM) {
		this.JSON = { qcm: aElementQCM };
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteExportQCM = ObjetRequeteExportQCM;
CollectionRequetes_1.Requetes.inscrire("ExportQCM", ObjetRequeteExportQCM);
