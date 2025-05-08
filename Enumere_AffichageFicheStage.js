exports.EGenreAffichageFicheStageUtil = exports.EGenreAffichageFicheStage =
  void 0;
var EGenreAffichageFicheStage;
(function (EGenreAffichageFicheStage) {
  EGenreAffichageFicheStage["Suivi"] = "Suivi";
  EGenreAffichageFicheStage["Entreprise"] = "Entreprise";
  EGenreAffichageFicheStage["Details"] = "Details";
  EGenreAffichageFicheStage["Annexe"] = "Annexe";
  EGenreAffichageFicheStage["Appreciations"] = "Appreciations";
  EGenreAffichageFicheStage["Assiduite"] = "Assiduite";
})(
  EGenreAffichageFicheStage ||
    (exports.EGenreAffichageFicheStage = EGenreAffichageFicheStage = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const EGenreAffichageFicheStageUtil = {
  getTraductionOnglet(aGenreAffichage) {
    switch (aGenreAffichage) {
      case EGenreAffichageFicheStage.Entreprise:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.entreprise",
        );
      case EGenreAffichageFicheStage.Details:
        return ObjetTraduction_1.GTraductions.getValeur("FicheStage.details");
      case EGenreAffichageFicheStage.Suivi:
        return ObjetTraduction_1.GTraductions.getValeur("FicheStage.suivi");
      case EGenreAffichageFicheStage.Annexe:
        return IE.estMobile
          ? ObjetTraduction_1.GTraductions.getValeur("FicheStage.annexeMobile")
          : ObjetTraduction_1.GTraductions.getValeur("FicheStage.annexePeda");
      case EGenreAffichageFicheStage.Appreciations:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.appreciations",
        );
      case EGenreAffichageFicheStage.Assiduite:
        return ObjetTraduction_1.GTraductions.getValeur("FicheStage.assiduite");
      default:
    }
    return "";
  },
};
exports.EGenreAffichageFicheStageUtil = EGenreAffichageFicheStageUtil;
