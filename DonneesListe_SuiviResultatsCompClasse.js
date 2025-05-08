const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
class DonneesListe_SuiviResultatsCompClasse extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({ avecEdition: false, avecSuppression: false });
  }
  avecEvenementSelectionClick(aParams) {
    return (
      aParams.idColonne === DonneesListe_SuiviResultatsCompClasse.colonnes.eleve
    );
  }
  avecMenuContextuel() {
    return false;
  }
  getTypeValeur() {
    return ObjetDonneesListe.ETypeCellule.Html;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviResultatsCompClasse.colonnes.eleve:
        return aParams.article.getLibelle();
      case DonneesListe_SuiviResultatsCompClasse.colonnes.nbEchecs:
        return aParams.article.nbElemCompEchecs || 0;
      case DonneesListe_SuiviResultatsCompClasse.colonnes.nbSucces:
        return aParams.article.nbElemCompSucces || 0;
    }
    return "";
  }
  getClassCelluleConteneur(aParams) {
    const lClasses = [];
    if (aParams.article.nbElemCompEchecs > 0) {
      lClasses.push("Gras");
    }
    switch (aParams.idColonne) {
      case DonneesListe_SuiviResultatsCompClasse.colonnes.eleve:
        lClasses.push("SouligneSurvol");
        lClasses.push("AvecMain");
        break;
      case DonneesListe_SuiviResultatsCompClasse.colonnes.nbEchecs:
      case DonneesListe_SuiviResultatsCompClasse.colonnes.nbSucces:
        lClasses.push("AlignementMilieu");
        break;
    }
    return lClasses.join(" ");
  }
  getTri(aCol, aGenreTri) {
    const lTris = [];
    switch (this.getId(aCol)) {
      case DonneesListe_SuiviResultatsCompClasse.colonnes.eleve:
        lTris.push(ObjetTri.init("Position", aGenreTri));
        break;
      case DonneesListe_SuiviResultatsCompClasse.colonnes.nbEchecs:
        lTris.push(
          ObjetTri.init(
            "nbElemCompEchecs",
            aGenreTri === EGenreTriElement.Croissant
              ? EGenreTriElement.Decroissant
              : EGenreTriElement.Croissant,
          ),
        );
        break;
      case DonneesListe_SuiviResultatsCompClasse.colonnes.nbSucces:
        lTris.push(
          ObjetTri.init(
            "nbElemCompSucces",
            aGenreTri === EGenreTriElement.Croissant
              ? EGenreTriElement.Decroissant
              : EGenreTriElement.Croissant,
          ),
        );
        break;
    }
    return lTris;
  }
}
DonneesListe_SuiviResultatsCompClasse.colonnes = {
  eleve: "DLSuiviCpt_eleve",
  nbEchecs: "DLSuiviCpt_echecs",
  nbSucces: "DLSuiviCpt_succes",
};
module.exports = { DonneesListe_SuiviResultatsCompClasse };
