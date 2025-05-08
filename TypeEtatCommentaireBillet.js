exports.TypeEtatCommentaireBilletUtil = exports.TypeEtatCommentaireBillet =
	void 0;
var TypeEtatCommentaireBillet;
(function (TypeEtatCommentaireBillet) {
	TypeEtatCommentaireBillet[
		(TypeEtatCommentaireBillet["ECB_EnAttenteValidation"] = 0)
	] = "ECB_EnAttenteValidation";
	TypeEtatCommentaireBillet[(TypeEtatCommentaireBillet["ECB_Publie"] = 1)] =
		"ECB_Publie";
	TypeEtatCommentaireBillet[(TypeEtatCommentaireBillet["ECB_Refuse"] = 2)] =
		"ECB_Refuse";
	TypeEtatCommentaireBillet[(TypeEtatCommentaireBillet["ECB_Supprime"] = 3)] =
		"ECB_Supprime";
})(
	TypeEtatCommentaireBillet ||
		(exports.TypeEtatCommentaireBillet = TypeEtatCommentaireBillet = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEtatCommentaireBilletUtil = {
	getStrEtat(aEtat) {
		switch (aEtat) {
			case TypeEtatCommentaireBillet.ECB_EnAttenteValidation:
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.typeEtatCommentaire.enAttente",
				);
			case TypeEtatCommentaireBillet.ECB_Publie:
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.typeEtatCommentaire.publie",
				);
			case TypeEtatCommentaireBillet.ECB_Refuse:
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.typeEtatCommentaire.refuse",
				);
			case TypeEtatCommentaireBillet.ECB_Supprime:
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.typeEtatCommentaire.supprime",
				);
		}
		return "";
	},
	getIcon(aEtat) {
		switch (aEtat) {
			case TypeEtatCommentaireBillet.ECB_EnAttenteValidation:
				return "icon_edt_permanence";
			case TypeEtatCommentaireBillet.ECB_Publie:
				return "icon_check_fin";
			case TypeEtatCommentaireBillet.ECB_Refuse:
				return "icon_fermeture_widget";
			case TypeEtatCommentaireBillet.ECB_Supprime:
				return "icon_fermeture_widget";
		}
		return "";
	},
	getClass(aEtat) {
		switch (aEtat) {
			case TypeEtatCommentaireBillet.ECB_EnAttenteValidation:
				return "warn";
			case TypeEtatCommentaireBillet.ECB_Publie:
				return "ok";
			case TypeEtatCommentaireBillet.ECB_Refuse:
				return "notOK";
			case TypeEtatCommentaireBillet.ECB_Supprime:
				return "delete";
		}
		return "";
	},
};
exports.TypeEtatCommentaireBilletUtil = TypeEtatCommentaireBilletUtil;
