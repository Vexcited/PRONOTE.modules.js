exports.ObjetRequeteBilanParDomaine = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteBilanParDomaine extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		const lParametres = Object.assign(
			{
				listeEleves: null,
				palier: null,
				pilier: null,
				service: null,
				ressource: null,
				filtreEvaluation: null,
				filtreElementsSansEvaluation: false,
			},
			aParametres,
		);
		this.JSON = {
			Ressource: lParametres.ressource,
			Palier: lParametres.palier,
			Pilier: lParametres.pilier,
			Service: lParametres.service,
			filtreElementsSansEvaluation: lParametres.filtreElementsSansEvaluation,
		};
		if (!!lParametres.filtreEvaluation) {
			this.JSON.FiltreEvaluation = lParametres.filtreEvaluation.valeurFiltre;
		}
		if (!!lParametres.listeEleves) {
			lParametres.listeEleves.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
			this.JSON.listeEleves = lParametres.listeEleves;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (!!this.JSONReponse.listeCompetences) {
			const lTableauPeres = [];
			let lPereEvaluation = null;
			this.JSONReponse.listeCompetences.parcourir((D) => {
				if (
					D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Evaluation &&
					D.getGenre() !==
						Enumere_Ressource_1.EGenreRessource.EvaluationHistorique
				) {
					lPereEvaluation = D;
				}
				D.pere =
					lTableauPeres[
						this._getGenrePere(
							D.getGenre(),
							!!lPereEvaluation ? lPereEvaluation.getGenre() : null,
						)
					];
				if (!!D.pere) {
					D.pere.estUnDeploiement = true;
					D.pere.estDeploye = true;
				}
				lTableauPeres[D.getGenre()] = D;
			});
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
	_getGenrePere(aGenre, aGenrePourEvaluation) {
		switch (aGenre) {
			case Enumere_Ressource_1.EGenreRessource.MetaMatiere:
				return null;
			case Enumere_Ressource_1.EGenreRessource.ElementPilier:
				return Enumere_Ressource_1.EGenreRessource.MetaMatiere;
			case Enumere_Ressource_1.EGenreRessource.Competence:
				return Enumere_Ressource_1.EGenreRessource.ElementPilier;
			case Enumere_Ressource_1.EGenreRessource.SousItem:
				return Enumere_Ressource_1.EGenreRessource.Competence;
			case Enumere_Ressource_1.EGenreRessource.Evaluation:
			case Enumere_Ressource_1.EGenreRessource.EvaluationHistorique:
				return aGenrePourEvaluation;
		}
	}
}
exports.ObjetRequeteBilanParDomaine = ObjetRequeteBilanParDomaine;
CollectionRequetes_1.Requetes.inscrire(
	"BilanParDomaine",
	ObjetRequeteBilanParDomaine,
);
