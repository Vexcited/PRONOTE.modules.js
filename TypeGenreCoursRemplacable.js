exports.TypeGenreCoursRemplacableUtil = exports.TypeGenreCoursRemplacable =
  void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
var TypeGenreCoursRemplacable;
(function (TypeGenreCoursRemplacable) {
  TypeGenreCoursRemplacable[(TypeGenreCoursRemplacable["cr_invalide"] = 0)] =
    "cr_invalide";
  TypeGenreCoursRemplacable[(TypeGenreCoursRemplacable["cr_suggestion"] = 1)] =
    "cr_suggestion";
  TypeGenreCoursRemplacable[(TypeGenreCoursRemplacable["cr_absence"] = 2)] =
    "cr_absence";
  TypeGenreCoursRemplacable[
    (TypeGenreCoursRemplacable["cr_remplacement"] = 3)
  ] = "cr_remplacement";
})(
  TypeGenreCoursRemplacable ||
    (exports.TypeGenreCoursRemplacable = TypeGenreCoursRemplacable = {}),
);
exports.TypeGenreCoursRemplacableUtil = {
  getLibelle(aType) {
    let lLibelle;
    switch (aType) {
      case TypeGenreCoursRemplacable.cr_invalide:
        lLibelle = "";
        break;
      case TypeGenreCoursRemplacable.cr_suggestion:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeGenreCoursRemplacable.cr_suggestion",
        );
        break;
      case TypeGenreCoursRemplacable.cr_absence:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeGenreCoursRemplacable.cr_absence",
        );
        break;
      default:
        lLibelle = "";
        break;
    }
    return lLibelle;
  },
};
