const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequeteListeServices extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
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
		const lListeServices = new ObjetListeElements();
		this.JSONReponse.services.parcourir(
			_ajouterServices.bind(null, lListeServices, true),
		);
		this.callbackReussite.appel(lListeServices);
	}
}
Requetes.inscrire("ListeServices", ObjetRequeteListeServices);
function _ajouterServices(aListe, aEstService, aElement) {
	aElement.estUnService = aEstService;
	if (!aElement.classe) {
		aElement.classe = new ObjetElement("");
	}
	if (!aElement.groupe) {
		aElement.groupe = new ObjetElement("");
	}
	aListe.addElement(aElement);
	if (aElement.services) {
		aElement.services.parcourir(_ajouterServices.bind(null, aListe, false));
	}
}
module.exports = { ObjetRequeteListeServices };
