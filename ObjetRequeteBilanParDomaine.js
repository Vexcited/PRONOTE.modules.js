const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequeteBilanParDomaine extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
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
					D.getGenre() !== EGenreRessource.Evaluation &&
					D.getGenre() !== EGenreRessource.EvaluationHistorique
				) {
					lPereEvaluation = D;
				}
				D.pere =
					lTableauPeres[
						_getGenrePere(
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
}
Requetes.inscrire("BilanParDomaine", ObjetRequeteBilanParDomaine);
function _getGenrePere(aGenre, aGenrePourEvaluation) {
	switch (aGenre) {
		case EGenreRessource.MetaMatiere:
			return null;
		case EGenreRessource.ElementPilier:
			return EGenreRessource.MetaMatiere;
		case EGenreRessource.Competence:
			return EGenreRessource.ElementPilier;
		case EGenreRessource.SousItem:
			return EGenreRessource.Competence;
		case EGenreRessource.Evaluation:
		case EGenreRessource.EvaluationHistorique:
			return aGenrePourEvaluation;
	}
}
module.exports = { ObjetRequeteBilanParDomaine };
