exports.ObjetFenetre_Progression = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfaceListeProgression_1 = require("InterfaceListeProgression");
class ObjetFenetre_Progression extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.indexBtnValider = 1;
    this.setOptionsFenetre({
      largeur: 620,
      hauteur: 300,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        {
          libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
          valider: true,
        },
      ],
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      fenetreBtn: {
        getDisabled: function (aBoutonRepeat) {
          if (aBoutonRepeat.element.valider) {
            const lListe = aInstance.getInstance(
              aInstance.identListeProgression,
            );
            return !lListe || !lListe.getProgressionSelection();
          }
          return false;
        },
      },
    });
  }
  construireInstances() {
    this.identListeProgression = this.add(
      InterfaceListeProgression_1.InterfaceListeProgression,
      null,
      (aInstance) => {
        aInstance.setOptions({
          classeFenetreProgression: ObjetFenetre_Progression,
        });
      },
    );
  }
  composeContenu() {
    const T = [];
    T.push(
      '<div id="' +
        this.getNomInstance(this.identListeProgression) +
        '" style="width: 100%; height: 100%"></div>',
    );
    return T.join("");
  }
  setEtatSaisie() {}
  setDonnees(aParametres) {
    this.parametres = {
      progressionSource: null,
      listeProgressions: null,
      listeProgressionsPublicPourCopie: null,
      listeNiveaux: null,
      avecCreation: false,
      avecProgressionsPublic: false,
      callbackFinCreation: null,
    };
    $.extend(this.parametres, aParametres);
    this.afficher();
    const lInstanceListe = this.getInstance(this.identListeProgression);
    lInstanceListe
      .setOptions({
        nonEditable: !this.parametres.avecCreation,
        estModeSelection: !this.parametres.avecCreation,
        avecProgressionsPublic: !!this.parametres.avecProgressionsPublic,
      })
      .actualiser(this.parametres);
  }
  surValidation(ANumeroBouton) {
    let lIndice = -1;
    if (ANumeroBouton === this.indexBtnValider) {
      const lProgression = this.getInstance(
        this.identListeProgression,
      ).getProgressionSelection();
      if (lProgression) {
        lIndice =
          this.parametres.listeProgressions.getIndiceParElement(lProgression);
      }
    }
    this.fermer();
    this.callback.appel(ANumeroBouton, lIndice, this.parametres.avecCreation);
  }
}
exports.ObjetFenetre_Progression = ObjetFenetre_Progression;
