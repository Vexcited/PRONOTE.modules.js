exports.TypeAbsencePartieGAEVUtil = exports.TypeAbsencePartieGAEV = void 0;
var TypeAbsencePartieGAEV;
(function (TypeAbsencePartieGAEV) {
	TypeAbsencePartieGAEV[(TypeAbsencePartieGAEV["AGAEVPresent"] = 0)] =
		"AGAEVPresent";
	TypeAbsencePartieGAEV[(TypeAbsencePartieGAEV["AGAEVAbsent"] = 1)] =
		"AGAEVAbsent";
	TypeAbsencePartieGAEV[(TypeAbsencePartieGAEV["AGAEVStage"] = 2)] =
		"AGAEVStage";
	TypeAbsencePartieGAEV[(TypeAbsencePartieGAEV["AGAEVClasseAbsente"] = 3)] =
		"AGAEVClasseAbsente";
	TypeAbsencePartieGAEV[(TypeAbsencePartieGAEV["AGAEVExclusion"] = 4)] =
		"AGAEVExclusion";
})(
	TypeAbsencePartieGAEV ||
		(exports.TypeAbsencePartieGAEV = TypeAbsencePartieGAEV = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeAbsencePartieGAEVUtil = {
	getImageAbsent(aGenre) {
		switch (aGenre) {
			case TypeAbsencePartieGAEV.AGAEVAbsent:
				return "Image_DiagAbsClasse";
			case TypeAbsencePartieGAEV.AGAEVStage:
				return "Image_DiagStageEleve";
			case TypeAbsencePartieGAEV.AGAEVClasseAbsente:
				return "Image_DiagAbsClasse";
			case TypeAbsencePartieGAEV.AGAEVExclusion:
				return "Image_DiagEleveExclu";
			default:
		}
		return "";
	},
	getLettreAbsent(aGenre) {
		switch (aGenre) {
			case TypeAbsencePartieGAEV.AGAEVAbsent:
				return ObjetTraduction_1.GTraductions.getValeur(
					"ChoixEleveGAEV.LettreAbsenceEleve",
				);
			case TypeAbsencePartieGAEV.AGAEVStage:
			case TypeAbsencePartieGAEV.AGAEVExclusion:
				return "&nbsp;";
			case TypeAbsencePartieGAEV.AGAEVClasseAbsente:
				return ObjetTraduction_1.GTraductions.getValeur(
					"ChoixEleveGAEV.LettreAbsenceClasse",
				);
			default:
		}
		return "";
	},
};
exports.TypeAbsencePartieGAEVUtil = TypeAbsencePartieGAEVUtil;
