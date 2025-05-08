exports.TypeGenreDisponibiliteUtil = exports.TypeGenreDisponibilite = void 0;
var TypeGenreDisponibilite;
(function (TypeGenreDisponibilite) {
  TypeGenreDisponibilite[(TypeGenreDisponibilite["GD_Voeu"] = 0)] = "GD_Voeu";
  TypeGenreDisponibilite[
    (TypeGenreDisponibilite["GD_IndisponibiliteSouple"] = 1)
  ] = "GD_IndisponibiliteSouple";
  TypeGenreDisponibilite[
    (TypeGenreDisponibilite["GD_IndisponibiliteDure"] = 2)
  ] = "GD_IndisponibiliteDure";
  TypeGenreDisponibilite[(TypeGenreDisponibilite["GD_Priorite1"] = 3)] =
    "GD_Priorite1";
  TypeGenreDisponibilite[(TypeGenreDisponibilite["GD_Priorite2"] = 4)] =
    "GD_Priorite2";
  TypeGenreDisponibilite[(TypeGenreDisponibilite["GD_DebutImpose"] = 5)] =
    "GD_DebutImpose";
  TypeGenreDisponibilite[(TypeGenreDisponibilite["GD_Priorite3"] = 6)] =
    "GD_Priorite3";
})(
  TypeGenreDisponibilite ||
    (exports.TypeGenreDisponibilite = TypeGenreDisponibilite = {}),
);
const TypeGenreDisponibiliteUtil = {
  getClass(aType) {
    switch (aType) {
      case TypeGenreDisponibilite.GD_Priorite1:
        return "priorite-1";
      case TypeGenreDisponibilite.GD_Priorite2:
        return "priorite-2";
      case TypeGenreDisponibilite.GD_Priorite3:
        return "priorite-3";
      default:
        return "";
    }
  },
};
exports.TypeGenreDisponibiliteUtil = TypeGenreDisponibiliteUtil;
