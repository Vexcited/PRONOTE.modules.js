const {
  DonneesListe_RattachementCDT,
} = require("DonneesListe_RattachementCDT.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_RattachementCDT extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identListeCDT = this.add(
      ObjetListe,
      this.evenementSurlisteCDT,
      this.initialiserlisteCDT,
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnSupprimer: {
        event() {
          aInstance.evenementSurBoutonSupprimer();
        },
        getDisabled() {
          return !aInstance.selectionCourante;
        },
      },
    });
  }
  setDonnees(alisteCDT, aAvecDrag, aOptionsDrag) {
    this.listeCDT = alisteCDT;
    this.avecDrag = aAvecDrag;
    this.optionsDrag = $.extend(
      { callbackDragStart: null, callbackDragStop: null },
      aOptionsDrag,
    );
    this.actualiser();
    this.afficher();
    this.setBoutonActif(1, false);
    if (this.avecDrag) {
      this.setBoutonVisible(1, false);
    }
    this._actualiserListe();
  }
  composeContenu() {
    const T = [];
    let lHeightListe = this.optionsFenetre.hauteur - 23 - 30 - 5;
    if (this.avecDrag) {
      lHeightListe = lHeightListe - 32;
      T.push(
        '<div class="Texte10" style="height: 32px;">',
        GTraductions.getValeur("CahierDeTexte.Rattachement.DragDrop"),
        "</div>",
      );
    } else {
      lHeightListe = lHeightListe - 18;
      T.push(
        '<div class="Texte10" style="height: 18px;">',
        GTraductions.getValeur("CahierDeTexte.Rattachement.Selection"),
        "</div>",
      );
    }
    T.push(
      '<div id="' +
        this.getNomInstance(this.identListeCDT) +
        '" style="width: 100%; height: ',
      lHeightListe,
      'px;"></div>',
    );
    return T.join("");
  }
  composeBas() {
    const T = [];
    T.push(
      '<ie-bouton ie-model="btnSupprimer">',
      GTraductions.getValeur("CahierDeTexte.Rattachement.SupprimerCDTSelect"),
      "</ie-bouton>",
    );
    return T.join("");
  }
  initialiserlisteCDT(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_RattachementCDT.colonnes.Classe,
      titre: GTraductions.getValeur("CahierDeTexte.Rattachement.ClasseGroupe"),
      taille: 100,
    });
    lColonnes.push({
      id: DonneesListe_RattachementCDT.colonnes.Titre,
      titre: GTraductions.getValeur("CahierDeTexte.titre"),
      taille: "100%",
    });
    lColonnes.push({
      id: DonneesListe_RattachementCDT.colonnes.Categorie,
      titre: GTraductions.getValeur("CahierDeTexte.categorie"),
      taille: 100,
    });
    lColonnes.push({
      id: DonneesListe_RattachementCDT.colonnes.NbrTAF,
      titre: GTraductions.getValeur("CahierDeTexte.Rattachement.Travail"),
      taille: 40,
    });
    lColonnes.push({
      id: DonneesListe_RattachementCDT.colonnes.Date,
      titre: GTraductions.getValeur("CahierDeTexte.Rattachement.AncienCours"),
      taille: 100,
    });
    aInstance.setOptionsListe({ colonnes: lColonnes });
  }
  surValidation(aGenreBouton) {
    if (aGenreBouton < 2) {
      this.fermer();
    }
    this.callback.appel(aGenreBouton, this.selectionCourante);
  }
  evenementSurBoutonSupprimer() {
    GApplication.getMessage().afficher({
      type: EGenreBoiteMessage.Confirmation,
      message: GTraductions.getValeur("CahierDeTexte.ConfirmerSuppressionCDT"),
      callback: this._apresConfirmationSuppressionCDT.bind(this),
    });
  }
  _apresConfirmationSuppressionCDT(aGenreBouton) {
    if (aGenreBouton === EGenreAction.Valider) {
      this.selectionCourante.setEtat(EGenreEtat.Suppression);
      this.getInstance(this.identListeCDT).actualiser();
    }
  }
  evenementSurlisteCDT(aParametres) {
    switch (aParametres.genreEvenement) {
      case EGenreEvenementListe.Selection:
        this.selectionCourante = aParametres.article;
        if (!this.avecDrag) {
          this.setBoutonActif(1, true);
        }
        break;
      case EGenreEvenementListe.ApresSuppression:
        this.setBoutonActif(1, false);
        this.setEtatSaisie(false);
        break;
    }
  }
  _actualiserListe() {
    this.getInstance(this.identListeCDT).setDonnees(
      new DonneesListe_RattachementCDT(
        this.listeCDT,
        this.avecDrag,
        this,
        this._evenementSurMenuContextuelListe.bind(this),
        this.optionsDrag,
      ),
    );
  }
  _evenementSurMenuContextuelListe(aLigne) {
    switch (aLigne.getGenre()) {
      case 1:
        this.surValidation(2);
        break;
      default:
        break;
    }
  }
}
module.exports = { ObjetFenetre_RattachementCDT };
