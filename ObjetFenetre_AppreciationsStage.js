const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GChaine } = require("ObjetChaine.js");
class ObjetFenetre_AppreciationsStage extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      titre: GTraductions.getValeur("FicheStage.appreciations"),
      largeur: 500,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      txtAppreciation: {
        getValue: function (aNumero) {
          const lAppreciation = aInstance.donnees.getElementParNumero(aNumero);
          return !!lAppreciation ? lAppreciation.appreciation : "";
        },
        setValue: function (aNumero, aValeur) {
          const lAppreciation = aInstance.donnees.getElementParNumero(aNumero);
          if (!!lAppreciation) {
            lAppreciation.appreciation = aValeur;
          }
        },
      },
    });
  }
  composeContenu() {
    if (!this.donnees) {
      return "";
    }
    const lHTML = [];
    const lAttributTxtArea = IE.estMobile
      ? 'ie-autoresize style="max-height: 11rem;height: 100%;overflow:auto" class="m-top-l"'
      : 'class="Texte10 Gras round-style" ie-autoresize style="width: 100%;min-height: 4rem;max-height: 11rem;height: 100%;"';
    this.donnees.parcourir((aAppreciation) => {
      if (aAppreciation.avecEditionAppreciation) {
        lHTML.push(
          '<div class="field-contain label-up">',
          "<label>",
          aAppreciation.getLibelle(),
          "</label>",
          '<ie-textareamax aria-label="',
          GChaine.toTitle(aAppreciation.getLibelle()),
          '" ie-model="txtAppreciation(\'',
          aAppreciation.getNumero(),
          "')\" ",
          lAttributTxtArea,
          ">",
          aAppreciation.appreciation,
          "</ie-textareamax>",
          "</div>",
        );
      }
    });
    return lHTML.join("");
  }
  setDonnees(aDonnees) {
    this.donnees = MethodesObjet.dupliquer(aDonnees);
    this.afficher(this.composeContenu());
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton, this.donnees);
  }
}
module.exports = ObjetFenetre_AppreciationsStage;
