const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class DonneesListe_ListeAttestations extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.avecSaisie =
      GApplication.droits.get(TypeDroits.eleves.avecSaisieAttestations) ||
      GEtatUtilisateur.pourPrimaire();
    this.setOptions({ avecEvnt_Creation: true });
    this.param = { avecValidationAuto: false };
  }
  setParametres(aParam) {
    $.extend(this.param, aParam);
  }
  avecMenuContextuel() {
    return false;
  }
  avecSuppression() {
    return this.avecSaisie;
  }
  avecEdition(aParams) {
    if (this.avecSaisie) {
      switch (aParams.idColonne) {
        case DonneesListe_ListeAttestations.colonnes.etat:
          return true;
        case DonneesListe_ListeAttestations.colonnes.date:
          return !!aParams.article.delivree;
      }
    }
    return false;
  }
  avecEvenementSelection(aParams) {
    return aParams.idColonne === DonneesListe_ListeAttestations.colonnes.date;
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ListeAttestations.colonnes.etat:
        return ObjetDonneesListe.ETypeCellule.Image;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getClassCelluleConteneur(aParams) {
    return aParams.idColonne === DonneesListe_ListeAttestations.colonnes.etat
      ? "AvecMain"
      : "";
  }
  getStyle(aParams) {
    const lStyles = [];
    switch (aParams.idColonne) {
      case DonneesListe_ListeAttestations.colonnes.etat:
        lStyles.push("margin:0 auto;");
        break;
    }
    return lStyles.join("");
  }
  surEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ListeAttestations.colonnes.etat:
        aParams.article.delivree = !aParams.article.delivree;
        if (!aParams.article.date) {
          aParams.article.date = new Date();
        }
        break;
    }
  }
  getTri() {
    return ObjetTri.init("abbreviation");
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ListeAttestations.colonnes.libelle:
        return aParams.article.abbreviation;
      case DonneesListe_ListeAttestations.colonnes.libelleLong:
        return aParams.article.getLibelle();
      case DonneesListe_ListeAttestations.colonnes.descriptif:
        return aParams.article.descriptif;
      case DonneesListe_ListeAttestations.colonnes.etat:
        return aParams.article.delivree
          ? "Image_DiodeVerte"
          : aParams.article.delivree === undefined
            ? ""
            : "Image_DiodeGrise";
      case DonneesListe_ListeAttestations.colonnes.date: {
        let lStrDateDelivree = "";
        if (aParams.article.delivree) {
          let lStrDate = "";
          if (aParams.article.date) {
            lStrDate =
              " " + GDate.formatDate(aParams.article.date, "%JJ/%MM/%AAAA");
          }
          lStrDateDelivree =
            GTraductions.getValeur("FicheEleve.delivree") + lStrDate;
        } else {
          lStrDateDelivree =
            aParams.article.delivree === undefined
              ? ""
              : GTraductions.getValeur("FicheEleve.nonDelivree");
        }
        return lStrDateDelivree;
      }
    }
    return "";
  }
  avecEtatSaisie() {
    return this.param.avecValidationAuto !== true;
  }
  avecEvenementApresEdition() {
    return this.param.avecValidationAuto === true;
  }
}
DonneesListe_ListeAttestations.colonnes = {
  libelle: "libelle",
  libelleLong: "libelleLong",
  etat: "etat",
  date: "date",
  descriptif: "descriptif",
};
module.exports = { DonneesListe_ListeAttestations };
