exports.TypeHebergementStageUtil = exports.TypeHebergementStage = void 0;
var TypeHebergementStage;
(function (TypeHebergementStage) {
	TypeHebergementStage[(TypeHebergementStage["tHST_NonRenseigne"] = 0)] =
		"tHST_NonRenseigne";
	TypeHebergementStage[
		(TypeHebergementStage["tHST_LogeSurPlaceEntreprise"] = 1)
	] = "tHST_LogeSurPlaceEntreprise";
	TypeHebergementStage[
		(TypeHebergementStage["tHST_InternatEtablissement"] = 2)
	] = "tHST_InternatEtablissement";
})(
	TypeHebergementStage ||
		(exports.TypeHebergementStage = TypeHebergementStage = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const TradTypeHebergementStage = ObjetTraduction_1.TraductionsModule.getModule(
	"TypeHebergementStage",
	{ nonRenseigne: "", aLEntreprise: "", aLEtablissement: "" },
);
const TypeHebergementStageUtil = {
	getLibelle(aGenreRendu) {
		switch (aGenreRendu) {
			case TypeHebergementStage.tHST_NonRenseigne:
				return TradTypeHebergementStage.nonRenseigne;
			case TypeHebergementStage.tHST_LogeSurPlaceEntreprise:
				return TradTypeHebergementStage.aLEntreprise;
			case TypeHebergementStage.tHST_InternatEtablissement:
				return TradTypeHebergementStage.aLEtablissement;
			default:
		}
		return "";
	},
};
exports.TypeHebergementStageUtil = TypeHebergementStageUtil;
