exports.TypeNiveauEquivalenceCEUtil = exports.TypeNiveauEquivalenceCE = void 0;
var TypeNiveauEquivalenceCE;
(function (TypeNiveauEquivalenceCE) {
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Aucun"] = 0)] =
    "TNECE_Aucun";
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau1"] = 1)] =
    "TNECE_Niveau1";
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau2"] = 2)] =
    "TNECE_Niveau2";
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau3"] = 3)] =
    "TNECE_Niveau3";
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau4"] = 4)] =
    "TNECE_Niveau4";
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau5"] = 5)] =
    "TNECE_Niveau5";
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau6"] = 6)] =
    "TNECE_Niveau6";
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau7"] = 7)] =
    "TNECE_Niveau7";
  TypeNiveauEquivalenceCE[(TypeNiveauEquivalenceCE["TNECE_Niveau8"] = 8)] =
    "TNECE_Niveau8";
})(
  TypeNiveauEquivalenceCE ||
    (exports.TypeNiveauEquivalenceCE = TypeNiveauEquivalenceCE = {}),
);
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNiveauEquivalenceCEUtil = {
  _toListe(aModeLVE, aAvecLibelleLong = false) {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
      TypeNiveauEquivalenceCE,
    )) {
      const lTypeNiveau = TypeNiveauEquivalenceCE[lKey];
      const lElement = new ObjetElement_1.ObjetElement(
        TypeNiveauEquivalenceCEUtil.getLibelle(
          aModeLVE,
          aAvecLibelleLong,
          lTypeNiveau,
        ),
        undefined,
        lTypeNiveau,
        lTypeNiveau,
      );
      lListe.addElement(lElement);
    }
    return lListe;
  },
  getLibelle(aModeLVE, aLibelleLong, aTypeNiveau) {
    let lCleTraduction;
    if (aModeLVE) {
      if (aLibelleLong) {
        lCleTraduction =
          "TypeNiveauEquivalenceCE.LVE.long_niveau_" + aTypeNiveau;
      } else {
        lCleTraduction = "TypeNiveauEquivalenceCE.LVE.niveau_" + aTypeNiveau;
      }
    } else {
      if (aLibelleLong) {
        lCleTraduction =
          "TypeNiveauEquivalenceCE.CN.long_niveau_" + aTypeNiveau;
      } else {
        lCleTraduction = "TypeNiveauEquivalenceCE.CN.niveau_" + aTypeNiveau;
      }
    }
    return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction);
  },
  getType(aModeLVE, aEstLibelleLong, aLibelle) {
    let lType = TypeNiveauEquivalenceCE.TNECE_Aucun;
    if (aLibelle) {
      const lListeNiveaux = TypeNiveauEquivalenceCEUtil._toListe(
        aModeLVE,
        aEstLibelleLong,
      );
      lListeNiveaux.parcourir((D) => {
        if (D.getLibelle() === aLibelle) {
          lType = D.getGenre();
          return false;
        }
      });
    }
    return lType;
  },
  getTypeParRaccourci(aModeLVE, aRaccourci) {
    let result = null;
    if (!!aRaccourci) {
      const lListeNiveaux = TypeNiveauEquivalenceCEUtil._toListe(aModeLVE);
      lListeNiveaux.parcourir((D) => {
        if (D.getGenre().toString() === aRaccourci) {
          result = D;
          return false;
        }
      });
    }
    return result;
  },
  getListeNiveauxEquivalenceLVE(aAvecLibelleLong) {
    return TypeNiveauEquivalenceCEUtil._toListe(true, aAvecLibelleLong);
  },
  getListeNiveauxEquivalenceCN(aAvecLibelleLong) {
    return TypeNiveauEquivalenceCEUtil._toListe(false, aAvecLibelleLong);
  },
};
exports.TypeNiveauEquivalenceCEUtil = TypeNiveauEquivalenceCEUtil;
