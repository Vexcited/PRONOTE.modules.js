exports.ObjetRequetePageCahierDeTexte = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetRequetePageCahierDeTexte extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		this.JSON = {
			date: aParametres.date,
			domaine: aParametres.domaine,
			eleve: aParametres.eleve,
			ressource: aParametres.ressource,
			estRequeteRP: aParametres.estRequeteRP,
			sansRequeteRP: aParametres.sansRequeteRP,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lObjetDeserialiser = new ObjetDeserialiser_1.ObjetDeserialiser();
		const lListeTravauxAFaire =
			this.JSONReponse.ListeTravauxAFaire ||
			new ObjetListeElements_1.ObjetListeElements();
		lListeTravauxAFaire.parcourir((aTaf) => {
			lObjetDeserialiser.deserialiserTAF(aTaf);
		});
		lListeTravauxAFaire.setTri([
			ObjetTri_1.ObjetTri.init("DonneLe"),
			ObjetTri_1.ObjetTri.init("Genre"),
		]);
		lListeTravauxAFaire.trier();
		const lListeCahiersDeTextes =
			this.JSONReponse.ListeCahierDeTextes ||
			new ObjetListeElements_1.ObjetListeElements();
		lListeCahiersDeTextes.parcourir((aCahierDeTexte) => {
			lObjetDeserialiser.deserialiserCahierDeTexte(aCahierDeTexte);
		});
		let lListeRessourcesPedagogiques;
		if (
			!!this.JSONReponse.ListeRessourcesPedagogiques &&
			!!this.JSONReponse.ListeRessourcesPedagogiques.listeRessources &&
			this.JSONReponse.ListeRessourcesPedagogiques.listeRessources.count() > 0
		) {
			lListeRessourcesPedagogiques =
				this.JSONReponse.ListeRessourcesPedagogiques.listeRessources;
			lListeRessourcesPedagogiques.setTri([
				ObjetTri_1.ObjetTri.init(
					"date",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeRessourcesPedagogiques.trier();
			const lListeMatieresRessourcesPeda =
				this.JSONReponse.ListeRessourcesPedagogiques.listeMatieres;
			if (!!lListeMatieresRessourcesPeda) {
				lListeMatieresRessourcesPeda.parcourir((aMatiere) => {
					aMatiere.CouleurFond = aMatiere.couleur;
				});
				let lMatiereAvecDonneesCompletes = null;
				lListeRessourcesPedagogiques.parcourir((aRessource) => {
					if (!!aRessource.matiere && !!aRessource.matiere.getNumero()) {
						lMatiereAvecDonneesCompletes =
							lListeMatieresRessourcesPeda.getElementParNumero(
								aRessource.matiere.getNumero(),
							);
						if (!!lMatiereAvecDonneesCompletes) {
							aRessource.matiere = lMatiereAvecDonneesCompletes;
						}
					}
				});
			}
		}
		let lListeRessourcesNumeriques;
		if (
			!!this.JSONReponse.ListeRessourcesNumeriques &&
			!!this.JSONReponse.ListeRessourcesNumeriques.listeRessources &&
			this.JSONReponse.ListeRessourcesNumeriques.listeRessources.count() > 0
		) {
			lListeRessourcesNumeriques =
				this.JSONReponse.ListeRessourcesNumeriques.listeRessources;
			lListeRessourcesNumeriques.setTri([ObjetTri_1.ObjetTri.init("titre")]);
			lListeRessourcesNumeriques.trier();
		}
		this.callbackReussite.appel({
			listeTAF: lListeTravauxAFaire,
			listeCDT: lListeCahiersDeTextes,
			listeDS: this.JSONReponse.listeDS,
			listeMatieres: this.JSONReponse.listeMatieres,
			listeRessourcesNumeriques: lListeRessourcesNumeriques,
			listeRessourcesPedagogiques: lListeRessourcesPedagogiques,
		});
	}
}
exports.ObjetRequetePageCahierDeTexte = ObjetRequetePageCahierDeTexte;
CollectionRequetes_1.Requetes.inscrire(
	"PageCahierDeTexte",
	ObjetRequetePageCahierDeTexte,
);
