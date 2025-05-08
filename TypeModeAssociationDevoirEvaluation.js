exports.TypeModeInfosADEUtil = exports.TypeModeInfosADE = void 0;
var TypeModeInfosADE;
(function (TypeModeInfosADE) {
	TypeModeInfosADE[(TypeModeInfosADE["tMIADE_Aucun"] = 0)] = "tMIADE_Aucun";
	TypeModeInfosADE[(TypeModeInfosADE["tMIADE_Creation"] = 1)] =
		"tMIADE_Creation";
	TypeModeInfosADE[(TypeModeInfosADE["tMIADE_Modification"] = 2)] =
		"tMIADE_Modification";
	TypeModeInfosADE[(TypeModeInfosADE["tMIADE_SuppressionD"] = 3)] =
		"tMIADE_SuppressionD";
	TypeModeInfosADE[(TypeModeInfosADE["tMIADE_SuppressionA"] = 4)] =
		"tMIADE_SuppressionA";
})(TypeModeInfosADE || (exports.TypeModeInfosADE = TypeModeInfosADE = {}));
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeModeInfosADEUtil = {
	getLibelle(aMode) {
		switch (aMode) {
			case TypeModeInfosADE.tMIADE_Creation:
				return ObjetTraduction_1.GTraductions.getValeur(
					"TypeModeAssociationDevoirEvaluation.CreerUnDevoir",
				);
			case TypeModeInfosADE.tMIADE_Modification:
				return ObjetTraduction_1.GTraductions.getValeur(
					"TypeModeAssociationDevoirEvaluation.ModifierLeDevoir",
				);
			case TypeModeInfosADE.tMIADE_SuppressionD:
				return ObjetTraduction_1.GTraductions.getValeur(
					"TypeModeAssociationDevoirEvaluation.SupprimerLeDevoir",
				);
			case TypeModeInfosADE.tMIADE_SuppressionA:
				return ObjetTraduction_1.GTraductions.getValeur(
					"TypeModeAssociationDevoirEvaluation.SupprimerLeLienDevoirEvaluation",
				);
		}
		return "";
	},
};
exports.TypeModeInfosADEUtil = TypeModeInfosADEUtil;
