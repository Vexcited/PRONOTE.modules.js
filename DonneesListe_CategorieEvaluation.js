const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
class DonneesListe_CategorieEvaluation extends ObjetDonneesListeFlatDesign {
  constructor(aParams) {
    super(aParams.listeCategories);
    this.avecFiltre = aParams.filtreMesCategories;
    this.tailleMax = aParams.tailleMax;
    this.estEditable = aParams.estEditable;
    this.setOptions({
      avecEvnt_Creation: true,
      avecEvnt_Selection: true,
      avecEvnt_SelectionClick: true,
      avecEvnt_Suppression: true,
      avecInterruptionSuppression: true,
      flatDesignMinimal: true,
      avecCB: aParams.avecCB,
    });
    this.creerIndexUnique("Libelle");
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle();
  }
  getInfosSuppZonePrincipale(aParams) {
    return aParams.article.proprietaire ? aParams.article.proprietaire : "";
  }
  getZoneGauche(aParams) {
    return aParams.article.couleur
      ? '<div style="' +
          GStyle.composeCouleurFond(aParams.article.couleur) +
          'height:2rem;padding:0.2rem;border-radius:0.4rem;"></div>'
      : '<div style="margin-right:0.4rem"></div>';
  }
  getValueCB(aParams) {
    return aParams.article ? aParams.article.coche : false;
  }
  setValueCB(aParams, aValue) {
    aParams.article.coche = aValue;
  }
  avecMenuContextuel(aParams) {
    return (
      this.estEditable &&
      !!aParams.article &&
      aParams.article.estEditable &&
      !GApplication.droits.get(TypeDroits.estEnConsultation)
    );
  }
  avecBoutonActionLigne(aParams) {
    return (
      this.estEditable &&
      !!aParams.article &&
      aParams.article.estEditable &&
      !GApplication.droits.get(TypeDroits.estEnConsultation)
    );
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (this.estEditable) {
      aParametres.menuContextuel.add(
        GTraductions.getValeur("Modifier"),
        true,
        function () {
          this.callback.appel({
            article: aParametres.article,
            genreEvenement: EGenreEvenementListe.Edition,
          });
        },
        { icon: "icon_pencil" },
      );
      if (this.options.avecCB) {
        aParametres.menuContextuel.add(
          !aParametres.article.coche
            ? GTraductions.getValeur("FenetreCategorieEvaluation.selectionner")
            : GTraductions.getValeur(
                "FenetreCategorieEvaluation.deselectionner",
              ),
          true,
          function () {
            aParametres.article.coche = !aParametres.article.coche;
            this.actualiser();
          },
          {
            icon: !aParametres.article.coche
              ? "icon_ok"
              : "icon_fermeture_widget",
          },
        );
      }
      aParametres.menuContextuel.add(
        GTraductions.getValeur("Supprimer"),
        true,
        function () {
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: GTraductions.getValeur(
              "FenetreCategorieEvaluation.confSupprCategorie",
            ),
            callback: function (aGenreAction) {
              if (aGenreAction === EGenreAction.Valider) {
                this.callback.appel({
                  article: aParametres.article,
                  genreEvenement: EGenreEvenementListe.Suppression,
                });
              }
            }.bind(this),
          });
        },
        { icon: "icon_trash" },
      );
    }
    aParametres.menuContextuel.setDonnees();
  }
  getVisible(aArticle) {
    const lVisible = this.avecFiltre ? aArticle.filtreMesCategories : true;
    return aArticle.getEtat() !== EGenreEtat.Suppression && lVisible;
  }
}
module.exports = { DonneesListe_CategorieEvaluation };
