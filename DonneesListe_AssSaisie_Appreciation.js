const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_AssSaisie_Appreciation extends ObjetDonneesListe {
  constructor(aDonnees, aTailleMax, aAvecEtatSaisie) {
    super(aDonnees);
    this.tailleMax = aTailleMax || 0;
    this.creerIndexUnique("Libelle");
    this.setOptions({
      avecEvnt_Selection: true,
      avecEvnt_Creation: true,
      avecEvnt_ApresEdition: true,
      avecEvnt_SelectionDblClick: true,
      avecEvnt_Suppression: true,
      avecEtatSaisie:
        aAvecEtatSaisie !== null && aAvecEtatSaisie !== undefined
          ? aAvecEtatSaisie
          : true,
    });
  }
  getCouleurCellule() {
    return ObjetDonneesListe.ECouleurCellule.Blanc;
  }
  avecMenuContextuel() {
    return false;
  }
  getClass(aParams) {
    const lClasses = [];
    if (!aParams.article.Supprimable) {
      lClasses.push("Gras");
    }
    return lClasses.join(" ");
  }
  getTailleTexteMax() {
    return this.tailleMax;
  }
  getMessageTailleMaximaleSaisie() {
    return GTraductions.getValeur("MessageTailleMaxAppr");
  }
  getTypeValeur() {
    return ObjetDonneesListe.ETypeCellule.ZoneTexte;
  }
  surCreation(D, V) {
    D.Libelle = V[0];
    D.Editable = true;
    D.Supprimable = true;
  }
  suppressionImpossible(D) {
    return !D.Supprimable;
  }
  getMessageSuppressionImpossible() {
    return GTraductions.getValeur("Appreciations.MsgSuppressionApprecInterdit");
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_AssSaisie_Appreciation.colonnes.libelle:
        return aParams.article.getLibelle();
    }
    return "";
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_AssSaisie_Appreciation.colonnes.libelle:
        return aParams.article ? !!aParams.article.getActif() : false;
    }
    return false;
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_AssSaisie_Appreciation.colonnes.libelle:
        return aParams.article.setLibelle(V);
    }
  }
}
DonneesListe_AssSaisie_Appreciation.colonnes = {
  libelle: "DL_AssistSaisieApprec_libelle",
};
module.exports = { DonneesListe_AssSaisie_Appreciation };
