exports.ModeAffichageHeureAbsenceUtil =
  exports.ModeAffichageHeureAbsence =
  exports.TypeHeuresAbsencesUtil =
  exports.TypeHeuresAbsences =
    void 0;
var TypeHeuresAbsences;
(function (TypeHeuresAbsences) {
  TypeHeuresAbsences[(TypeHeuresAbsences["Toutes"] = 0)] = "Toutes";
  TypeHeuresAbsences[(TypeHeuresAbsences["Justifiees"] = 1)] = "Justifiees";
  TypeHeuresAbsences[(TypeHeuresAbsences["Injustifiees"] = 2)] = "Injustifiees";
})(
  TypeHeuresAbsences || (exports.TypeHeuresAbsences = TypeHeuresAbsences = {}),
);
var ModeAffichageHeureAbsence;
(function (ModeAffichageHeureAbsence) {
  ModeAffichageHeureAbsence[(ModeAffichageHeureAbsence["Aucune"] = 0)] =
    "Aucune";
  ModeAffichageHeureAbsence[(ModeAffichageHeureAbsence["Total"] = 1)] = "Total";
  ModeAffichageHeureAbsence[(ModeAffichageHeureAbsence["Injustifiees"] = 2)] =
    "Injustifiees";
  ModeAffichageHeureAbsence[(ModeAffichageHeureAbsence["Justifiees"] = 3)] =
    "Justifiees";
  ModeAffichageHeureAbsence[
    (ModeAffichageHeureAbsence["TotalObligatoire"] = 4)
  ] = "TotalObligatoire";
  ModeAffichageHeureAbsence[
    (ModeAffichageHeureAbsence["InjustifieesObligatoire"] = 5)
  ] = "InjustifieesObligatoire";
  ModeAffichageHeureAbsence[
    (ModeAffichageHeureAbsence["JustifieesObligatoire"] = 6)
  ] = "JustifieesObligatoire";
})(
  ModeAffichageHeureAbsence ||
    (exports.ModeAffichageHeureAbsence = ModeAffichageHeureAbsence = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const MethodesObjet_1 = require("MethodesObjet");
const TypeHeuresAbsencesUtil = {
  getLibelle(aGenre) {
    switch (aGenre) {
      case TypeHeuresAbsences.Toutes:
        return ObjetTraduction_1.GTraductions.getValeur(
          "Resultats.AbsencesToutes",
        );
      case TypeHeuresAbsences.Justifiees:
        return ObjetTraduction_1.GTraductions.getValeur(
          "Resultats.AbsencesJustifiees",
        );
      case TypeHeuresAbsences.Injustifiees:
        return ObjetTraduction_1.GTraductions.getValeur(
          "Resultats.AbsencesInjustifiees",
        );
    }
    return "";
  },
  toListe() {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
      TypeHeuresAbsences,
    )) {
      const lGenre = TypeHeuresAbsences[lKey];
      const lElement = new ObjetElement_1.ObjetElement(
        TypeHeuresAbsencesUtil.getLibelle(lGenre),
        lGenre,
      );
      lListe.addElement(lElement);
    }
    return lListe;
  },
};
exports.TypeHeuresAbsencesUtil = TypeHeuresAbsencesUtil;
const ModeAffichageHeureAbsenceUtil = {
  estObligatoire(aMode) {
    return aMode >= ModeAffichageHeureAbsence.TotalObligatoire;
  },
};
exports.ModeAffichageHeureAbsenceUtil = ModeAffichageHeureAbsenceUtil;
