exports.ObjetRequeteCompetencesNumeriques = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteCompetencesNumeriques extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		const lParametres = Object.assign(
			{ classe: null, eleve: null, filtrerNiveauxSansEvaluation: false },
			aParametres,
		);
		this.JSON = {
			classe: lParametres.classe,
			eleve: lParametres.eleve,
			filtrerNiveauxSansEvaluation: lParametres.filtrerNiveauxSansEvaluation,
		};
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
			case Enumere_Ressource_1.EGenreRessource.ElementPilier:
				return Enumere_Ressource_1.EGenreRessource.Pilier;
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
exports.ObjetRequeteCompetencesNumeriques = ObjetRequeteCompetencesNumeriques;
CollectionRequetes_1.Requetes.inscrire(
	"CompetencesNumeriques",
	ObjetRequeteCompetencesNumeriques,
);
