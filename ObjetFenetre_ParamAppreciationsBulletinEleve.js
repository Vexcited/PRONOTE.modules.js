const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  ObjetFenetre_CategorieEvaluation,
} = require("ObjetFenetre_CategorieEvaluation.js");
class ObjetFenetre_ParamAppreciationsBulletinEleve extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.afficherPeriodeVerticale = false;
    this.afficherCoefficientZero = true;
    this.afficherDevoirsEvalPdB = true;
    this.afficherAbsencePdB = true;
    this.afficherRetardPdB = true;
    this.afficherCategorie = false;
    this.afficherPeriode = new ObjetListeElements();
    this.listeCategoriesSelectionnees = new ObjetListeElements();
    this.nbTotalCategorie = 0;
    this.nbCategorieSelectionnees = 0;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      checkAfficherPeriode: {
        getValue: function (index) {
          return aInstance.afficherPeriode.get(index).visible;
        },
        setValue: function (index, aData) {
          aInstance.afficherPeriode.get(index).visible = aData;
        },
      },
      checkAfficherPeriodeVerticale: {
        getValue: function () {
          return aInstance.afficherPeriodeVerticale;
        },
        setValue: function (aData) {
          aInstance.afficherPeriodeVerticale = aData;
        },
      },
      checkAfficherCoefficientZero: {
        getValue: function () {
          return aInstance.afficherCoefficientZero;
        },
        setValue: function (aData) {
          aInstance.afficherCoefficientZero = aData;
        },
      },
      checkAfficherDevoirEvalPdB: {
        getValue: function () {
          return aInstance.afficherDevoirsEvalPdB;
        },
        setValue: function (aData) {
          aInstance.afficherDevoirsEvalPdB = aData;
        },
      },
      checkAfficherAbsencePdB: {
        getValue: function () {
          return aInstance.afficherAbsencePdB;
        },
        setValue: function (aData) {
          aInstance.afficherAbsencePdB = aData;
        },
      },
      checkAfficherRetardPdb: {
        getValue: function () {
          return aInstance.afficherRetardPdB;
        },
        setValue: function (aData) {
          aInstance.afficherRetardPdB = aData;
        },
      },
      checkAfficherCategories: {
        getValue: function () {
          return aInstance.afficherCategorie;
        },
        setValue: function (aData) {
          aInstance.afficherCategorie = aData;
        },
      },
      btnClasse: {
        event: function () {
          const lInstance = ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_CategorieEvaluation,
            { pere: this.instance, evenement: _surEvenementFenetreCategories },
          );
          lInstance.setDonnees({
            avecMultiSelection: true,
            avecCreation: false,
            listeCategories: this.instance.listeCategoriesSelectionnees,
          });
        },
        getDisabled: function () {
          return !this.instance.afficherCategorie;
        },
      },
      getLibelleCategorie: function () {
        const lLibelle =
          aInstance.nbCategorieSelectionnees === aInstance.nbTotalCategorie
            ? GTraductions.getValeur("toutes")
            : aInstance.nbCategorieSelectionnees === 0
              ? GTraductions.getValeur("Aucune")
              : aInstance.nbCategorieSelectionnees +
                "/" +
                aInstance.nbTotalCategorie;
        return lLibelle;
      },
    });
  }
  composeContenu() {
    const T = [];
    T.push('<div class="Espace">');
    T.push('<div class="EspaceBas10">');
    T.push(
      '<fieldset class="Bordure m-bottom-l">',
      "<legend>",
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.PersonnalisationPeriode",
      ),
      "</legend>",
    );
    if (this.afficherPeriode) {
      this.afficherPeriode.parcourir((element, index) => {
        T.push(
          '<div class="EspaceHaut EspaceBas10">',
          '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherPeriode(' +
            index +
            ')">',
          GTraductions.getValeur(
            "AppreciationsBulletinEleve.FenetreParametrageAffichage.AfficherPeriode",
            [element.periode.getLibelle()],
          ),
          "</ie-checkbox>",
          "</div>",
        );
      });
    }
    T.push(
      '<div class="EspaceHaut">',
      '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherPeriodeVerticale">',
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.AfficherPeriodeVerticale",
      ),
      "</ie-checkbox>",
      "</div>",
    );
    T.push("</fieldset>");
    T.push(
      '<fieldset class="EspaceBas10 Bordure">',
      "<legend>",
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.PersonnalisationDevoirsEvals",
      ),
      "</legend>",
    );
    T.push(
      '<div class="EspaceHaut">',
      '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherCoefficientZero">',
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.AfficherCoefficientZero",
      ),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      '<div class="EspaceHaut">',
      '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherCategories">',
      '<span class="EspaceDroit">',
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.AfficherDevoirsCategories",
      ),
      "</span>",
      '<ie-bouton ie-model="btnClasse" class="EspaceDroit"><i class="btnImageIcon icon_ellipsis_horizontal"></i></ie-bouton>',
      '<span class="EspaceGauche" ie-html="getLibelleCategorie"></span>',
      "</ie-checkbox>",
      "</div>",
    );
    T.push("</div>");
    T.push("</fieldset>");
    T.push(
      '<fieldset class="EspaceHaut Bordure">',
      "<legend>",
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.PersonnalisationAppreciations",
      ),
      "</legend>",
    );
    T.push('<div class="EspaceHaut">');
    T.push(
      "<div>",
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.ColonnesComplementaires",
      ),
      "</div>",
    );
    T.push('<div class="PetitEspaceHaut GrandEspaceGauche">');
    T.push(
      '<div class="EspaceHaut">',
      '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherDevoirEvalPdB">',
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.AfficherDevoirsEvals",
      ),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      '<div class="EspaceHaut">',
      '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherAbsencePdB">',
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.AfficherAbsences",
      ),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      '<div class="EspaceHaut">',
      '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherRetardPdb">',
      GTraductions.getValeur(
        "AppreciationsBulletinEleve.FenetreParametrageAffichage.AfficherRetards",
      ),
      "</ie-checkbox>",
      "</div>",
    );
    T.push("</div>", "</div>");
    T.push("</fieldset>");
    return T.join("");
  }
  setDonnees(aDonnees) {
    this.afficherPeriodeVerticale = aDonnees.afficherPeriodeVerticale;
    this.afficherCoefficientZero = aDonnees.afficherCoefficientZero;
    this.afficherDevoirsEvalPdB = aDonnees.afficherDevoirsEvalPdB;
    this.afficherAbsencePdB = aDonnees.afficherAbsencePdB;
    this.afficherRetardPdB = aDonnees.afficherRetardPdB;
    this.afficherPeriode = aDonnees.afficherPeriode;
    this.afficherCategorie = aDonnees.afficherCategorie;
    this.listeCategoriesSelectionnees = aDonnees.listeCategoriesSelectionnees;
    const lListeDonnee = aDonnees.listeCategoriesSelectionnees.getListeElements(
      (aElement) => {
        return aElement.coche;
      },
    );
    this.nbTotalCategorie = aDonnees.listeCategoriesSelectionnees.count();
    this.nbCategorieSelectionnees = lListeDonnee.count();
    this.afficher(this.composeContenu());
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton, {
      afficherPeriodeVerticale: this.afficherPeriodeVerticale,
      afficherCoefficientZero: this.afficherCoefficientZero,
      afficherPeriode: this.afficherPeriode,
      afficherDevoirsEvalPdB: this.afficherDevoirsEvalPdB,
      afficherAbsencePdB: this.afficherAbsencePdB,
      afficherRetardPdB: this.afficherRetardPdB,
      afficherCategorie: this.afficherCategorie,
      listeCategoriesSelectionnees: this.listeCategoriesSelectionnees,
    });
  }
}
function _surEvenementFenetreCategories(aParam) {
  this.nbTotalCategorie = aParam.nbCategorieTotal;
  this.nbCategorieSelectionnees = aParam.nbCategorieSelectionnees;
  this.listeCategoriesSelectionnees = aParam.listeCategoriesSelectionnees;
}
module.exports = { ObjetFenetre_ParamAppreciationsBulletinEleve };
