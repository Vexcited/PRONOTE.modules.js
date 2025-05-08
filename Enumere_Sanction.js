exports.EGenreSanctionUtil = exports.EGenreSanction = void 0;
var EGenreSanction;
(function (EGenreSanction) {
  EGenreSanction[(EGenreSanction["Avertissement"] = 0)] = "Avertissement";
  EGenreSanction[(EGenreSanction["Blame"] = 1)] = "Blame";
  EGenreSanction[(EGenreSanction["ExclusionTemporaireEtablissement"] = 2)] =
    "ExclusionTemporaireEtablissement";
  EGenreSanction[(EGenreSanction["ExclusionTemporaireClasse"] = 3)] =
    "ExclusionTemporaireClasse";
  EGenreSanction[(EGenreSanction["ExclusionDefinitive"] = 4)] =
    "ExclusionDefinitive";
  EGenreSanction[(EGenreSanction["Autre_Exclusion"] = 5)] = "Autre_Exclusion";
  EGenreSanction[(EGenreSanction["ExclusionInternat"] = 6)] =
    "ExclusionInternat";
  EGenreSanction[(EGenreSanction["ExclusionDP"] = 7)] = "ExclusionDP";
  EGenreSanction[(EGenreSanction["Autre_Sanction"] = 8)] = "Autre_Sanction";
  EGenreSanction[(EGenreSanction["Responsabilisation"] = 9)] =
    "Responsabilisation";
  EGenreSanction[(EGenreSanction["MesureConservatoire"] = 10)] =
    "MesureConservatoire";
})(EGenreSanction || (exports.EGenreSanction = EGenreSanction = {}));
const EGenreSanctionUtil = {
  estUneExclusionTemporaire(aGenre) {
    switch (aGenre) {
      case EGenreSanction.ExclusionDP:
      case EGenreSanction.ExclusionInternat:
      case EGenreSanction.ExclusionTemporaireClasse:
      case EGenreSanction.ExclusionTemporaireEtablissement:
      case EGenreSanction.Autre_Exclusion:
        return true;
    }
    return false;
  },
};
exports.EGenreSanctionUtil = EGenreSanctionUtil;
