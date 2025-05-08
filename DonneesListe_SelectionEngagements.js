const {
  DonneesListe_CelluleMultiSelection,
} = require("ObjetCelluleMultiSelection.js");
class DonneesListe_SelectionEngagements extends DonneesListe_CelluleMultiSelection {
  constructor(aDonnees, aParam) {
    super(aDonnees);
    this.param = aParam;
  }
  avecEvenementSelection(I) {
    return I === 0;
  }
  getValeur(aParams) {
    switch (aParams.colonne) {
      case DonneesListe_SelectionEngagements.colonnes.coche:
        return aParams.article.cmsActif !== undefined
          ? aParams.article.cmsActif
          : false;
      case DonneesListe_SelectionEngagements.colonnes.code:
        return aParams.article.code ? aParams.article.code : "";
      case DonneesListe_SelectionEngagements.colonnes.libelle:
        return aParams.article.getLibelle();
    }
    return "";
  }
}
DonneesListe_SelectionEngagements.colonnes = { coche: 0, code: 1, libelle: 2 };
module.exports = { DonneesListe_SelectionEngagements };
