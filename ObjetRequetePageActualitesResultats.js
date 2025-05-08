const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const {
  TypeGenreReponseInternetActualite,
} = require("TypeGenreReponseInternetActualite.js");
class ObjetRequetePageActualitesResultats extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
    this.actualite = null;
  }
  lancerRequete(aParametres) {
    this.actualite = aParametres.actualite;
    $.extend(this.JSON, aParametres);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    let lNumeroPere;
    function _getIndicePere(aEle) {
      return aEle.NumeroArticleLigne === lNumeroPere;
    }
    function _getIndicePremierFils(aEle) {
      return aEle.NumeroArticlePere === lNumeroPere;
    }
    this.actualite.avecResultats = false;
    const lResultats = this.JSONReponse;
    if (lResultats && lResultats.listeQuestions) {
      lResultats.listeQuestions.parcourir((aQstResultat) => {
        const lQuestion = this.actualite.listeQuestions.getElementParNumero(
          aQstResultat.getNumero(),
        );
        lQuestion.niveauMaxCumul = 0;
        if (!!lQuestion && !!aQstResultat && !!aQstResultat.listeRepondant) {
          lQuestion.resultats = {};
          lQuestion.resultats.listeRepondant = aQstResultat.listeRepondant;
          this.actualite.avecResultats = true;
          lQuestion.resultats.listeRepondant.parcourir((lElement) => {
            if (lElement.estCumul) {
              lElement.estDeploye = false;
              lNumeroPere = lElement.NumeroArticleLigne;
              lElement.estUnDeploiement =
                !this.actualite.reponseAnonyme ||
                lQuestion.genreReponse ===
                  TypeGenreReponseInternetActualite.Textuelle ||
                lQuestion.resultats.listeRepondant.getIndiceElementParFiltre(
                  _getIndicePremierFils,
                ) > -1;
              lQuestion.niveauMaxCumul = Math.max(
                lQuestion.niveauMaxCumul,
                lElement.niveauCumul,
              );
            } else {
              lElement.estUnDeploiement = false;
            }
            if (lElement.NumeroArticlePere !== 0) {
              lNumeroPere = lElement.NumeroArticlePere;
              const lIndicePere =
                lQuestion.resultats.listeRepondant.getIndiceElementParFiltre(
                  _getIndicePere,
                );
              if (lIndicePere > -1) {
                lElement.pere =
                  lQuestion.resultats.listeRepondant.get(lIndicePere);
              }
            }
          });
          lQuestion.niveauMaxCumul += 1;
        }
      });
    }
    this.callbackReussite.appel(this.actualite);
  }
}
Requetes.inscrire(
  "PageActualitesResultats",
  ObjetRequetePageActualitesResultats,
);
module.exports = { ObjetRequetePageActualitesResultats };
