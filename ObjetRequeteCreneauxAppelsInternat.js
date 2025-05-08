exports.ObjetRequeteCreneauxAppelsInternat = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequeteCreneauxAppelsInternat extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		const lListeCreneaux = new ObjetListeElements_1.ObjetListeElements();
		this.JSONReponse.listeCreneaux.parcourir((aCreneau) => {
			const lListeRessources = new ObjetListeElements_1.ObjetListeElements();
			let lRessourceCumul;
			let lNbElevesAttendus = 0;
			let lNbAbsences = 0;
			let lNbRetards = 0;
			aCreneau.listeRessources.parcourir((aRessource) => {
				if (aRessource.estCumul) {
					aRessource.estUnDeploiement = true;
					aRessource.estDeploye = true;
					lRessourceCumul = aRessource;
					lNbElevesAttendus += lRessourceCumul.nbElevesAttendus;
					lNbAbsences += lRessourceCumul.nbAbsences;
					lNbRetards += lRessourceCumul.nbRetards;
					lListeRessources.add(lRessourceCumul);
				} else {
					aRessource.pere = lRessourceCumul;
				}
			});
			const lCreneau = aCreneau;
			lCreneau.listeRessourcesCumul = lListeRessources;
			lCreneau.estAppelTermine =
				!lCreneau.listeRessourcesCumul.getElementParFiltre((aRessource) => {
					return !aRessource.estAppelFait;
				});
			lCreneau.nbElevesAttendus = lNbElevesAttendus;
			lCreneau.nbAbsences = lNbAbsences;
			lCreneau.nbRetards = lNbRetards;
			lListeCreneaux.add(lCreneau);
		});
		lListeCreneaux.trier();
		this.callbackReussite.appel({ listeCreneaux: lListeCreneaux });
	}
}
exports.ObjetRequeteCreneauxAppelsInternat = ObjetRequeteCreneauxAppelsInternat;
CollectionRequetes_1.Requetes.inscrire(
	"ListeCreneauxAppelsInternat",
	ObjetRequeteCreneauxAppelsInternat,
);
