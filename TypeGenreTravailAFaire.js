exports.TypeGenreTravailAFaireUtil = exports.TypeGenreTravailAFaire = void 0;
var TypeGenreTravailAFaire;
(function (TypeGenreTravailAFaire) {
	TypeGenreTravailAFaire[(TypeGenreTravailAFaire["tGTAF_Travail"] = 0)] =
		"tGTAF_Travail";
	TypeGenreTravailAFaire[(TypeGenreTravailAFaire["tGTAF_Activite"] = 1)] =
		"tGTAF_Activite";
})(
	TypeGenreTravailAFaire ||
		(exports.TypeGenreTravailAFaire = TypeGenreTravailAFaire = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreTravailAFaireUtil = {
	getStr(aType) {
		switch (aType) {
			case TypeGenreTravailAFaire.tGTAF_Travail:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TravailALaMaison",
				);
			case TypeGenreTravailAFaire.tGTAF_Activite:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.ActiviteEnClasse",
				);
			default:
				return "";
		}
	},
	getIcone(aType) {
		switch (aType) {
			case TypeGenreTravailAFaire.tGTAF_Travail:
				return "icon_home";
			case TypeGenreTravailAFaire.tGTAF_Activite:
				return "icon_ecole";
			default:
				return "icon_notdef";
		}
	},
	getCouleur(aType) {
		switch (aType) {
			case TypeGenreTravailAFaire.tGTAF_Travail:
				return "#7CB744";
			case TypeGenreTravailAFaire.tGTAF_Activite:
				return "#AB96E4";
			default:
				return "#7CB744";
		}
	},
};
exports.TypeGenreTravailAFaireUtil = TypeGenreTravailAFaireUtil;
