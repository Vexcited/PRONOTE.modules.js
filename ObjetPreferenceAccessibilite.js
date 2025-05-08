const { GTraductions } = require("ObjetTraduction.js");
const { Identite } = require("ObjetIdentite.js");
class ObjetPreferenceAccessibilite extends Identite {
  constructor(...aParams) {
    super(...aParams);
  }
  getControleur() {
    return $.extend(true, super.getControleur(this), {
      cbRemplacerPastillesCompetences: {
        getValue: function () {
          return GEtatUtilisateur.estAvecCodeCompetences();
        },
        setValue: function (aValue) {
          GEtatUtilisateur.setAvecCodeCompetences(aValue);
        },
        getLibelle: function () {
          return GTraductions.getValeur(
            "infosperso.RemplacerPastillesCompetences",
          );
        },
      },
      cbThemeAccessible: {
        getValue: function () {
          return GEtatUtilisateur.estAvecThemeAccessible();
        },
        setValue: function (aValue) {
          GEtatUtilisateur.setAvecThemeAccessible(aValue);
        },
        getLibelle: function () {
          return GTraductions.getValeur(
            "ParametresUtilisateur.AppliquerThemeAccessible",
          );
        },
      },
    });
  }
  construireAffichage() {
    const H = [];
    H.push(`<ie-checkbox ie-model="cbRemplacerPastillesCompetences"></ie-checkbox>\n              <ie-checkbox ie-model="cbThemeAccessible"></ie-checkbox>\n              ${""}
            `);
    return H.join("");
  }
}
module.exports = { ObjetPreferenceAccessibilite };
