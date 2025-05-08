exports.TypeAvisConseilUtil = exports.TypeAvisConseil = void 0;
var TypeAvisConseil;
(function (TypeAvisConseil) {
	TypeAvisConseil[(TypeAvisConseil["taco_Aucun"] = 0)] = "taco_Aucun";
	TypeAvisConseil[(TypeAvisConseil["taco_TresFavorable"] = 1)] =
		"taco_TresFavorable";
	TypeAvisConseil[(TypeAvisConseil["taco_Favorable"] = 2)] = "taco_Favorable";
	TypeAvisConseil[(TypeAvisConseil["taco_Reserve"] = 3)] = "taco_Reserve";
	TypeAvisConseil[(TypeAvisConseil["taco_Defavorable"] = 4)] =
		"taco_Defavorable";
})(TypeAvisConseil || (exports.TypeAvisConseil = TypeAvisConseil = {}));
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeAvisConseilUtil = {
	toListe() {
		const lArray = [];
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeAvisConseil,
		)) {
			const lValeurType = TypeAvisConseil[lKey];
			lArray.push(lValeurType);
		}
		return lArray;
	},
	getLibelleOuiNon(aTypeAvis) {
		return ObjetTraduction_1.GTraductions.getValeur(
			"TypeAvisConseil.LibelleOuiNon.type_" + aTypeAvis,
		);
	},
	getLibelle(aTypeAvis) {
		return ObjetTraduction_1.GTraductions.getValeur(
			"TypeAvisConseil.Libelle.type_" + aTypeAvis,
		);
	},
	getAbbreviation(aTypeAvis) {
		return ObjetTraduction_1.GTraductions.getValeur(
			"TypeAvisConseil.Abbreviation.type_" + aTypeAvis,
		);
	},
};
exports.TypeAvisConseilUtil = TypeAvisConseilUtil;
