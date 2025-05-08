exports.TypeRessourceAbsenceUtil = exports.TypeRessourceAbsence = void 0;
var TypeRessourceAbsence;
(function (TypeRessourceAbsence) {
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_Absence"] = 0)] = "TR_Absence";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_Retard"] = 1)] = "TR_Retard";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_AbsenceRepas"] = 2)] =
    "TR_AbsenceRepas";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_Exclusion"] = 3)] =
    "TR_Exclusion";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_Infirmerie"] = 4)] =
    "TR_Infirmerie";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_AbsenceInternat"] = 5)] =
    "TR_AbsenceInternat";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_ExclusionInternat"] = 6)] =
    "TR_ExclusionInternat";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_ExclusionDP"] = 7)] =
    "TR_ExclusionDP";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_Sanction"] = 8)] =
    "TR_Sanction";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_ConvocationVS"] = 9)] =
    "TR_ConvocationVS";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_Incident"] = 10)] =
    "TR_Incident";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_Punition"] = 11)] =
    "TR_Punition";
  TypeRessourceAbsence[(TypeRessourceAbsence["TR_RetardInternat"] = 12)] =
    "TR_RetardInternat";
})(
  TypeRessourceAbsence ||
    (exports.TypeRessourceAbsence = TypeRessourceAbsence = {}),
);
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeRessourceAbsenceUtil = {
  getLibelle(aTypeRessourceAbsence) {
    return ObjetTraduction_1.GTraductions.getValeur(
      "TypeRessourceAbsence.libelle_" + aTypeRessourceAbsence,
    );
  },
  toGenreRessource(aTypeRessourceAbsence) {
    let lGenreRessource;
    switch (aTypeRessourceAbsence) {
      case TypeRessourceAbsence.TR_Absence:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.Absence;
        break;
      case TypeRessourceAbsence.TR_Retard:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.Retard;
        break;
      case TypeRessourceAbsence.TR_AbsenceRepas:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.AbsenceRepas;
        break;
      case TypeRessourceAbsence.TR_Exclusion:
      case TypeRessourceAbsence.TR_ExclusionInternat:
      case TypeRessourceAbsence.TR_ExclusionDP:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.Exclusion;
        break;
      case TypeRessourceAbsence.TR_Infirmerie:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.Infirmerie;
        break;
      case TypeRessourceAbsence.TR_AbsenceInternat:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.AbsenceInternat;
        break;
      case TypeRessourceAbsence.TR_Sanction:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.Sanction;
        break;
      case TypeRessourceAbsence.TR_ConvocationVS:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.ConvocationVS;
        break;
      case TypeRessourceAbsence.TR_Incident:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.Incident;
        break;
      case TypeRessourceAbsence.TR_Punition:
        lGenreRessource = Enumere_Ressource_1.EGenreRessource.Punition;
        break;
      default:
        break;
    }
    return lGenreRessource;
  },
};
exports.TypeRessourceAbsenceUtil = TypeRessourceAbsenceUtil;
