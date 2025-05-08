const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequeteCompetencesNumeriques extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
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
Requetes.inscrire("CompetencesNumeriques", ObjetRequeteCompetencesNumeriques);
function _getGenrePere(aGenre, aGenrePourEvaluation) {
  switch (aGenre) {
    case EGenreRessource.ElementPilier:
      return EGenreRessource.Pilier;
    case EGenreRessource.Competence:
      return EGenreRessource.ElementPilier;
    case EGenreRessource.SousItem:
      return EGenreRessource.Competence;
    case EGenreRessource.Evaluation:
    case EGenreRessource.EvaluationHistorique:
      return aGenrePourEvaluation;
  }
}
module.exports = { ObjetRequeteCompetencesNumeriques };
