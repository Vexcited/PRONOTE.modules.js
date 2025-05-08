const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
class DonneesListe_SelectAnnees extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecSuppression: false,
      avecEvnt_Selection: true,
      avecEvnt_ApresEdition: true,
      avecEtatSaisie: false,
    });
  }
  _getNbrAnneesActives() {
    return this.Donnees.getListeElements((D) => {
      return !!D.cmsActif;
    }).count();
  }
  avecMenuContextuel() {
    return false;
  }
  avecEdition(aParams) {
    return aParams.idColonne === DonneesListe_SelectAnnees.colonnes.coche;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SelectAnnees.colonnes.coche:
        return !!aParams.article.cmsActif;
      case DonneesListe_SelectAnnees.colonnes.libelle:
        return aParams.article.getLibelle();
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SelectAnnees.colonnes.coche:
        return ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  surEdition(aParams, V) {
    if (aParams.idColonne === DonneesListe_SelectAnnees.colonnes.coche) {
      aParams.article.cmsActif = V;
      if (this._getNbrAnneesActives() === 0) {
        aParams.article.cmsActif = true;
      }
    }
  }
}
DonneesListe_SelectAnnees.colonnes = {
  coche: "SelectAnnees_coche",
  libelle: "SelectAnnees_libelle",
};
module.exports = DonneesListe_SelectAnnees;
