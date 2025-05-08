exports.ObjetRequeteProgrammesBO = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteProgrammesBO extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aProgramme, aCumul, aMatiere) {
		this.matiere = aMatiere;
		if (aProgramme) {
			if (!!aProgramme.matiere) {
				this.JSON = {
					programme: {
						matiere: aProgramme.matiere,
						niveauFiliere: aProgramme.niveauFiliere,
						filiere: aProgramme.filiere,
					},
				};
			} else {
				this.JSON = {
					programme: {
						strNiveau: aProgramme.strNiveau,
						strFilieres: aProgramme.strFilieres,
						strFiliereXML: aProgramme.strFiliereXML,
						strMatiere: aProgramme.strMatiere,
						strCycle: aProgramme.strCycle,
					},
				};
			}
		} else {
			this.JSON = { cumul: aCumul };
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		for (
			let I = 0;
			this.JSONReponse.listeProgrammes &&
			I < this.JSONReponse.listeProgrammes.count();
			I++
		) {
			const lLigne = this.JSONReponse.listeProgrammes.get(I);
			lLigne.indice = I;
			if (lLigne.indicePere >= 0) {
				lLigne.pere = this.JSONReponse.listeProgrammes.get(lLigne.indicePere);
			}
			lLigne.estDeploye = !!(
				this.matiere && this.matiere.getLibelle() === lLigne.strCumul
			);
			lLigne.estUnDeploiement = !lLigne.estFeuille;
		}
		this.callbackReussite.appel(
			this.JSONReponse.listeProgrammes,
			this.JSONReponse.programme,
			this.JSONReponse.listeCumuls,
		);
	}
}
exports.ObjetRequeteProgrammesBO = ObjetRequeteProgrammesBO;
CollectionRequetes_1.Requetes.inscrire(
	"ProgrammesBO",
	ObjetRequeteProgrammesBO,
);
