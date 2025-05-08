exports.TypeOrigineCreationLangueRegionaleUtil =
  exports.TypeOrigineCreationLangueRegionale = void 0;
var TypeOrigineCreationLangueRegionale;
(function (TypeOrigineCreationLangueRegionale) {
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Aucune"] = 0)
  ] = "toclr_Aucune";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Francais"] = 1)
  ] = "toclr_Francais";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Basque"] = 2)
  ] = "toclr_Basque";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Breton"] = 3)
  ] = "toclr_Breton";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Catalan"] = 4)
  ] = "toclr_Catalan";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Corse"] = 5)
  ] = "toclr_Corse";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Creole"] = 6)
  ] = "toclr_Creole";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Gallo"] = 7)
  ] = "toclr_Gallo";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Occitan"] = 8)
  ] = "toclr_Occitan";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Alsacien"] = 9)
  ] = "toclr_Alsacien";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Mosellan"] = 10)
  ] = "toclr_Mosellan";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Melanesien"] = 11)
  ] = "toclr_Melanesien";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Tahitien"] = 12)
  ] = "toclr_Tahitien";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Futunien"] = 13)
  ] = "toclr_Futunien";
  TypeOrigineCreationLangueRegionale[
    (TypeOrigineCreationLangueRegionale["toclr_Wallisien"] = 14)
  ] = "toclr_Wallisien";
})(
  TypeOrigineCreationLangueRegionale ||
    (exports.TypeOrigineCreationLangueRegionale =
      TypeOrigineCreationLangueRegionale =
        {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTri_1 = require("ObjetTri");
const TypeOrigineCreationLangueRegionaleUtil = {
  getLibelle(aIndexLangue) {
    const lCleTraduction =
      "TypeOrigineCreationLangueRegionale.langue_" + aIndexLangue + ".libelle";
    return ObjetTraduction_1.GTraductions.getValeur(lCleTraduction);
  },
  getType(aLibelle) {
    let result = TypeOrigineCreationLangueRegionale.toclr_Aucune;
    if (aLibelle === "") {
      return result;
    } else {
      const lListeLangues = TypeOrigineCreationLangueRegionaleUtil.toListe();
      lListeLangues.parcourir((D) => {
        if (D.getLibelle() === aLibelle) {
          result = D.getGenre();
          return false;
        }
      });
      return result;
    }
  },
  toListe() {
    const lListe = new ObjetListeElements_1.ObjetListeElements();
    const lListeInactives = [TypeOrigineCreationLangueRegionale.toclr_Francais];
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
      TypeOrigineCreationLangueRegionale,
    )) {
      const lRendu = TypeOrigineCreationLangueRegionale[lKey];
      if (!lListeInactives.includes(lRendu)) {
        const lElement = new ObjetElement_1.ObjetElement(
          TypeOrigineCreationLangueRegionaleUtil.getLibelle(lRendu),
          undefined,
          lRendu,
        );
        lListe.addElement(lElement);
      }
    }
    lListe.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
    lListe.trier();
    return lListe;
  },
};
exports.TypeOrigineCreationLangueRegionaleUtil =
  TypeOrigineCreationLangueRegionaleUtil;
