exports.TypeStatutCoursUtil = exports.TypeStatutCours = void 0;
var TypeStatutCours;
(function (TypeStatutCours) {
  TypeStatutCours[(TypeStatutCours["EnseignementNormal"] = 0)] =
    "EnseignementNormal";
  TypeStatutCours[(TypeStatutCours["ConseilDeClasse"] = 1)] = "ConseilDeClasse";
  TypeStatutCours[(TypeStatutCours["EnseignementRemplacement"] = 2)] =
    "EnseignementRemplacement";
  TypeStatutCours[(TypeStatutCours["EnseignementHistorique"] = 3)] =
    "EnseignementHistorique";
  TypeStatutCours[(TypeStatutCours["EnseignementSuppleant"] = 4)] =
    "EnseignementSuppleant";
})(TypeStatutCours || (exports.TypeStatutCours = TypeStatutCours = {}));
const TypeStatutCoursUtil = {
  getCouleur(aCours) {
    if (!aCours) {
      return "";
    }
    if (
      !aCours.estAnnule &&
      (aCours.estPermanence ||
        aCours.getGenre() === TypeStatutCours.EnseignementRemplacement)
    ) {
      return "blue";
    }
    if (aCours.getGenre() === TypeStatutCours.ConseilDeClasse) {
      return "white";
    }
    return "#c00000";
  },
  getCouleurFond(aCours) {
    return aCours && aCours.getGenre() === TypeStatutCours.ConseilDeClasse
      ? "green"
      : "white";
  },
};
exports.TypeStatutCoursUtil = TypeStatutCoursUtil;
