const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GPosition } = require("ObjetPosition.js");
const { GStyle } = require("ObjetStyle.js");
const { Identite } = require("ObjetIdentite.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
class ObjetZoneTexte extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.idTable = this.Nom + "_IdTable";
    this.idLibelle = this.Nom + "_IdLibelle";
    this.IdPremierElement = this.idLibelle;
    this.avecRetaillage = false;
    this.couleurTexte = GCouleur.texte;
    this._options = { largeur: null, describedby: "" };
  }
  setOptionsObjetZoneTexte(aOptions) {
    $.extend(this._options, aOptions);
  }
  setParametres(aAvecRetaillage, aCouleurTexte) {
    this.avecRetaillage = aAvecRetaillage;
    this.couleurTexte = aCouleurTexte ? aCouleurTexte : this.couleurTexte;
  }
  construireAffichage() {
    const H = [];
    H.push(
      '<div id="' + this.idTable + '" ',
      this._options.largeur
        ? ' style="' + GStyle.composeWidth(this._options.largeur) + '"'
        : "",
      ">",
    );
    H.push(
      "<span ",
      this._options.describedby
        ? GObjetWAI.composeAttribut({
            genre: EGenreAttribut.describedby,
            valeur: this._options.describedby + " " + this.idLibelle,
          })
        : "",
      ' id="' +
        this.idLibelle +
        '" class="Texte10 Gras Insecable" style="' +
        GStyle.composeCouleurTexte(this.couleurTexte) +
        '"></span>',
    );
    H.push("</div>");
    return H.join("");
  }
  setDonnees(aLibelle) {
    if (this.avecRetaillage) {
      GPosition.setWidth(
        this.idTable,
        GChaine.getLongueurChaine(aLibelle, 10, true) + 4,
      );
    }
    const lTab = aLibelle ? aLibelle.split("\n") : [];
    this.Libelle = lTab.join("<br>");
    GHtml.setHtml(this.idLibelle, this.Libelle, {
      controleur: this.controleur,
    });
    const lThis = this;
    $("#" + this.idLibelle.escapeJQ())
      .on("focusin", function () {
        $(this).css("box-shadow", "0 0 5px -1px " + lThis.couleurTexte);
      })
      .on("focusout", function () {
        $(this).css("box-shadow", "none");
      });
  }
  setTabIndex(aTabIndex) {
    GHtml.setTabIndex(this.idLibelle, aTabIndex);
  }
}
module.exports = { ObjetZoneTexte };
