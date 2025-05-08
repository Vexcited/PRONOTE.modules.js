exports.TypeOrigineCreationCategorieCahierDeTexteUtil =
  exports.TypeOrigineCreationCategorieCahierDeTexte = void 0;
var TypeOrigineCreationCategorieCahierDeTexte;
(function (TypeOrigineCreationCategorieCahierDeTexte) {
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Utilisateur"] = 0)
  ] = "OCCCDT_Utilisateur";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Cours"] = 1)
  ] = "OCCCDT_Pre_Cours";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Correction"] = 2)
  ] = "OCCCDT_Pre_Correction";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Devoir"] = 3)
  ] = "OCCCDT_Pre_Devoir";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Interro"] = 4)
  ] = "OCCCDT_Pre_Interro";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_TD"] = 5)
  ] = "OCCCDT_Pre_TD";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_TP"] = 6)
  ] = "OCCCDT_Pre_TP";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Evaluation"] = 7)
  ] = "OCCCDT_Pre_Evaluation";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_EPI"] = 8)
  ] = "OCCCDT_Pre_EPI";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_AP"] = 9)
  ] = "OCCCDT_Pre_AP";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Mod_Peda_Oral"] = 10)
  ] = "OCCCDT_Pre_Mod_Peda_Oral";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_Mod_Peda_Ecrit"] =
      11)
  ] = "OCCCDT_Pre_Mod_Peda_Ecrit";
  TypeOrigineCreationCategorieCahierDeTexte[
    (TypeOrigineCreationCategorieCahierDeTexte["OCCCDT_Pre_LienVisio"] = 12)
  ] = "OCCCDT_Pre_LienVisio";
})(
  TypeOrigineCreationCategorieCahierDeTexte ||
    (exports.TypeOrigineCreationCategorieCahierDeTexte =
      TypeOrigineCreationCategorieCahierDeTexte =
        {}),
);
const TypeOrigineCreationCategorieCahierDeTexteUtil = {
  getImage(aGenre) {
    switch (aGenre) {
      case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir:
        return "Image_IconeDS";
      case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation:
        return "Image_IconeEvaluation";
      case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_EPI:
        return "Image_IconeEPI";
      case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_AP:
        return "Image_IconeAP";
      case TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_LienVisio:
        return "Image_CoursVirtuelCDT";
    }
    return "";
  },
  getListeTypesAvecImage() {
    return [
      TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
      TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
      TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_EPI,
      TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_AP,
      TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_LienVisio,
    ];
  },
  estTypeAvecImage(aType) {
    return TypeOrigineCreationCategorieCahierDeTexteUtil.getListeTypesAvecImage().includes(
      aType,
    );
  },
};
exports.TypeOrigineCreationCategorieCahierDeTexteUtil =
  TypeOrigineCreationCategorieCahierDeTexteUtil;
