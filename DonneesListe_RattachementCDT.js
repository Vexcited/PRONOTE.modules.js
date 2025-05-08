const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
class DonneesListe_RattachementCDT extends ObjetDonneesListe {
  constructor(
    aDonnees,
    aAvecDrag,
    aPere,
    aCallbackMenuContextuel,
    aOptionsDrag,
  ) {
    super(aDonnees);
    this.avecDrag = aAvecDrag;
    this.pere = aPere;
    if (aDonnees) {
      aDonnees.parcourir((aArticle) => {
        aArticle.estRattachementCDT = true;
      });
    }
    this.callbackMenuContextuel = aCallbackMenuContextuel;
    this.optionsDrag = aOptionsDrag;
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
      avecEtatSaisie: false,
      avecLigneDraggable: this.avecDrag,
    });
  }
  _getValeurColonneTitre(aParams) {
    return aParams.article.listeCDC && aParams.article.listeCDC.count() > 0
      ? aParams.article.listeCDC.getLibelle(0)
      : "";
  }
  getLibelleDraggable(aParams) {
    return (
      '<div style="max-width: 300px; text-align:left;">' +
      this._getValeurColonneTitre(aParams) +
      " - " +
      aParams.article.public +
      "</div>"
    );
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RattachementCDT.colonnes.Classe:
        return aParams.article.public;
      case DonneesListe_RattachementCDT.colonnes.Titre:
        return this._getValeurColonneTitre(aParams);
      case DonneesListe_RattachementCDT.colonnes.Categorie: {
        const lCategorie =
          aParams.article.listeCDC.count() && aParams.article.listeCDC.get(0)
            ? aParams.article.listeCDC.get(0).categorie
            : null;
        return lCategorie ? lCategorie.getLibelle() : "";
      }
      case DonneesListe_RattachementCDT.colonnes.NbrTAF:
        return aParams.article.nbrTAF > 0;
      case DonneesListe_RattachementCDT.colonnes.Date:
        return aParams.article.date
          ? GDate.formatDate(aParams.article.date, "%JJ/%MM/%AA %xh%sh%mm")
          : GDate.strSemaine(
              aParams.article.semaine,
              "%JJ/%MM",
              "%JJ/%MM",
              GTraductions.getValeur("Du") + " ",
              " " + GTraductions.getValeur("Au") + " ",
            );
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RattachementCDT.colonnes.NbrTAF:
        return ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getHintForce(aParams) {
    if (
      aParams.idColonne === DonneesListe_RattachementCDT.colonnes.Date &&
      !aParams.article.date
    ) {
      return GTraductions.getValeur("CahierDeTexte.Rattachement.CoursNonPlace");
    }
  }
  getTri() {
    return [ObjetTri.init("public"), ObjetTri.init("date")];
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    aParametres.menuContextuel.addCommande(
      0,
      GTraductions.getValeur("CahierDeTexte.Rattachement.Menu.Visualiser"),
      true,
    );
    aParametres.menuContextuel.addCommande(
      EGenreCommandeMenu.Suppression,
      GTraductions.getValeur("CahierDeTexte.Rattachement.Menu.Supprimer"),
      true,
    );
    aParametres.menuContextuel.setDonnees();
  }
  evenementMenuContextuel(aParametres) {
    this.callbackMenuContextuel(aParametres.ligneMenu);
  }
  static colonnes = {
    Classe: "DL_RattachementCDT_Classe",
    Titre: "DL_RattachementCDT_Titre",
    Categorie: "DL_RattachementCDT_Categorie",
    NbrTAF: "DL_RattachementCDT_NbrTAF",
    Date: "DL_RattachementCDT_Date",
  };
}
module.exports = { DonneesListe_RattachementCDT };
