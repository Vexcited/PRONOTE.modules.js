const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListe } = require("ObjetListe.js");
const { DonneesListe_SuiviStage } = require("DonneesListe_SuiviStage.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { UtilitaireFicheStage } = require("UtilitaireFicheStage.js");
const { tag } = require("tag.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreAffichageFicheStage } = require("Enumere_AffichageFicheStage.js");
class PageFicheStage extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.initParametres();
    this.idSurSuivi = this.Nom + "_surSuivi";
  }
  construireInstances() {
    this.identListeSuivis = this.add(
      ObjetListe,
      evenementListeSuivis.bind(this),
      _initialiserListeSuivis,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
  }
  initParametres() {
    this.parametres = {
      avecEdition: false,
      avecEditionDocumentsJoints: false,
      avecEditionSuivisDeStage: false,
    };
  }
  setParametres(aParametres) {
    $.extend(this.parametres, aParametres);
  }
  setDonnees(aDonnees) {
    this.donnees = aDonnees.stage;
    this.listePJ = aDonnees.pj;
    this.selectOngletStage = aDonnees.genreOnglet;
    (this.evenements = aDonnees.evenements),
      (this.lieux = aDonnees.lieux),
      (this.parametres.listeSujetsStage = aDonnees.listeSujetsStage),
      (this.dateFinSaisieSuivi = aDonnees.dateFinSaisieSuivi);
    this.initControleur = Object.assign({}, this.controleur);
    this.controleur = {};
    this.controleur = this.getControleur(this);
    this.afficher();
    if (
      !!this.donnees &&
      this.selectOngletStage === EGenreAffichageFicheStage.Suivi
    ) {
      if (!!this.donnees.suiviStage) {
        const lThis = this;
        this.donnees.suiviStage.parcourir((aSuivi) => {
          if (!!lThis.evenements && !!aSuivi.evenement) {
            const lEvenementDeListeComplete =
              lThis.evenements.getElementParNumero(
                aSuivi.evenement.getNumero(),
              );
            if (!!lEvenementDeListeComplete) {
              aSuivi.evenement = lEvenementDeListeComplete;
            }
          }
          if (!!lThis.lieux && !!aSuivi.lieu) {
            const lLieuDeListeComplete = lThis.lieux.getElementParNumero(
              aSuivi.lieu.getNumero(),
            );
            if (!!lLieuDeListeComplete) {
              aSuivi.lieu = lLieuDeListeComplete;
            }
          }
        });
      }
      this.getInstance(this.identListeSuivis).setOptionsListe({
        messageContenuVide: GTraductions.getValeur(
          "FicheStage.listeSuivis.AucunSuivi",
        ),
        avecLigneCreation: this.parametres.avecEditionSuivisDeStage,
      });
      this.getInstance(this.identListeSuivis).setDonnees(
        new DonneesListe_SuiviStage(this.donnees.suiviStage, this.parametres),
      );
      if (
        !!this.suivi &&
        !!this.donnees.suiviStage.getElementParNumero(this.suivi.getNumero())
      ) {
        this.getInstance(this.identListeSuivis).selectionnerLigne({
          ligne: this.donnees.suiviStage.getIndiceParElement(this.suivi),
          avecEvenement: true,
        });
      }
    }
  }
  construireAffichage() {
    if (!this.donnees) {
      return "";
    }
    const H = [];
    if (this.selectOngletStage !== EGenreAffichageFicheStage.Suivi) {
      H.push('<div class="conteneur-FicheStage">');
      switch (this.selectOngletStage) {
        case EGenreAffichageFicheStage.Details:
          H.push(
            UtilitaireFicheStage.composeBlocDetails(this.donnees, {
              parametres: this.parametres,
              controleur: this.controleur,
            }),
          );
          break;
        case EGenreAffichageFicheStage.Annexe:
          H.push(
            UtilitaireFicheStage.composeBlocAnnexe(this.donnees, {
              parametres: this.parametres,
              controleur: this.controleur,
            }),
          );
          break;
        case EGenreAffichageFicheStage.Appreciations:
          H.push(
            UtilitaireFicheStage.composeBlocAppreciations(this.donnees, {
              parametres: this.parametres,
              controleur: this.controleur,
            }),
          );
          break;
        default:
          break;
      }
      H.push("</div>");
    } else {
      H.push(
        tag(
          "div",
          { class: "flex-contain onglet-suivi" },
          tag("div", {
            class: "conteneur-liste-suivi",
            id: this.getInstance(this.identListeSuivis).getNom(),
          }),
          tag("div", {
            class: "conteneur-FicheStage",
            id: this.idSurSuivi,
            tabindex: "0",
          }),
        ),
      );
    }
    return H.join("");
  }
  actualiserListeSuivis(aSuiviSelectionne) {
    this.getInstance(this.identListeSuivis).actualiser();
    this.getInstance(this.identListeSuivis).setListeElementsSelection(
      new ObjetListeElements().add(aSuiviSelectionne),
    );
  }
  actionSurValidation() {
    this.callback.appel();
  }
}
function _initialiserListeSuivis(aInstance) {
  const lColonnes = [{ id: "PageFicheStage_ListeSuivis", taille: "100%" }];
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    skin: ObjetListe.skin.flatDesign,
    avecOmbreDroite: true,
    hauteurZoneContenuListeMin: 200,
    titreCreation: GTraductions.getValeur("FenetreSuiviStage.NouveauSuivi"),
  });
}
function evenementListeSuivis(aParams) {
  switch (aParams.genreEvenement) {
    case EGenreEvenementListe.Creation:
      UtilitaireFicheStage.composeFenetreCreerSuivi(this);
      break;
    case EGenreEvenementListe.Selection:
      this.suivi = aParams.article;
      this.controleur = Object.assign({}, this.initControleur);
      GHtml.setHtml(
        this.idSurSuivi,
        UtilitaireFicheStage.composeSurSuivi(this.suivi, {
          parametres: this.parametres,
          controleur: this.controleur,
          stage: this.donnees,
          evenements: this.evenements,
          lieux: this.lieux,
          pere: this.Nom,
        }),
        this.controleur,
      );
      GHtml.setFocus(this.idSurSuivi);
      break;
  }
}
module.exports = { PageFicheStage };
