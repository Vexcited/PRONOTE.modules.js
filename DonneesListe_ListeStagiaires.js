const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { TypeEtatSatisfactionUtil } = require("TypeEtatSatisfaction.js");
class DonneesListe_ListeStagiaires extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecSuppression: false,
      avecEvnt_Edition: true,
      avecEtatSaisie: false,
      avecTri: false,
      avecDeploiement: true,
    });
  }
  avecMenuContextuel() {
    return false;
  }
  avecEdition(aParams) {
    return (
      aParams.idColonne === DonneesListe_ListeStagiaires.colonnes.evaluation &&
      !aParams.article.estTitre
    );
  }
  getColonneDeFusion(aParams) {
    if (aParams.article.estTitre) {
      return DonneesListe_ListeStagiaires.colonnes.stagiaire;
    }
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ListeStagiaires.colonnes.evaluation:
        return ObjetDonneesListe.ETypeCellule.Image;
    }
    return ObjetDonneesListe.ETypeCellule.Html;
  }
  getValeur(aParams) {
    const lResult = [];
    if (aParams.article.estTitre) {
      if (aParams.article.estUnDeploiement) {
        if (aParams.article.estDeploye) {
          lResult.push(
            '<div class="Image_DeploiementListe_Deploye" style="float:left;margin-top:2px;">&nbsp;</div>&nbsp;',
          );
        } else {
          lResult.push(
            '<div class="Image_DeploiementListe_NonDeploye" style="float:left;margin-top:2px;">&nbsp;</div>&nbsp;',
          );
        }
      }
      return lResult.join("") + aParams.article.libelleSousTitre;
    }
    switch (aParams.idColonne) {
      case DonneesListe_ListeStagiaires.colonnes.stagiaire:
        return aParams.article.libelleStagiaire;
      case DonneesListe_ListeStagiaires.colonnes.sujet:
        return aParams.article.libelleSujet;
      case DonneesListe_ListeStagiaires.colonnes.entreprise:
        return aParams.article.libelleEntreprise;
      case DonneesListe_ListeStagiaires.colonnes.maitresDeStage:
        return aParams.article.libelleMDS;
      case DonneesListe_ListeStagiaires.colonnes.referants:
        return aParams.article.libelleReferant;
      case DonneesListe_ListeStagiaires.colonnes.evaluation:
        return TypeEtatSatisfactionUtil.getImageListe(
          aParams.article.typeSatisfaction,
        );
    }
    return "";
  }
  getClass(aParams) {
    const lClasses = [];
    if (aParams.article.estTitre) {
      lClasses.push("Gras");
    } else if (
      aParams.idColonne === DonneesListe_ListeStagiaires.colonnes.stagiaire
    ) {
      lClasses.push("EspaceGauche10");
    }
    return lClasses.join(" ");
  }
  getClassCelluleConteneur(aParams) {
    const lClasses = [];
    if (aParams.article.estTitre) {
      lClasses.push("AlignementMilieuVertical");
    } else {
      lClasses.push("AlignementHaut");
    }
    return lClasses.join(" ");
  }
  getNiveauDeploiement() {
    return 2;
  }
  getCouleurCellule(aParams) {
    return aParams.article.estUnDeploiement
      ? ObjetDonneesListe.ECouleurCellule.Deploiement
      : ObjetDonneesListe.ECouleurCellule.Blanc;
  }
}
DonneesListe_ListeStagiaires.colonnes = {
  stagiaire: "DL_Stagiaires_nom",
  sujet: "DL_Stagiaires_sujet",
  entreprise: "DL_Stagiaires_entreprise",
  maitresDeStage: "DL_Stagiaires_maitrestage",
  referants: "DL_Stagiaires_referant",
  evaluation: "DL_Stagiaires_eval",
};
module.exports = { DonneesListe_ListeStagiaires };
