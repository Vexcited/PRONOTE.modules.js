exports.ObjetRequeteFicheCours = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteFicheCours extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ gererMessageErreur: null });
	}
}
exports.ObjetRequeteFicheCours = ObjetRequeteFicheCours;
CollectionRequetes_1.Requetes.inscrire("FicheCours", ObjetRequeteFicheCours);
