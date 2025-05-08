const { GStyle } = require("ObjetStyle.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeNiveauDifficulteUtil } = require("TypeNiveauDifficulte.js");
const { GUID } = require("GUID.js");
class ObjetFenetre_ParametrageTAF extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      titre: GTraductions.getValeur(
        "CahierDeTexte.paramTaf.SaisieTAFsPreferences",
      ),
      listeBoutons: [GTraductions.getValeur("Fermer")],
      largeur: 400,
    });
  }
  getControleur() {
    this.duree = GApplication.parametresUtilisateur.get("CDT.TAF.Duree");
    let lValueInput = this.duree;
    return $.extend(true, super.getControleur(this), {
      cbMiseEnForme: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.TAF.ActiverMiseEnForme",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.TAF.ActiverMiseEnForme",
            aValue,
          );
        },
      },
      rbDuree: {
        getValue: function (aEstAucune) {
          return aEstAucune
            ? this.instance.duree === 0
            : this.instance.duree > 0;
        },
        setValue: function (aEstAucune) {
          if (aEstAucune) {
            this.instance.duree = 0;
          } else {
            lValueInput =
              lValueInput || ObjetFenetre_ParametrageTAF.cDureeDefaut;
            this.instance.duree = lValueInput;
          }
          GApplication.parametresUtilisateur.set(
            "CDT.TAF.Duree",
            this.instance.duree,
          );
        },
      },
      inputDuree: {
        getValue: function () {
          return lValueInput || ObjetFenetre_ParametrageTAF.cDureeDefaut;
        },
        setValue: function (aValue) {
          lValueInput = aValue;
        },
        exitChange: function () {
          lValueInput = this.instance.duree = parseInt(lValueInput || 0, 10);
          GApplication.parametresUtilisateur.set(
            "CDT.TAF.Duree",
            this.instance.duree,
          );
        },
        getDisabled: function () {
          return this.instance.duree === 0;
        },
      },
      getStyleMinutes: function () {
        return {
          color:
            this.instance.duree === 0
              ? GCouleur.nonEditable.texte
              : GCouleur.noir,
        };
      },
      comboNiveau: {
        init: function (aInstance) {
          aInstance.setOptionsObjetSaisie({
            labelWAICellule: GTraductions.getValeur(
              "CahierDeTexte.paramTaf.NiveauDifficulteParDef",
            ),
          });
        },
        getDonnees: function (aDonnees) {
          if (aDonnees) {
            return;
          }
          if (!this.instance.listeNiveaux) {
            this.instance.listeNiveaux = TypeNiveauDifficulteUtil.toListe();
          }
          return this.instance.listeNiveaux;
        },
        getIndiceSelection: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.TAF.NiveauDifficulte",
          );
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement ===
              EGenreEvenementObjetSaisie.selection &&
            aParametres.element
          ) {
            GApplication.parametresUtilisateur.set(
              "CDT.TAF.NiveauDifficulte",
              aParametres.element.getGenre(),
            );
          }
        },
      },
    });
  }
  composeContenu() {
    const H = [],
      lLargeurLibelle = 160;
    H.push('<div class="Espace">');
    H.push(
      "<div>",
      '<ie-checkbox ie-model="cbMiseEnForme">',
      GTraductions.getValeur("CahierDeTexte.paramTaf.ActiverMiseEnForme"),
      "</ie-checkbox>",
      "</div>",
    );
    const lIdLegend = GUID.getId();
    const lIdMinutes = GUID.getId();
    H.push(
      '<div role="group" class="EspaceHaut NoWrap" aria-labelledby="',
      lIdLegend,
      '">',
      '<div id="',
      lIdLegend,
      '" class="InlineBlock AlignementMilieuVertical" style="',
      GStyle.composeWidth(lLargeurLibelle),
      '">',
      GTraductions.getValeur("CahierDeTexte.paramTaf.DureeEstimeeParDef"),
      "</div>",
      '<div class="InlineBlock AlignementMilieuVertical PetitEspaceDroit">',
      '<ie-radio ie-model="rbDuree(false)">',
      '<input aria-labelledby="',
      lIdMinutes,
      '" ie-model="inputDuree" ie-mask="/[^0-9]/i" maxlength="10" class="CelluleTexte" style="',
      GStyle.composeWidth(40),
      '"/>',
      '<span id="',
      lIdMinutes,
      '" class="EspaceGauche" ie-style="getStyleMinutes">',
      GTraductions.getValeur("CahierDeTexte.paramTaf.DureeMinutes"),
      "</span>",
      "</ie-radio>",
      "</div>",
      '<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
      '<ie-radio ie-model="rbDuree(true)">',
      GTraductions.getValeur("Aucune"),
      "</ie-radio>",
      "</div>",
      "</div>",
    );
    H.push(
      '<div class="EspaceHaut NoWrap">',
      '<div class="InlineBlock AlignementMilieuVertical" style="',
      GStyle.composeWidth(lLargeurLibelle),
      '">',
      GTraductions.getValeur("CahierDeTexte.paramTaf.NiveauDifficulteParDef"),
      "</div>",
      '<div class="InlineBlock AlignementMilieuVertical">',
      '<ie-combo ie-model="comboNiveau"></ie-combo>',
      "</div>",
      "</div>",
    );
    H.push("</div>");
    return H.join("");
  }
}
ObjetFenetre_ParametrageTAF.cDureeDefaut = 15;
module.exports = { ObjetFenetre_ParametrageTAF };
