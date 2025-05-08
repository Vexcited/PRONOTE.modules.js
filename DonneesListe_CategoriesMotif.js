const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
class DonneesListe_CategoriesMotif extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({ avecEvnt_Selection: true });
  }
  getValeur(aParams) {
    return aParams.article.getLibelle();
  }
}
module.exports = { DonneesListe_CategoriesMotif };
