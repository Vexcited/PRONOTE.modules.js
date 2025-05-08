const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  TypeOrigineCreationEtiquetteMessageUtil,
} = require("TypeOrigineCreationEtiquetteMessage.js");
class DonneesListe_CategoriesDiscussion extends ObjetDonneesListe {
  constructor(aParametres, aOldListeAffichage) {
    super();
    this.parametres = Object.assign(
      { message: null, listeEtiquettes: null },
      aParametres,
    );
    this.Donnees = _init.call(this, aOldListeAffichage);
    this.setOptions({
      avecTri: false,
      avecTrimSurEdition: true,
      avecEvnt_Edition: true,
      avecEtatSaisie: false,
      avecEvnt_ApresCreation: true,
      avecEvnt_Suppression: true,
      avecInterruptionSuppression: true,
    });
    this.creerIndexUnique(["Libelle"]);
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_CategoriesDiscussion.colonnes.coche:
        return aParams.article.coche;
      case DonneesListe_CategoriesDiscussion.colonnes.couleur:
        return [
          '<div style="',
          GStyle.composeHeight(14),
          GStyle.composeWidth(14),
          GStyle.composeCouleurBordure("black"),
          GStyle.composeCouleurFond(aParams.article.etiquette.couleur),
          '">',
          "</div>",
        ].join("");
      case DonneesListe_CategoriesDiscussion.colonnes.nom:
        return aParams.article.etiquette.getLibelle();
      case DonneesListe_CategoriesDiscussion.colonnes.abr:
        return aParams.article.etiquette.abr;
      default:
    }
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_CategoriesDiscussion.colonnes.coche:
        return ObjetDonneesListe.ETypeCellule.Coche;
      case DonneesListe_CategoriesDiscussion.colonnes.couleur:
        return ObjetDonneesListe.ETypeCellule.Html;
      default:
        return ObjetDonneesListe.ETypeCellule.Texte;
    }
  }
  avecEvenementEdition(aParams) {
    return (
      aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.couleur
    );
  }
  avecEvenementApresEdition(aParams) {
    return (
      aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.nom ||
      aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.abr
    );
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_CategoriesDiscussion.colonnes.coche:
        aParams.article.coche = V;
        break;
      case DonneesListe_CategoriesDiscussion.colonnes.nom:
        aParams.article.Libelle = aParams.valeur;
        break;
      case DonneesListe_CategoriesDiscussion.colonnes.abr:
        aParams.article.abr = aParams.valeur;
        break;
      default:
    }
  }
  getControleCaracteresInput(aParams) {
    return {
      tailleMax:
        aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.abr
          ? 1
          : 1000,
    };
  }
  autoriserChaineVideSurEdition(aParams) {
    return aParams.idColonne === DonneesListe_CategoriesDiscussion.colonnes.abr;
  }
  surCreation(aArticle, V) {
    aArticle.Libelle =
      V[
        this.getNumeroColonneDId(DonneesListe_CategoriesDiscussion.colonnes.nom)
      ];
    aArticle.etiquette = new ObjetElement(aArticle.Libelle);
  }
  getMessageSuppressionConfirmation(aArticle) {
    return aArticle.etiquette && aArticle.etiquette.utilise
      ? GTraductions.getValeur("Messagerie.categorie.CategorieEstUtilisee")
      : "";
  }
  getVisible(aArticle) {
    return aArticle.getEtat() !== EGenreEtat.Creation;
  }
}
DonneesListe_CategoriesDiscussion.colonnes = {
  coche: "coche",
  couleur: "couleur",
  nom: "nom",
  abr: "abr",
};
function _init(aOldListeAffichage) {
  const lListe = new ObjetListeElements();
  this.parametres.listeEtiquettes.parcourir((aEtiquette) => {
    if (
      !TypeOrigineCreationEtiquetteMessageUtil.estEtiquettePerso(
        aEtiquette.getGenre(),
      )
    ) {
      return true;
    }
    const lElement = new ObjetElement(
      aEtiquette.getLibelle(),
      aEtiquette.getNumero(),
    );
    lElement.estPerso = aEtiquette.estPerso;
    lElement.etiquette = aEtiquette;
    lListe.addElement(lElement);
    lElement.coche = ObjetDonneesListe.EGenreCoche.Aucune;
    let lInit = false;
    if (this.parametres.listeMessages) {
      this.parametres.listeMessages.parcourir((aMessage) => {
        let lEtiquetteExiste = null;
        if (aMessage && aMessage.listeEtiquettes) {
          lEtiquetteExiste = aMessage.listeEtiquettes.getElementParNumero(
            aEtiquette.getNumero(),
          );
        }
        if (
          !lEtiquetteExiste &&
          lElement.coche === ObjetDonneesListe.EGenreCoche.Verte
        ) {
          lElement.coche = ObjetDonneesListe.EGenreCoche.Grise;
          return false;
        }
        if (
          lEtiquetteExiste &&
          lElement.coche === ObjetDonneesListe.EGenreCoche.Aucune
        ) {
          lElement.coche = lInit
            ? ObjetDonneesListe.EGenreCoche.Grise
            : ObjetDonneesListe.EGenreCoche.Verte;
        }
        if (lElement.coche === ObjetDonneesListe.EGenreCoche.Grise) {
          return false;
        }
        lInit = true;
      });
    }
    if (aOldListeAffichage) {
      const lOldEtiquette = aOldListeAffichage.getElementParNumeroEtGenre(
        lElement.getNumero(),
      );
      if (
        lOldEtiquette &&
        lOldEtiquette.getEtat() === EGenreEtat.Modification &&
        lElement.coche !== lOldEtiquette.coche
      ) {
        lElement.coche = lOldEtiquette.coche;
        lElement.setEtat(EGenreEtat.Modification);
      }
    }
  });
  return lListe;
}
module.exports = DonneesListe_CategoriesDiscussion;
