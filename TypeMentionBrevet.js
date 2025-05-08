exports.TypeMentionBrevetUtil = exports.TypeMentionBrevet = void 0;
var TypeMentionBrevet;
(function (TypeMentionBrevet) {
	TypeMentionBrevet[(TypeMentionBrevet["tmbAucune"] = 0)] = "tmbAucune";
	TypeMentionBrevet[(TypeMentionBrevet["tmbAssezBien"] = 1)] = "tmbAssezBien";
	TypeMentionBrevet[(TypeMentionBrevet["tmbBien"] = 2)] = "tmbBien";
	TypeMentionBrevet[(TypeMentionBrevet["tmbTresBien"] = 3)] = "tmbTresBien";
})(TypeMentionBrevet || (exports.TypeMentionBrevet = TypeMentionBrevet = {}));
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeMentionBrevetUtil = {
	getLibelle(aGenre) {
		switch (aGenre) {
			case TypeMentionBrevet.tmbAucune:
				return "";
			case TypeMentionBrevet.tmbAssezBien:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.MentionBrevet.AssezBien",
				);
			case TypeMentionBrevet.tmbBien:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.MentionBrevet.Bien",
				);
			case TypeMentionBrevet.tmbTresBien:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.MentionBrevet.TresBien",
				);
			default:
				return "";
		}
	},
	getOrdre(aGenre) {
		return [0, 1, 2, 3][aGenre];
	},
	toListe() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeMentionBrevet,
		)) {
			const lRendu = TypeMentionBrevet[lKey];
			const lElement = new ObjetElement_1.ObjetElement(
				TypeMentionBrevetUtil.getLibelle(lRendu),
				undefined,
				lRendu,
			);
			lElement.ordre = TypeMentionBrevetUtil.getOrdre(lRendu);
			lListe.addElement(lElement);
		}
		lListe.setTri([ObjetTri_1.ObjetTri.init("ordre")]);
		lListe.trier();
		return lListe;
	},
};
exports.TypeMentionBrevetUtil = TypeMentionBrevetUtil;
