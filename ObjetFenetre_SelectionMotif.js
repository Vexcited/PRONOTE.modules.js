const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { MethodesObjet } = require("MethodesObjet.js");
class ObjetFenetre_SelectionMotif extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.aJustifier = false;
    this.avecCoche = false;
    this.droitFonctionnel = GApplication.droits.get(
      TypeDroits.fonctionnalites.saisieEtendueAbsenceDepuisAppel,
    );
    this.setOptionsFenetre({
      largeur: 450,
      hauteur: 600,
      listeBoutons: this.droitFonctionnel
        ? [GTraductions.getValeur("Annuler"), GTraductions.getValeur("Valider")]
        : [GTraductions.getValeur("Annuler")],
    });
    this.boutons = { annuler: 0, valider: 1 };
  }
  construireInstances() {
    this.identListe = this.add(
      ObjetListe,
      _evenementSurListe.bind(this),
      _initialiserListe,
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      getDisplayCbJustifier: function () {
        return (
          aInstance.avecCoche &&
          GApplication.droits.get(
            TypeDroits.fonctionnalites.saisieEtendueAbsenceDepuisAppel,
          )
        );
      },
      cbJustifierMotifDAbsence: {
        getValue: function () {
          return !!aInstance.aJustifier;
        },
        setValue: function (aValeur) {
          aInstance.aJustifier = aValeur;
        },
        getDisabled: function () {
          return !aInstance.selection || !!aInstance.selection.recevable;
        },
      },
    });
  }
  setDonnees(aListe, aAvecCB, aSelection) {
    this.avecCoche = !!aAvecCB;
    this.afficher();
    this.surFixerTaille();
    this.selection = null;
    const lDonneesListe = new DonneesListe_SelectionMotif(
      aListe || new ObjetListeElements(),
    );
    this.getInstance(this.identListe).setDonnees(
      lDonneesListe,
      MethodesObjet.isNumeric(aSelection) ? aSelection : null,
    );
  }
  composeContenu() {
    const T = [];
    T.push('<div class="full-height flex-contain cols">');
    T.push(
      '<div id="' +
        this.getNomInstance(this.identListe) +
        '" class="fluid-bloc"></div>',
    );
    T.push(
      '<div class="PetitEspaceGauche GrandEspaceHaut fix-bloc" ie-if="getDisplayCbJustifier">',
      '<ie-checkbox ie-model="cbJustifierMotifDAbsence">',
      GTraductions.getValeur("AbsenceVS.SelectionnerEtJustifierMotifAbsence"),
      "</ie-checkbox>",
      "</div>",
    );
    T.push("</div>");
    return T.join("");
  }
  surValidation(aNumeroBouton) {
    const lChecked = this.aJustifier;
    this.fermer();
    if (aNumeroBouton !== this.boutons.annuler) {
      if (this.optionsFenetre.callback) {
        this.optionsFenetre.callback(aNumeroBouton, this.selection, lChecked);
      }
      this.callback.appel(aNumeroBouton, this.selection, lChecked);
    }
  }
}
function _initialiserListe(aInstance) {
  aInstance.setOptionsListe({
    colonnes: [{ taille: "100%" }],
    avecListeNeutre: true,
    skin: ObjetListe.skin.flatDesign,
    forcerOmbreScrollBottom: true,
  });
}
function _evenementSurListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection:
      this.selection = aParametres.article;
      this.aJustifier = !!aParametres.article.recevable;
      this.$refreshSelf();
      if (aParametres.surInteractionUtilisateur) {
        if (!this.droitFonctionnel) {
          this.surValidation(this.boutons.valider);
        }
      }
      break;
  }
}
class DonneesListe_SelectionMotif extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecBoutonActionLigne: false,
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
    });
  }
  getZoneGauche(aParams) {
    return aParams.article.couleur
      ? '<div class="couleur ie-line-color static only-color" style="--color-line:' +
          aParams.article.couleur +
          '"></div>'
      : '<div class="m-right"></div>';
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle();
  }
  getClassCelluleConteneur() {
    return "AvecMain";
  }
  getZoneMessage() {
    return "";
  }
  getTri() {
    const lTris = [];
    lTris.push(
      ObjetTri.init((D) => {
        return !D.nonConnu;
      }),
    );
    lTris.push(ObjetTri.init("Libelle"));
    return lTris;
  }
}
DonneesListe_SelectionMotif.colonnes = { libelle: "DLSelectMotif_libelle" };
module.exports = { ObjetFenetre_SelectionMotif };
