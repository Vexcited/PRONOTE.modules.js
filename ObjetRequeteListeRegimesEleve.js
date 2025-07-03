exports.ObjetRequeteListeRegimesEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetRequeteListeRegimesEleve extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.JSONReponse.listeCreneauxAppelRetardInternat =
			MethodesObjet_1.MethodesObjet.dupliquer(
				this.JSONReponse.listeCreneauxAppelAbsInternat,
			);
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteListeRegimesEleve = ObjetRequeteListeRegimesEleve;
CollectionRequetes_1.Requetes.inscrire(
	"ListeRegimesEleve",
	ObjetRequeteListeRegimesEleve,
);
