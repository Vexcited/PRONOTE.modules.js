exports.TypeVoeuRencontreUtil = exports.TypeVoeuRencontre = void 0;
var TypeVoeuRencontre;
(function (TypeVoeuRencontre) {
  TypeVoeuRencontre[(TypeVoeuRencontre["Facultatif"] = 0)] = "Facultatif";
  TypeVoeuRencontre[(TypeVoeuRencontre["Souhaite"] = 1)] = "Souhaite";
  TypeVoeuRencontre[(TypeVoeuRencontre["Indispensable"] = 2)] = "Indispensable";
  TypeVoeuRencontre[(TypeVoeuRencontre["PasRencontre"] = 3)] = "PasRencontre";
})(TypeVoeuRencontre || (exports.TypeVoeuRencontre = TypeVoeuRencontre = {}));
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeVoeuRencontreUtil = {
  getLibelle(aType) {
    switch (aType) {
      case TypeVoeuRencontre.Facultatif:
        return ObjetTraduction_1.GTraductions.getValeur(
          "Rencontres.hint.facultative",
        );
      case TypeVoeuRencontre.Souhaite:
        return ObjetTraduction_1.GTraductions.getValeur(
          "Rencontres.hint.souhaitee",
        );
      case TypeVoeuRencontre.Indispensable:
        return ObjetTraduction_1.GTraductions.getValeur(
          "Rencontres.hint.prioritaire",
        );
      case TypeVoeuRencontre.PasRencontre:
        return ObjetTraduction_1.GTraductions.getValeur(
          "Rencontres.hint.pasderencontre",
        );
      default:
        return "";
    }
  },
  getClass(aType) {
    switch (aType) {
      case TypeVoeuRencontre.Facultatif:
        return "neutre-sombre";
      case TypeVoeuRencontre.Souhaite:
        return "marron";
      case TypeVoeuRencontre.Indispensable:
        return "vert";
      case TypeVoeuRencontre.PasRencontre:
        return "rouge";
      default:
        return "";
    }
  },
};
exports.TypeVoeuRencontreUtil = TypeVoeuRencontreUtil;
