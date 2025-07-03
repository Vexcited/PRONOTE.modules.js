exports.ObjetRequeteListeQCMCumuls = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteListeQCMCumuls extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParamJSON, aDonnees) {
		this.JSON = aParamJSON;
		this.donnees = aDonnees;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeQCM = new ObjetListeElements_1.ObjetListeElements().fromJSON(
			this.JSONReponse.listeQCM,
			this._ajouterQCM.bind(this),
		);
		for (let I = 0, lNbr = lListeQCM.count(); I < lNbr; I++) {
			let lQCM = lListeQCM.get(I);
			if (lQCM.positionPere >= 0) {
				const lIndicePere = lListeQCM.getIndiceElementParFiltre(
					this._rechercherPere.bind(this, lQCM.positionPere),
				);
				if (lIndicePere >= 0) {
					lQCM.pere = lListeQCM.get(lIndicePere);
				}
			}
			lQCM.estUnDeploiement =
				lQCM.getGenre() &&
				lQCM.getGenre() !== Enumere_Ressource_1.EGenreRessource.QCM;
			lQCM.estDeploye = true;
		}
		this.callbackReussite.appel(
			lListeQCM,
			this.JSONReponse.message,
			this.donnees,
		);
	}
	_rechercherPere(aPositionPere, aElement) {
		return aElement.getPosition() === aPositionPere;
	}
	_ajouterQCM(aJSON, aElement) {
		aElement.copieJSON(aJSON);
		if (aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.QCM) {
			const lListeProprietes = ["proprietaire", "matiere", "niveau"];
			for (const x in lListeProprietes) {
				if (aJSON[lListeProprietes[x]]) {
					aElement[lListeProprietes[x]] =
						new ObjetElement_1.ObjetElement().fromJSON(
							aJSON[lListeProprietes[x]],
						);
					aElement[lListeProprietes[x]].copieJSON(aJSON[lListeProprietes[x]]);
				}
			}
		}
	}
}
exports.ObjetRequeteListeQCMCumuls = ObjetRequeteListeQCMCumuls;
CollectionRequetes_1.Requetes.inscrire(
	"listeQCMCumuls",
	ObjetRequeteListeQCMCumuls,
);
