exports.ObjetRequetePageEquipePedagogique = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequetePageEquipePedagogique extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		let lAvecEnseignant, lAvecEnseignantEnleve, lAvecPersonnel;
		const lListe = this.JSONReponse.liste;
		const lCumulProf = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"EquipePedagogique.professeursDEquipe",
			),
		);
		lCumulProf.Genre = Enumere_Ressource_1.EGenreRessource.Enseignant;
		lCumulProf.estUnDeploiement = true;
		lCumulProf.estDeploye = true;
		const lCumulEnleve = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"EquipePedagogique.autresProfesseursDEquipe",
			),
		);
		lCumulEnleve.Genre = Enumere_Ressource_1.EGenreRessource.Enseignant;
		lCumulEnleve.estUnDeploiement = true;
		lCumulEnleve.estDeploye = true;
		lCumulEnleve.estEnleve = true;
		const lCumulPersonnel = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"EquipePedagogique.personnelsDEquipe",
			),
		);
		lCumulPersonnel.Genre = Enumere_Ressource_1.EGenreRessource.Personnel;
		lCumulPersonnel.estUnDeploiement = true;
		lCumulPersonnel.estDeploye = true;
		lListe.parcourir((aElement) => {
			if (
				aElement.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Enseignant &&
				!aElement.estEnleve
			) {
				lAvecEnseignant = true;
				aElement.pere = lCumulProf;
			}
			if (
				aElement.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Enseignant &&
				aElement.estEnleve
			) {
				lAvecEnseignantEnleve = true;
				aElement.pere = lCumulEnleve;
			}
			if (
				aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Personnel
			) {
				lAvecPersonnel = true;
				aElement.pere = lCumulPersonnel;
			}
			if (aElement.matieres) {
				aElement.matieres.setTri([
					ObjetTri_1.ObjetTri.init((D) => {
						return D.estUneSousMatiere ? D.libelleMatiere : D.getLibelle();
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						return !!D.estUneSousMatiere;
					}),
					ObjetTri_1.ObjetTri.init("Libelle"),
				]);
				aElement.matieres.trier();
			}
		});
		if (lAvecEnseignant && (lAvecEnseignantEnleve || lAvecPersonnel)) {
			lListe.addElement(lCumulProf);
		}
		if (lAvecEnseignantEnleve) {
			lListe.addElement(lCumulEnleve);
		}
		if (lAvecPersonnel) {
			lListe.addElement(lCumulPersonnel);
		}
		this.callbackReussite.appel(lListe);
	}
}
exports.ObjetRequetePageEquipePedagogique = ObjetRequetePageEquipePedagogique;
CollectionRequetes_1.Requetes.inscrire(
	"PageEquipePedagogique",
	ObjetRequetePageEquipePedagogique,
);
