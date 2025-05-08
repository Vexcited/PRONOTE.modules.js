const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { UtilitaireFicheStage } = require("UtilitaireFicheStage.js");
class PageSuiviStage_Mobile extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.initParametres();
  }
  initParametres() {
    this.parametres = { avecEditionSuivisDeStage: false };
  }
  setParametres(aParametres) {
    $.extend(this.parametres, aParametres);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      retourPrec: {
        event: function () {
          aInstance.callback.appel();
        },
      },
    });
  }
  setDonnees(aSuivi, aStage, aParam) {
    this.suivi = aSuivi;
    this.stage = aStage;
    (this.evenements = aParam.evenements),
      (this.lieux = aParam.lieux),
      (this.controleur = {});
    this.controleur = this.getControleur(this);
    this.afficher();
  }
  construireAffichage() {
    const H = [];
    if (this.suivi) {
      H.push('<div class="conteneur-FicheStage">');
      H.push(
        UtilitaireFicheStage.composeSurSuivi(this.suivi, {
          parametres: this.parametres,
          controleur: this.controleur,
          stage: this.stage,
          evenements: this.evenements,
          lieux: this.lieux,
          pere: this.Nom,
        }),
      );
      H.push("</div>");
    }
    return H.join("");
  }
  actionSurValidation(aParamCallBack) {
    if (aParamCallBack) {
      this.callback.appel({ suivi: aParamCallBack.suivi, stage: this.stage });
    } else {
      this.callback.appel();
    }
  }
}
module.exports = { PageSuiviStage_Mobile };
