exports.TypeOrigineCreationAvanceeTravauxUtil =
  exports.TypeOrigineCreationAvanceeTravaux = void 0;
var TypeOrigineCreationAvanceeTravaux;
(function (TypeOrigineCreationAvanceeTravaux) {
  TypeOrigineCreationAvanceeTravaux[
    (TypeOrigineCreationAvanceeTravaux["OCAT_Utilisateur"] = 0)
  ] = "OCAT_Utilisateur";
  TypeOrigineCreationAvanceeTravaux[
    (TypeOrigineCreationAvanceeTravaux["OCAT_EnAttente"] = 1)
  ] = "OCAT_EnAttente";
  TypeOrigineCreationAvanceeTravaux[
    (TypeOrigineCreationAvanceeTravaux["OCAT_Accepte"] = 2)
  ] = "OCAT_Accepte";
  TypeOrigineCreationAvanceeTravaux[
    (TypeOrigineCreationAvanceeTravaux["OCAT_Realise"] = 3)
  ] = "OCAT_Realise";
  TypeOrigineCreationAvanceeTravaux[
    (TypeOrigineCreationAvanceeTravaux["OCAT_Refuse"] = 4)
  ] = "OCAT_Refuse";
  TypeOrigineCreationAvanceeTravaux[
    (TypeOrigineCreationAvanceeTravaux["OCAT_ALEtude"] = 5)
  ] = "OCAT_ALEtude";
})(
  TypeOrigineCreationAvanceeTravaux ||
    (exports.TypeOrigineCreationAvanceeTravaux =
      TypeOrigineCreationAvanceeTravaux =
        {}),
);
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const MethodesObjet_1 = require("MethodesObjet");
const TypeOrigineCreationAvanceeTravauxUtil = {
  getLibelle(aGenre) {
    switch (aGenre) {
      case TypeOrigineCreationAvanceeTravaux.OCAT_EnAttente:
        return ObjetTraduction_1.GTraductions.getValeur(
          "TypeOrigineCreationAvanceeTravaux.libelle.EnAttente",
        );
      case TypeOrigineCreationAvanceeTravaux.OCAT_Accepte:
        return ObjetTraduction_1.GTraductions.getValeur(
          "TypeOrigineCreationAvanceeTravaux.libelle.Accepte",
        );
      case TypeOrigineCreationAvanceeTravaux.OCAT_Realise:
        return ObjetTraduction_1.GTraductions.getValeur(
          "TypeOrigineCreationAvanceeTravaux.libelle.Realise",
        );
      case TypeOrigineCreationAvanceeTravaux.OCAT_Refuse:
        return ObjetTraduction_1.GTraductions.getValeur(
          "TypeOrigineCreationAvanceeTravaux.libelle.Refuse",
        );
      case TypeOrigineCreationAvanceeTravaux.OCAT_ALEtude:
        return ObjetTraduction_1.GTraductions.getValeur(
          "TypeOrigineCreationAvanceeTravaux.libelle.ALEtude",
        );
    }
    return "";
  },
  getClassIcone(aGenre) {
    switch (aGenre) {
      case TypeOrigineCreationAvanceeTravaux.OCAT_EnAttente:
        return "icon_edt_permanence";
      case TypeOrigineCreationAvanceeTravaux.OCAT_Accepte:
        return "icon_check_fin text-util-bleu-foncee";
      case TypeOrigineCreationAvanceeTravaux.OCAT_Realise:
        return "icon_double_check text-util-vert-foncee";
      case TypeOrigineCreationAvanceeTravaux.OCAT_Refuse:
        return "icon_fermeture_widget text-util-rouge-foncee";
      case TypeOrigineCreationAvanceeTravaux.OCAT_ALEtude:
        return "icon_sous_discussion text-util-orange-moyen";
      case TypeOrigineCreationAvanceeTravaux.OCAT_Utilisateur:
        return "";
      default:
    }
    return "";
  },
  toListe() {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
      TypeOrigineCreationAvanceeTravaux,
    )) {
      const lEtat = TypeOrigineCreationAvanceeTravaux[lKey];
      if (lEtat !== TypeOrigineCreationAvanceeTravaux.OCAT_Utilisateur) {
        lListe.addElement(
          new ObjetElement_1.ObjetElement(
            TypeOrigineCreationAvanceeTravauxUtil.getLibelle(lEtat),
            0,
            lEtat,
          ),
        );
      }
    }
    lListe.setTri([ObjetTri_1.ObjetTri.init("Genre")]);
    lListe.trier();
    return lListe;
  },
};
exports.TypeOrigineCreationAvanceeTravauxUtil =
  TypeOrigineCreationAvanceeTravauxUtil;
