exports.TypeNiveauDifficulteUtil = exports.TypeNiveauDifficulte = void 0;
var TypeNiveauDifficulte;
(function (TypeNiveauDifficulte) {
	TypeNiveauDifficulte[(TypeNiveauDifficulte["ND_NonPrecise"] = 0)] =
		"ND_NonPrecise";
	TypeNiveauDifficulte[(TypeNiveauDifficulte["ND_Facile"] = 1)] = "ND_Facile";
	TypeNiveauDifficulte[(TypeNiveauDifficulte["ND_Moyen"] = 2)] = "ND_Moyen";
	TypeNiveauDifficulte[(TypeNiveauDifficulte["ND_Difficile"] = 3)] =
		"ND_Difficile";
})(
	TypeNiveauDifficulte ||
		(exports.TypeNiveauDifficulte = TypeNiveauDifficulte = {}),
);
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
function creerIconEtoile(aArrayEtoiles, aColor) {
	const lResult = [];
	let lStyle = "";
	if (aColor) {
		lStyle = ' style="color:' + aColor + ';"';
	}
	for (const i in aArrayEtoiles) {
		let lIcon = "icon_star_empty";
		if (aArrayEtoiles[i]) {
			lIcon = "icon_star";
		}
		lResult.push('<i class="material-icons ', lIcon, '"', lStyle, "></i>");
	}
	return lResult.join("");
}
const TypeNiveauDifficulteUtil = {
	typeToStr(aNiveauDifficulte, aAvecValPourNonPrecise) {
		if (
			!aAvecValPourNonPrecise &&
			aNiveauDifficulte === TypeNiveauDifficulte.ND_NonPrecise
		) {
			return "";
		}
		return ObjetTraduction_1.GTraductions.getValeur(
			"TypeNiveauDifficulte." + aNiveauDifficulte,
		);
	},
	getImage(aNiveauDifficulte, aParams) {
		return aNiveauDifficulte
			? [
					"<div",
					aParams.alignementMilieu || aParams.enInlineBlock
						? ' class="' +
							(aParams.alignementMilieu ? "AlignementMilieu" : "") +
							" " +
							(aParams.enInlineBlock ? "InlineBlock" : "") +
							'" '
						: "",
					aParams.avecTitle ||
					aParams.avecTitle === null ||
					aParams.avecTitle === undefined
						? ' title="' +
							TypeNiveauDifficulteUtil.typeToStr(
								aNiveauDifficulte,
								aParams.avecValPourNonPrecise,
							) +
							'"'
						: "",
					">",
					TypeNiveauDifficulteUtil.construireIcon(
						aNiveauDifficulte,
						aParams.color,
					),
					"</div>",
				].join("")
			: "";
	},
	construireIcon(aNiveauDifficulte, aColor) {
		switch (aNiveauDifficulte) {
			case TypeNiveauDifficulte.ND_Facile:
				return creerIconEtoile([1, 0, 0], aColor);
			case TypeNiveauDifficulte.ND_Moyen:
				return creerIconEtoile([1, 1, 0], aColor);
			case TypeNiveauDifficulte.ND_Difficile:
				return creerIconEtoile([1, 1, 1], aColor);
			default:
				return "";
		}
	},
	toElement(aGenre, aAvecValPourNonPrecise) {
		return new ObjetElement_1.ObjetElement(
			TypeNiveauDifficulteUtil.typeToStr(aGenre, aAvecValPourNonPrecise),
			0,
			aGenre,
		);
	},
	fromElement(aElement) {
		return aElement !== null && aElement !== undefined
			? aElement.getGenre()
			: TypeNiveauDifficulte.ND_NonPrecise;
	},
	toListe(aAvecValPourNonPrecise) {
		const lListeNiveaux = new ObjetListeElements_1.ObjetListeElements();
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeNiveauDifficulte,
		)) {
			const lNiveau = TypeNiveauDifficulte[lKey];
			lListeNiveaux.addElement(
				TypeNiveauDifficulteUtil.toElement(lNiveau, aAvecValPourNonPrecise),
			);
		}
		lListeNiveaux.setTri([ObjetTri_1.ObjetTri.init("Genre")]);
		lListeNiveaux.trier();
		return lListeNiveaux;
	},
};
exports.TypeNiveauDifficulteUtil = TypeNiveauDifficulteUtil;
