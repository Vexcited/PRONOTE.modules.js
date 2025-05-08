exports.TypeDestinationDemandeTravauxUtil =
  exports.TypeDestinationDemandeTravaux = void 0;
var TypeDestinationDemandeTravaux;
(function (TypeDestinationDemandeTravaux) {
  TypeDestinationDemandeTravaux[
    (TypeDestinationDemandeTravaux["DDT_Interne"] = 0)
  ] = "DDT_Interne";
  TypeDestinationDemandeTravaux[
    (TypeDestinationDemandeTravaux["DDT_Collectivite"] = 1)
  ] = "DDT_Collectivite";
})(
  TypeDestinationDemandeTravaux ||
    (exports.TypeDestinationDemandeTravaux = TypeDestinationDemandeTravaux =
      {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const MethodesObjet_1 = require("MethodesObjet");
const lTypePourMairie = [TypeDestinationDemandeTravaux.DDT_Collectivite];
const TypeDestinationDemandeTravauxUtil = {
  toListe(aPourMairie) {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
      TypeDestinationDemandeTravaux,
    )) {
      const lValeurType = TypeDestinationDemandeTravaux[lKey];
      if (aPourMairie && !lTypePourMairie.includes(lValeurType)) {
        continue;
      }
      if (MethodesObjet_1.MethodesObjet.isNumber(lValeurType)) {
        lListe.addElement(
          new ObjetElement_1.ObjetElement(
            TypeDestinationDemandeTravauxUtil.getLibelle(lValeurType),
            0,
            lValeurType,
          ),
        );
      }
    }
    return lListe;
  },
  getLibelle(aTypeDestinationDemandeTravaux) {
    return ObjetTraduction_1.GTraductions.getValeur(
      "TypeDestinationDemandeTravaux.Libelle.type_" +
        aTypeDestinationDemandeTravaux,
    );
  },
};
exports.TypeDestinationDemandeTravauxUtil = TypeDestinationDemandeTravauxUtil;
