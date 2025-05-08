exports.TypePositionnementUtil = exports.TypePositionnement = void 0;
var TypePositionnement;
(function (TypePositionnement) {
  TypePositionnement[(TypePositionnement["POS_Moyenne"] = 0)] = "POS_Moyenne";
  TypePositionnement[(TypePositionnement["POS_Echelle"] = 1)] = "POS_Echelle";
  TypePositionnement[(TypePositionnement["POS_ObjApprentissage"] = 2)] =
    "POS_ObjApprentissage";
})(
  TypePositionnement || (exports.TypePositionnement = TypePositionnement = {}),
);
const TypePositionnementUtil = {
  getGenrePositionnementParDefaut(aGenre) {
    return aGenre || TypePositionnement.POS_Echelle;
  },
};
exports.TypePositionnementUtil = TypePositionnementUtil;
