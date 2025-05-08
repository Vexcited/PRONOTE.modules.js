const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListe } = require("ObjetListe.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetFenetre_SelectionModeleInfoSond extends ObjetFenetre_Liste {
  constructor(aParamsFenetre) {
    super(aParamsFenetre);
    this.options.filtres = {
      uniquementMesModeles: false,
      categorie: null,
      listeBruteCategories: null,
      listeCategories: null,
    };
    this.setOptionsFenetre({
      modale: true,
      titre:
        aParamsFenetre.options && aParamsFenetre.options.estCasSondage
          ? GTraductions.getValeur("actualites.modeles.ListeSondages")
          : GTraductions.getValeur("actualites.modeles.ListeInfos"),
      largeur: 600,
      hauteur: 700,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
      modeActivationBtnValider: this.modeActivationBtnValider.toujoursActifs,
    });
    this.paramsListe = {
      optionsListe: {
        colonnes: [{ taille: "100%" }],
        boutons: [
          { genre: ObjetListe.typeBouton.deployer },
          { genre: ObjetListe.typeBouton.rechercher },
        ],
        skin: ObjetListe.skin.flatDesign,
      },
    };
  }
  setOptions(aOptions) {
    if (aOptions.filtres && aOptions.filtres.listeBruteCategories) {
      let lListeCategoriesAvecToutes = MethodesObjet.dupliquer(
        aOptions.filtres.listeBruteCategories,
      );
      const lCategorieToutes = new ObjetElement(
        GTraductions.getValeur("actualites.ToutesCategories"),
        0,
      );
      lCategorieToutes.toutesLesCategories = true;
      lListeCategoriesAvecToutes.addElement(lCategorieToutes);
      lListeCategoriesAvecToutes.setTri([
        ObjetTri.init((D) => {
          return !D.toutesLesCategories;
        }),
        ObjetTri.init("Libelle"),
      ]);
      lListeCategoriesAvecToutes.trier();
      $.extend(aOptions.filtres, {
        listeCategories: lListeCategoriesAvecToutes,
      });
    }
    super.setOptions(aOptions);
    return this;
  }
  getControleur() {
    return $.extend(true, super.getControleur(this), {
      filtres: {
        checkUniquementMesModeles: {
          getValue: function () {
            return this.options.filtres.uniquementMesModeles;
          }.bind(this),
          setValue: function (aValue) {
            const lValueCB = !!aValue;
            this.options.filtres.uniquementMesModeles = lValueCB;
            _filtrerListe.call(this);
          }.bind(this),
        },
        labelUniquementMesModeles: function () {
          return GTraductions.getValeur("actualites.uniquementMesModeles");
        },
        comboCategories: {
          init: function (aCombo) {
            aCombo.setOptionsObjetSaisie({
              longueur: 200,
              hauteur: 16,
              hauteurLigneDefault: 16,
              labelWAICellule: GTraductions.getValeur(
                "WAI.ListeSelectionCategorie",
              ),
            });
          },
          getDonnees: function () {
            if (
              this.options.filtres.listeCategories !== null &&
              this.options.filtres.listeCategories !== undefined
            ) {
              return this.options.filtres.listeCategories;
            }
          }.bind(this),
          getIndiceSelection: function () {
            return this.options.filtres.categorie !== null
              ? this.options.filtres.listeCategories.getIndiceParElement(
                  this.options.filtres.categorie,
                )
              : 0;
          }.bind(this),
          event: function (aParametres, aCombo) {
            if (
              aParametres.genreEvenement ===
                EGenreEvenementObjetSaisie.selection &&
              aParametres.element &&
              aCombo.estUneInteractionUtilisateur()
            ) {
              this.options.filtres.categorie = aParametres.element;
              _filtrerListe.call(this);
            }
          }.bind(this),
        },
      },
    });
  }
  composeZoneFiltres() {
    const T = [];
    T.push(
      '<ie-checkbox ie-model="filtres.checkUniquementMesModeles" ie-html="filtres.labelUniquementMesModeles"></ie-checkbox>',
    );
    T.push('<ie-combo ie-model="filtres.comboCategories"></ie-combo>');
    return T.join("");
  }
  composeContenu() {
    const T = [];
    T.push('<div class="flex-contain cols full-size flex-gap-l">');
    T.push(
      '<div class="p-x-l fix-bloc flex-contain flex-wrap justify-between flex-gap">',
    );
    T.push(this.composeZoneFiltres());
    T.push("</div>");
    T.push(
      '<div class="fluid-bloc" id="' +
        this.getNomInstance(this.identListe) +
        '"></div>',
    );
    T.push("</div>");
    return T.join("");
  }
}
function _filtrerListe() {
  const lDonnees = this.getInstance(this.identListe).getListeArticles();
  const lUniquementLesMiens = this.options.filtres.uniquementMesModeles;
  const lCategorie = this.options.filtres.categorie;
  lDonnees.parcourir((aLigne) => {
    const lEstVisibleSelonFiltreMiens =
      lUniquementLesMiens !== true ||
      (aLigne.estModele === true && aLigne.estAuteur === true) ||
      (aLigne.estModele !== true &&
        aLigne.pere &&
        aLigne.pere.estAuteur === true);
    const lEstVisibleSelonCategorie =
      lCategorie === null ||
      lCategorie === undefined ||
      !lCategorie.existeNumero() ||
      (aLigne.estModele === true &&
        aLigne.categorie.getNumero() === lCategorie.getNumero()) ||
      (aLigne.estModele !== true &&
        aLigne.pere &&
        aLigne.pere.categorie.getNumero() === lCategorie.getNumero());
    aLigne.visible = lEstVisibleSelonFiltreMiens && lEstVisibleSelonCategorie;
  });
  this.actualiserListe();
}
module.exports = { ObjetFenetre_SelectionModeleInfoSond };
