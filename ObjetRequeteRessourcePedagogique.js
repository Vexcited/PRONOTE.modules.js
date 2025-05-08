exports.ObjetRequeteRessourcePedagogique = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const MethodesObjet_1 = require("MethodesObjet");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
class ObjetRequeteRessourcePedagogique extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		this.JSON.avecRessourcesPronote = aParams.avecRessourcesPronote;
		this.JSON.avecRessourcesEditeur = aParams.avecRessourcesEditeur;
		this.JSON.avecDonnees = aParams.avecDonnees;
		if (aParams.listePublic) {
			this.JSON.listePublic = aParams.listePublic.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeMatieres = this.JSONReponse.listeMatieres;
		let lMatiere;
		const lListeRessources = this.JSONReponse.listeRessources;
		if (lListeMatieres) {
			lListeMatieres.parcourir((D) => {
				D.listeRessources = new ObjetListeElements_1.ObjetListeElements();
			});
		}
		if (this.JSONReponse.listeMatieres && this.JSONReponse.listeRessources) {
			this.JSONReponse.listeRessources.parcourir((D) => {
				lMatiere = lListeMatieres.getElementParNumero(D.matiere.getNumero());
				if (lMatiere) {
					lMatiere.listeRessources.addElement(D);
				}
				if (
					D.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM
				) {
					const lRessource = MethodesObjet_1.MethodesObjet.dupliquer(
						D.ressource,
					);
					new ObjetDeserialiser_1.ObjetDeserialiser()._ajouterQCM(
						lRessource,
						D.ressource,
					);
				}
			});
		}
		if (lListeMatieres) {
			lListeMatieres.trier();
		}
		for (let I = 0; lListeRessources && I < lListeRessources.count(); I++) {
			const lRessource = lListeRessources.get(I);
			if (!lRessource.estUnDeploiement && lRessource.matiere) {
				lRessource.pere = lListeRessources.getElementParNumero(
					lRessource.matiere.getNumero(),
				);
			}
			lRessource.estDeploye = true;
		}
		this.callbackReussite.appel(
			lListeMatieres,
			lListeRessources,
			this.JSONReponse.listeMatieresParRessource,
			this.JSONReponse.afficherCumul,
			this.JSONReponse,
		);
	}
}
exports.ObjetRequeteRessourcePedagogique = ObjetRequeteRessourcePedagogique;
CollectionRequetes_1.Requetes.inscrire(
	"RessourcePedagogique",
	ObjetRequeteRessourcePedagogique,
);
