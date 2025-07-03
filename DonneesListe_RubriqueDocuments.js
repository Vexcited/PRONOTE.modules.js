exports.DonneesListe_RubriqueDocuments = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const MethodesObjet_1 = require("MethodesObjet");
class DonneesListe_RubriqueDocuments extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListe) {
		super(aListe);
		this.setOptions({
			avecEllipsis: false,
			avecTri: false,
			avecDeselectionSurNonSelectionnable: false,
			flatDesignMinimal: !IE.estMobile,
			avecBoutonActionLigne: false,
			avecSelection: true,
			avecEvnt_Selection: true,
			avecIndentationSousInterTitre: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle().ucfirst();
	}
	getIconeGaucheContenuFormate(aParams) {
		var _a, _b;
		return (_b =
			(_a = aParams.article) === null || _a === void 0 ? void 0 : _a.icon) !==
			null && _b !== void 0
			? _b
			: "";
	}
	avecEvenementSelection(aParams) {
		return (
			super.avecEvenementSelection(aParams) && !aParams.article.estLigneOff
		);
	}
	getClassCelluleConteneur(aParams) {
		return this.estInterTitre(aParams.article) ? "margin-inter-titre" : "";
	}
	getZoneComplementaire(aParams) {
		return MethodesObjet_1.MethodesObjet.isNumber(aParams.article.compteur) &&
			aParams.article.compteur > 0
			? IE.jsx.str(
					"p",
					{
						"ie-tooltiplabel": !!aParams.article.titleCompteur
							? aParams.article.titleCompteur
							: false,
						class: "ie-texte",
					},
					aParams.article.compteur,
				)
			: "";
	}
}
exports.DonneesListe_RubriqueDocuments = DonneesListe_RubriqueDocuments;
