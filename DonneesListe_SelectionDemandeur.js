const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
class DonneesListe_SelectionDemandeur extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecEvnt_SelectionClick: true,
      avecEvnt_Selection: true,
      avecDeploiement: true,
      avecImageSurColonneDeploiement: true,
    });
  }
  getTypeValeur() {
    return ObjetDonneesListe.ETypeCellule.Html;
  }
  avecSelection(aParams) {
    return !aParams.article.estUnDeploiement;
  }
  surSelectionLigne(J, D, aSelectionner) {
    D.selectionne = aSelectionner && !D.estUnDeploiement;
  }
  getClass(aParams) {
    const lClasses = [];
    if (aParams.article.estUnDeploiement) {
      lClasses.push("Gras");
    }
    return lClasses.join(" ");
  }
  getValeur(aParams) {
    return aParams.article.getLibelle();
  }
  getCouleurCellule(aParams) {
    if (aParams.article.estUnDeploiement) {
      return GCouleur.liste.cumul[1];
    }
    return GCouleur.liste.editable;
  }
}
module.exports = { DonneesListe_SelectionDemandeur };
