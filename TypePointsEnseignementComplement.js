exports.TypePointsEnseignementComplementUtil =
  exports.TypePointsEnseignementComplement = void 0;
var TypePointsEnseignementComplement;
(function (TypePointsEnseignementComplement) {
  TypePointsEnseignementComplement[
    (TypePointsEnseignementComplement["tpec_Aucun"] = 0)
  ] = "tpec_Aucun";
  TypePointsEnseignementComplement[
    (TypePointsEnseignementComplement["tpec_NonAtteint"] = 1)
  ] = "tpec_NonAtteint";
  TypePointsEnseignementComplement[
    (TypePointsEnseignementComplement["tpec_Atteint"] = 2)
  ] = "tpec_Atteint";
  TypePointsEnseignementComplement[
    (TypePointsEnseignementComplement["tpec_Depasse"] = 3)
  ] = "tpec_Depasse";
})(
  TypePointsEnseignementComplement ||
    (exports.TypePointsEnseignementComplement =
      TypePointsEnseignementComplement =
        {}),
);
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeNote_1 = require("TypeNote");
const TypePointsEnseignementComplementUtil = {
  getLibelle(aGenre) {
    switch (aGenre) {
      case TypePointsEnseignementComplement.tpec_Aucun:
        return "";
      case TypePointsEnseignementComplement.tpec_NonAtteint:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheBrevet.PointsEnseignementComplement.ObjectifsNonAtteint",
        );
      case TypePointsEnseignementComplement.tpec_Atteint:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheBrevet.PointsEnseignementComplement.ObjectifsAtteints",
        );
      case TypePointsEnseignementComplement.tpec_Depasse:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheBrevet.PointsEnseignementComplement.ObjectifsDepasses",
        );
      default:
        return "";
    }
  },
  getLibelleCourt(aGenre) {
    switch (aGenre) {
      case TypePointsEnseignementComplement.tpec_Aucun:
        return "";
      case TypePointsEnseignementComplement.tpec_NonAtteint:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheBrevet.PointsEnseignementComplement.NonAtteint",
        );
      case TypePointsEnseignementComplement.tpec_Atteint:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheBrevet.PointsEnseignementComplement.Atteints",
        );
      case TypePointsEnseignementComplement.tpec_Depasse:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheBrevet.PointsEnseignementComplement.Depasses",
        );
      default:
        return "";
    }
  },
  getLibellePoints(aGenre) {
    let lResult = TypePointsEnseignementComplementUtil.getLibelle(aGenre);
    switch (aGenre) {
      case TypePointsEnseignementComplement.tpec_Atteint:
      case TypePointsEnseignementComplement.tpec_Depasse: {
        const lNote = TypePointsEnseignementComplementUtil.getPoints(aGenre);
        lResult += " +" + lNote.getNoteEntier();
        break;
      }
      default:
        break;
    }
    return lResult;
  },
  getType(aLibelle) {
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
      TypePointsEnseignementComplement,
    )) {
      const lRendu = TypePointsEnseignementComplement[lKey];
      if (
        ObjetChaine_1.GChaine.estChaineHTMLEgal(
          aLibelle,
          TypePointsEnseignementComplementUtil.getLibelle(lRendu),
        ) ||
        ObjetChaine_1.GChaine.estChaineHTMLEgal(
          aLibelle,
          TypePointsEnseignementComplementUtil.getLibelleCourt(lRendu),
        ) ||
        ObjetChaine_1.GChaine.estChaineHTMLEgal(
          aLibelle,
          TypePointsEnseignementComplementUtil.getLibellePoints(lRendu),
        )
      ) {
        return lRendu;
      }
    }
    return TypePointsEnseignementComplement.tpec_Aucun;
  },
  getOrdre(aGenre) {
    return [0, 1, 2, 3][aGenre];
  },
  toListe(aAvecPoints = false) {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
      TypePointsEnseignementComplement,
    )) {
      const lRendu = TypePointsEnseignementComplement[lKey];
      const lLibelle = !!aAvecPoints
        ? TypePointsEnseignementComplementUtil.getLibellePoints(lRendu)
        : TypePointsEnseignementComplementUtil.getLibelle(lRendu);
      const lElement = new ObjetElement_1.ObjetElement(
        lLibelle,
        undefined,
        lRendu,
      );
      lElement.ordre = TypePointsEnseignementComplementUtil.getOrdre(lRendu);
      lListe.addElement(lElement);
    }
    lListe.setTri([ObjetTri_1.ObjetTri.init("ordre")]);
    lListe.trier();
    return lListe;
  },
  getPoints(aGenre) {
    switch (aGenre) {
      case TypePointsEnseignementComplement.tpec_Aucun:
        return new TypeNote_1.TypeNote("");
      case TypePointsEnseignementComplement.tpec_NonAtteint:
        return new TypeNote_1.TypeNote(0);
      case TypePointsEnseignementComplement.tpec_Atteint:
        return new TypeNote_1.TypeNote(10);
      case TypePointsEnseignementComplement.tpec_Depasse:
        return new TypeNote_1.TypeNote(20);
      default:
        return new TypeNote_1.TypeNote("");
    }
  },
};
exports.TypePointsEnseignementComplementUtil =
  TypePointsEnseignementComplementUtil;
