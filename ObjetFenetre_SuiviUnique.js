const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  InterfaceSuivisAbsenceRetard,
} = require("InterfaceSuivisAbsenceRetard.js");
class ObjetFenetre_SuiviUnique extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      hauteur: 350,
      largeur: 760,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
    this.etatSaisie = false;
  }
  getControleur() {
    return $.extend(true, super.getControleur(this), {
      fenetreBtn: {
        getDisabled: function (aBoutonRepeat) {
          if (aBoutonRepeat.element.index === 0) {
            return false;
          }
          return !this.instance.etatSaisie;
        },
      },
    });
  }
  construireInstances() {
    this.identSuivi = this.add(InterfaceSuivisAbsenceRetard);
  }
  composeContenu() {
    const T = [];
    T.push(
      '<div id="',
      this.getInstance(this.identSuivi).getNom(),
      '" style="height:100%"></div>',
    );
    return T.join("");
  }
  setDonnees(aEleve, aAbsence) {
    this.getInstance(this.identSuivi).setDonnees(aEleve, null, null, aAbsence);
    this.afficher();
    this.getInstance(this.identSuivi).surResizeInterface();
  }
  setEtatSaisie(aEtatSaisie) {
    this.etatSaisie = aEtatSaisie;
    this.$refreshSelf();
  }
  surValidation(aNumeroBouton) {
    if (aNumeroBouton === 1) {
      this.getInstance(this.identSuivi).valider(() => {
        this.fermer();
        this.callback.appel();
      });
    } else {
      this.fermer();
    }
  }
}
module.exports = { ObjetFenetre_SuiviUnique };
