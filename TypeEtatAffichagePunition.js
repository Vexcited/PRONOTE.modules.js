exports.TypeEtatAffichagePunitionUtil = exports.TypeEtatAffichagePunition =
  void 0;
var TypeEtatAffichagePunition;
(function (TypeEtatAffichagePunition) {
  TypeEtatAffichagePunition[
    (TypeEtatAffichagePunition["TEAP_NonRealisee"] = 0)
  ] = "TEAP_NonRealisee";
  TypeEtatAffichagePunition[(TypeEtatAffichagePunition["TEAP_Realisee"] = 1)] =
    "TEAP_Realisee";
  TypeEtatAffichagePunition[
    (TypeEtatAffichagePunition["TEAP_DateLimiteDepassee"] = 2)
  ] = "TEAP_DateLimiteDepassee";
  TypeEtatAffichagePunition[
    (TypeEtatAffichagePunition["TEAP_Programmee"] = 3)
  ] = "TEAP_Programmee";
  TypeEtatAffichagePunition[
    (TypeEtatAffichagePunition["TEAP_NonProgrammable"] = 4)
  ] = "TEAP_NonProgrammable";
  TypeEtatAffichagePunition[
    (TypeEtatAffichagePunition["TEAP_EnPartieRealisee"] = 5)
  ] = "TEAP_EnPartieRealisee";
})(
  TypeEtatAffichagePunition ||
    (exports.TypeEtatAffichagePunition = TypeEtatAffichagePunition = {}),
);
const TypeEtatAffichagePunitionUtil = {
  getClassImage(aTypeEtatAffichagePunition) {
    switch (aTypeEtatAffichagePunition) {
      case TypeEtatAffichagePunition.TEAP_EnPartieRealisee:
        return "Image_Punition_RealiseNon";
      case TypeEtatAffichagePunition.TEAP_NonRealisee:
        return "Image_Punition_RealiseNon";
      case TypeEtatAffichagePunition.TEAP_Realisee:
        return "Image_Punition_Realise";
      case TypeEtatAffichagePunition.TEAP_DateLimiteDepassee:
        return "Image_Punition_RealiseOuNon";
      case TypeEtatAffichagePunition.TEAP_Programmee:
        return "Image_Punition_RealiseProgramme";
      default:
        return "Image_Punition_Vide";
    }
  },
};
exports.TypeEtatAffichagePunitionUtil = TypeEtatAffichagePunitionUtil;
