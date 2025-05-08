const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_ParamSaisieNotes extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.afficherProjetsAccompagnement = false;
    this.afficherMoyenneBrute = false;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      checkAfficherProjetsAccompagnement: {
        getValue: function () {
          return aInstance.afficherProjetsAccompagnement;
        },
        setValue: function (aData) {
          aInstance.afficherProjetsAccompagnement = aData;
        },
      },
      checkAfficherMoyenneBrute: {
        getValue: function () {
          return aInstance.afficherMoyenneBrute;
        },
        setValue: function (aData) {
          aInstance.afficherMoyenneBrute = aData;
        },
      },
    });
  }
  composeContenu() {
    const T = [];
    T.push('<div class="Espace">');
    T.push(
      "<div>",
      '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherProjetsAccompagnement">',
      GTraductions.getValeur(
        "Notes.FenetreParametrageAffichage.AfficherProjetsAccompagnement",
      ),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      '<div class="EspaceHaut">',
      '<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherMoyenneBrute">',
      GTraductions.getValeur(
        "Notes.FenetreParametrageAffichage.AfficherMoyenneBrute",
      ),
      "</ie-checkbox>",
      "</div>",
    );
    T.push("</div>");
    return T.join("");
  }
  setDonnees(aDonnees) {
    this.afficherProjetsAccompagnement = aDonnees.afficherProjetsAccompagnement;
    this.afficherMoyenneBrute = aDonnees.afficherMoyenneBrute;
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton, {
      afficherProjetsAccompagnement: this.afficherProjetsAccompagnement,
      afficherMoyenneBrute: this.afficherMoyenneBrute,
    });
  }
}
module.exports = { ObjetFenetre_ParamSaisieNotes };
