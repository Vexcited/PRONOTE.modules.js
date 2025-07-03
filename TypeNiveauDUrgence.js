exports.TypeNiveauDUrgenceUtil = exports.TypeNiveauDUrgence = void 0;
var TypeNiveauDUrgence;
(function (TypeNiveauDUrgence) {
	TypeNiveauDUrgence[(TypeNiveauDUrgence["Tndu_Bas"] = 0)] = "Tndu_Bas";
	TypeNiveauDUrgence[(TypeNiveauDUrgence["Tndu_Normal"] = 1)] = "Tndu_Normal";
	TypeNiveauDUrgence[(TypeNiveauDUrgence["Tndu_Eleve"] = 2)] = "Tndu_Eleve";
	TypeNiveauDUrgence[(TypeNiveauDUrgence["Tndu_Prioritaire"] = 3)] =
		"Tndu_Prioritaire";
})(
	TypeNiveauDUrgence || (exports.TypeNiveauDUrgence = TypeNiveauDUrgence = {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const MethodesObjet_1 = require("MethodesObjet");
const TypeNiveauDUrgenceUtil = {
	toListe() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeNiveauDUrgence,
		)) {
			const lValeurType = TypeNiveauDUrgence[lKey];
			lListe.add(
				ObjetElement_1.ObjetElement.create({
					Libelle: TypeNiveauDUrgenceUtil.getLibelle(lValeurType),
					Numero: 0,
					Genre: lValeurType,
				}),
			);
		}
		return lListe;
	},
	getLibelle(aTypeDUrgence) {
		return ObjetTraduction_1.GTraductions.getValeur(
			"TypeNiveauDUrgence.Libelle.type_" + aTypeDUrgence,
		);
	},
};
exports.TypeNiveauDUrgenceUtil = TypeNiveauDUrgenceUtil;
