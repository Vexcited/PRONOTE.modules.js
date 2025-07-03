exports.TypeEtatSatisfactionUtil = exports.TypeEtatSatisfaction = void 0;
var TypeEtatSatisfaction;
(function (TypeEtatSatisfaction) {
	TypeEtatSatisfaction[(TypeEtatSatisfaction["Tes_NonEvalue"] = 0)] =
		"Tes_NonEvalue";
	TypeEtatSatisfaction[(TypeEtatSatisfaction["Tes_TresInsatisfait"] = 1)] =
		"Tes_TresInsatisfait";
	TypeEtatSatisfaction[(TypeEtatSatisfaction["Tes_Insatisfait"] = 2)] =
		"Tes_Insatisfait";
	TypeEtatSatisfaction[(TypeEtatSatisfaction["Tes_Satisfait"] = 3)] =
		"Tes_Satisfait";
	TypeEtatSatisfaction[(TypeEtatSatisfaction["Tes_TresSatisfait"] = 4)] =
		"Tes_TresSatisfait";
})(
	TypeEtatSatisfaction ||
		(exports.TypeEtatSatisfaction = TypeEtatSatisfaction = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTraduction_2 = require("ObjetTraduction");
const TradTypeEtatSatisfaction = ObjetTraduction_2.TraductionsModule.getModule(
	"TypeEtatSatisfaction",
	{ TresInsatisfait: "", Insatisfait: "", Satisfait: "", TresSatisfait: "" },
);
function _addClass(aParams) {
	if (aParams && aParams.class) {
		return aParams.class;
	} else {
		return "Texte12";
	}
}
function _addColor(aParams) {
	if (aParams && aParams.color) {
		return ' style="color: ' + aParams.color + '"';
	} else {
		return "";
	}
}
const TypeEtatSatisfactionUtil = {
	getLibelle(aGenre) {
		switch (aGenre) {
			case TypeEtatSatisfaction.Tes_NonEvalue:
				return "";
			case TypeEtatSatisfaction.Tes_TresInsatisfait:
				return TradTypeEtatSatisfaction.TresInsatisfait;
			case TypeEtatSatisfaction.Tes_Insatisfait:
				return TradTypeEtatSatisfaction.Insatisfait;
			case TypeEtatSatisfaction.Tes_Satisfait:
				return TradTypeEtatSatisfaction.Satisfait;
			case TypeEtatSatisfaction.Tes_TresSatisfait:
				return TradTypeEtatSatisfaction.TresSatisfait;
			default:
				return "";
		}
	},
	getImage(aGenre) {
		switch (aGenre) {
			case TypeEtatSatisfaction.Tes_NonEvalue:
				return "";
			case TypeEtatSatisfaction.Tes_TresInsatisfait:
				return "Image_EvaluationTresInsatisfait";
			case TypeEtatSatisfaction.Tes_Insatisfait:
				return "Image_EvaluationInsatisfait";
			case TypeEtatSatisfaction.Tes_Satisfait:
				return "Image_EvaluationSatisfait";
			case TypeEtatSatisfaction.Tes_TresSatisfait:
				return "Image_EvaluationTresSatisfait";
			default:
				return "";
		}
	},
	getIcon(aGenre, aParams) {
		const lCouleurBase = "#c5c5c5";
		const lCouleurNonEditable = "#cccccc";
		const lCouleurTresInsatisfait = "#ee4242";
		const lCouleurInsatisfait = "#ff7944";
		const lCouleurSatisfait = "#26a911";
		const lCouleurTresSatisfait = "#13a9e1";
		const lIcon = [];
		const lClass = [];
		lIcon.push(
			'<i role="img" aria-label="',
			this.getLibelle(aGenre),
			" - ",
			aParams.actif
				? ObjetTraduction_1.GTraductions.getValeur(
						"questionnaireStage.wai.selectionne",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"questionnaireStage.wai.nonSelectionne",
					),
			'" class=',
		);
		switch (aGenre) {
			case TypeEtatSatisfaction.Tes_NonEvalue:
				return "";
			case TypeEtatSatisfaction.Tes_TresInsatisfait:
				lClass.push("icon_tres_insatisfait");
				lClass.push(_addClass(aParams));
				lIcon.push('"', lClass.join(" "), '"');
				if (aParams && aParams.actif && !aParams.color) {
					aParams.color = lCouleurTresInsatisfait;
				} else if (
					aParams &&
					!aParams.actif &&
					!aParams.color &&
					aParams.nonEditable
				) {
					aParams.color = lCouleurNonEditable;
				} else {
					aParams.color = lCouleurBase;
				}
				lIcon.push(_addColor(aParams));
				break;
			case TypeEtatSatisfaction.Tes_Insatisfait:
				lClass.push("icon_insatisfait");
				lClass.push(_addClass(aParams));
				lIcon.push('"', lClass.join(" "), '"');
				if (aParams && aParams.actif && !aParams.color) {
					aParams.color = lCouleurInsatisfait;
				} else if (
					aParams &&
					!aParams.actif &&
					!aParams.color &&
					aParams.nonEditable
				) {
					aParams.color = lCouleurNonEditable;
				} else {
					aParams.color = lCouleurBase;
				}
				lIcon.push(_addColor(aParams));
				break;
			case TypeEtatSatisfaction.Tes_Satisfait:
				lClass.push("icon_smile");
				lClass.push(_addClass(aParams));
				lIcon.push('"', lClass.join(" "), '"');
				if (aParams && aParams.actif && !aParams.color) {
					aParams.color = lCouleurSatisfait;
				} else if (
					aParams &&
					!aParams.actif &&
					!aParams.color &&
					aParams.nonEditable
				) {
					aParams.color = lCouleurNonEditable;
				} else {
					aParams.color = lCouleurBase;
				}
				lIcon.push(_addColor(aParams));
				break;
			case TypeEtatSatisfaction.Tes_TresSatisfait:
				lClass.push("icon_tres_satisfait");
				lClass.push(_addClass(aParams));
				lIcon.push('"', lClass.join(" "), '"');
				if (aParams && aParams.actif && !aParams.color) {
					aParams.color = lCouleurTresSatisfait;
				} else if (
					aParams &&
					!aParams.actif &&
					!aParams.color &&
					aParams.nonEditable
				) {
					aParams.color = lCouleurNonEditable;
				} else {
					aParams.color = lCouleurBase;
				}
				lIcon.push(_addColor(aParams));
				break;
			default:
				return "";
		}
		lIcon.push("></i>");
		return lIcon.join("");
	},
	getImageListe(aGenre) {
		switch (aGenre) {
			case TypeEtatSatisfaction.Tes_NonEvalue:
				return "";
			case TypeEtatSatisfaction.Tes_TresInsatisfait:
				return "Image_EvaluationTresInsatisfaitListe";
			case TypeEtatSatisfaction.Tes_Insatisfait:
				return "Image_EvaluationInsatisfaitListe";
			case TypeEtatSatisfaction.Tes_Satisfait:
				return "Image_EvaluationSatisfaitListe";
			case TypeEtatSatisfaction.Tes_TresSatisfait:
				return "Image_EvaluationTresSatisfaitListe";
			default:
				return "";
		}
	},
};
exports.TypeEtatSatisfactionUtil = TypeEtatSatisfactionUtil;
