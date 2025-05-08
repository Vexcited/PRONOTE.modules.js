exports.UtilsInputNoteGetMinMax = UtilsInputNoteGetMinMax;
exports.UtilsInputNoteInitOptions = UtilsInputNoteInitOptions;
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
function UtilsInputNoteGetMinMax(aMinMax) {
  let lValeurMin;
  if (MethodesObjet_1.MethodesObjet.isFunction(aMinMax)) {
    lValeurMin = aMinMax();
  } else {
    lValeurMin = aMinMax;
  }
  return lValeurMin;
}
function UtilsInputNoteInitOptions() {
  return {
    avecVirgule: true,
    afficherAvecVirgule: true,
    avecAnnotation: true,
    listeAnnotations: null,
    sansNotePossible: true,
    min: 0,
    max: 100,
    selectionSurFocus: true,
    textAlign: "right",
    hintSurErreur: false,
    titreMessageMinMax: "",
    messageMinMax: ObjetTraduction_1.GTraductions.getValeur("InputNote.MinMax"),
    maxLength: 15,
    avecSigneMoins: false,
    htmlContexte: "",
  };
}
