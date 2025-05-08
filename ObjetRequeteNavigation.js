exports.ObjetRequeteNavigation = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteNavigation extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aOnglet, aOngletPrec) {
		this.JSON.onglet = aOnglet;
		this.JSON.ongletPrec = aOngletPrec;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteNavigation = ObjetRequeteNavigation;
CollectionRequetes_1.Requetes.inscrire("Navigation", ObjetRequeteNavigation);
