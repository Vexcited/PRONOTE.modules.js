const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequetePageCahierDeTexte extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
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
		const lObjetDeserialiser = new ObjetDeserialiser();
		const lListeTravauxAFaire =
			this.JSONReponse.ListeTravauxAFaire || new ObjetListeElements();
		lListeTravauxAFaire.parcourir((aTaf) => {
			lObjetDeserialiser.deserialiserTAF(aTaf);
		});
		lListeTravauxAFaire.setTri([
			ObjetTri.init("DonneLe"),
			ObjetTri.init("Genre"),
		]);
		lListeTravauxAFaire.trier();
		const lListeCahiersDeTextes =
			this.JSONReponse.ListeCahierDeTextes || new ObjetListeElements();
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
				ObjetTri.init("date", EGenreTriElement.Decroissant),
				ObjetTri.init("Libelle"),
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
			lListeRessourcesNumeriques.setTri([ObjetTri.init("titre")]);
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
Requetes.inscrire("PageCahierDeTexte", ObjetRequetePageCahierDeTexte);
module.exports = { ObjetRequetePageCahierDeTexte };
