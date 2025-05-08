const { Identite } = require("ObjetIdentite.js");
const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetCompte_AutorisationSortie extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.donneesRecues = false;
    this.param = { sortieAutorisee: false };
  }
  setDonnees(aParam) {
    $.extend(this.param, aParam);
    this.donneesRecues = true;
    GHtml.setHtml(this.Nom, this.construireAffichage(), {
      controleur: this.controleur,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      switchAutoriserSortie: {
        getValue: function () {
          return aInstance.param.sortieAutorisee;
        },
        setValue: function (aValeur) {
          aInstance.param.sortieAutorisee = aValeur;
          aInstance.declencherCallback({ estAutorise: aValeur });
        },
      },
    });
  }
  construireAffichage() {
    if (this.donneesRecues) {
      return _composeAutorisationSortie.call(this);
    }
    return "";
  }
  getTitre() {
    return GTraductions.getValeur(
      "InfosEnfantPrim.autoriseSortie.titreRubrique",
    );
  }
  declencherCallback(aParam) {
    if (this.Pere && this.Evenement) {
      this.callback.appel(aParam);
    }
  }
}
function _composeAutorisationSortie() {
  const H = [];
  H.push('<div class="NoWrap">');
  H.push(
    '<ie-switch ie-model="switchAutoriserSortie">',
    GTraductions.getValeur(
      "InfosEnfantPrim.autoriseSortie.libelleAutorisation",
    ),
    "</ie-switch>",
  );
  H.push("</div>");
  return H.join("");
}
module.exports = { ObjetCompte_AutorisationSortie };
