const {
  DonneesListe_CelluleMultiSelection,
} = require("ObjetCelluleMultiSelection.js");
class DonneesListe_Actions extends DonneesListe_CelluleMultiSelection {
  constructor(aDonnees, aParam) {
    super(aDonnees);
    this.param = aParam;
  }
  avecEvenementCreation() {
    return this.param ? this.param.avecCreation : false;
  }
  avecEvenementApresCreation() {
    return this.param ? this.param.avecCreation : false;
  }
  surCreation(D, V) {
    D.Libelle = V[DonneesListe_Actions.colonnes.libelle];
    D.cmsActif = true;
  }
  surEdition(aParams, V) {
    super.surEdition(aParams, V);
    if (aParams.article.ssAction) {
      this.Donnees.parcourir((D) => {
        if (!D.ssAction) {
          D.cmsActif = false;
        }
      });
    } else {
      this.Donnees.parcourir((D) => {
        if (D.ssAction) {
          D.cmsActif = false;
          return false;
        }
      });
    }
  }
  getTableauLignesModifieesCocheTitre() {
    const T = [];
    this.Donnees.parcourir((D, aIndex) => {
      if (!D.ssAction) {
        T.push(aIndex);
      }
    });
    return T;
  }
}
DonneesListe_Actions.colonnes = { coche: 0, libelle: 1 };
module.exports = { DonneesListe_Actions };
