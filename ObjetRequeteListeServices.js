exports.ObjetRequeteListeServices = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteListeServices extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aUtilisateur, aRessource, aPeriode, aEleve, aPilier) {
		this.JSON = {
			Professeur: aUtilisateur,
			Ressource: aRessource,
			Periode: aPeriode,
			Eleve: aEleve,
			Pilier: aPilier,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeServices = new ObjetListeElements_1.ObjetListeElements();
		this.JSONReponse.services.parcourir(
			_ajouterServices.bind(null, lListeServices, true),
		);
		this.callbackReussite.appel(lListeServices);
	}
}
exports.ObjetRequeteListeServices = ObjetRequeteListeServices;
CollectionRequetes_1.Requetes.inscrire(
	"ListeServices",
	ObjetRequeteListeServices,
);
function _ajouterServices(aListe, aEstService, aElement) {
	aElement.estUnService = aEstService;
	if (!aElement.classe) {
		aElement.classe = new ObjetElement_1.ObjetElement("");
	}
	if (!aElement.groupe) {
		aElement.groupe = new ObjetElement_1.ObjetElement("");
	}
	aListe.addElement(aElement);
	if (aElement.services) {
		aElement.services.parcourir(_ajouterServices.bind(null, aListe, false));
	}
}
