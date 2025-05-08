exports.ObjetFenetre_SaisieTypeNote = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilsInputNote_EspaceMobile_1 = require("UtilsInputNote_EspaceMobile");
require("IEHtml.InputNote.js");
class ObjetFenetre_SaisieTypeNote extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.valeur = null;
    this.labelChamps = ObjetTraduction_1.GTraductions.getValeur(
      "InputNote.LabelChamps",
    );
    this.idInputNote = this.Nom + "_Valeur";
    this.optionsInputNote = (0,
    UtilsInputNote_EspaceMobile_1.UtilsInputNoteInitOptions)();
    this.setOptionsFenetre({
      largeur: 250,
      hauteur: 80,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      inputnote: {
        getNote() {
          return aInstance.valeur;
        },
        setNote(aNote) {
          aInstance.valeur = aNote;
        },
        getOptionsNote() {
          return aInstance.optionsInputNote;
        },
      },
    });
  }
  composeContenu() {
    const T = [];
    T.push(
      '<div class="full-width flex-contain flex-center justify-between p-all flex-gap-l">',
      '<label class="fluid-contain text-right" for="',
      this.idInputNote,
      '">',
      this.labelChamps,
      "</label>",
      '<ie-inputnote ie-model="inputnote" type="text" id="',
      this.idInputNote,
      '" class="round-style"></ie-inputnote>',
      "</div>",
    );
    return T.join("");
  }
  setDonnees(aValeur, aOptionsFenetre) {
    aOptionsFenetre = aOptionsFenetre || {};
    this.labelChamps = aOptionsFenetre.labelChamps || this.labelChamps;
    this.valeur = aValeur;
    this.actualiser();
    this.afficher();
    this.$refreshSelf();
  }
  setOptionsInputNote(aOptionsInputNote) {
    this.optionsInputNote = Object.assign({}, aOptionsInputNote);
  }
  focusSurPremierElement() {
    ObjetHtml_1.GHtml.setFocusEdit(this.idInputNote);
  }
  getIdFocus() {
    return this.idInputNote;
  }
  getValeur() {
    return this.valeur;
  }
  surValidation(aGenreBouton) {
    this.fermer();
    this.callback.appel(aGenreBouton, this.valeur);
  }
}
exports.ObjetFenetre_SaisieTypeNote = ObjetFenetre_SaisieTypeNote;
