exports.TypeGenreICalUtil = exports.TypeGenreICal = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
var TypeGenreICal;
(function (TypeGenreICal) {
	TypeGenreICal[(TypeGenreICal["ICal_EDT"] = 0)] = "ICal_EDT";
	TypeGenreICal[(TypeGenreICal["ICal_Agenda"] = 1)] = "ICal_Agenda";
	TypeGenreICal[(TypeGenreICal["ICal_Perso"] = 2)] = "ICal_Perso";
})(TypeGenreICal || (exports.TypeGenreICal = TypeGenreICal = {}));
exports.TypeGenreICalUtil = {
	getPrefixICal(aGenreICal) {
		switch (aGenreICal) {
			case TypeGenreICal.ICal_EDT:
				return "Edt";
			case TypeGenreICal.ICal_Agenda:
				return "Agenda";
			case TypeGenreICal.ICal_Perso:
				return "Perso";
			default:
				break;
		}
		return "";
	},
	getLibelle(aGenreICal) {
		switch (aGenreICal) {
			case TypeGenreICal.ICal_EDT:
				return ObjetTraduction_1.GTraductions.getValeur("TypeGenreICal.EDT");
			case TypeGenreICal.ICal_Agenda:
				return ObjetTraduction_1.GTraductions.getValeur("TypeGenreICal.Agenda");
			case TypeGenreICal.ICal_Perso:
				return ObjetTraduction_1.GTraductions.getValeur("TypeGenreICal.Perso");
		}
		return "";
	},
};
