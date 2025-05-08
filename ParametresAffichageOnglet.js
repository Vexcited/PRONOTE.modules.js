exports.ParametresAffichageOnglet = void 0;
const ParametresAffichage_1 = require("ParametresAffichage");
const ParametresAffichageDivers_1 = require("ParametresAffichageDivers");
class ParametresAffichageOnglet extends ParametresAffichage_1.ObjetParametresAffichage {
	constructor(aNom, aLargeur, aHauteur, aCouleur, aTexte, aBordure, aImage) {
		super(aNom);
		this.addParametre(
			new ParametresAffichage_1.ParametreAffichage(
				"largeur",
				aLargeur !== null && aLargeur !== undefined ? aLargeur : 100,
			),
		);
		this.addParametre(
			new ParametresAffichage_1.ParametreAffichage(
				"hauteur",
				aHauteur !== null && aHauteur !== undefined ? aHauteur : 15,
			),
		);
		const lCouleur =
			aCouleur !== null && aCouleur !== undefined ? aCouleur : "white";
		this.addParametre(
			new ParametresAffichage_1.ParametreAffichage("couleur", lCouleur),
		);
		this.addParametre(
			aTexte !== null && aTexte !== undefined
				? aTexte
				: new ParametresAffichageDivers_1.ParametresAffichageTexte("texte"),
		);
		this.addParametre(
			aBordure !== null && aBordure !== undefined
				? aBordure
				: new ParametresAffichageDivers_1.ParametresAffichageBordure("bordure"),
		);
		this.addParametre(aImage);
	}
	setCouleur(aBase, aSelection, aSurvol) {
		this.getParametre("couleur").setValeur(aBase, aSelection, aSurvol);
	}
	getLargeur(aSelectionne, aSurvol) {
		return this.getParametre("largeur").getValeur(aSelectionne, aSurvol);
	}
	getHauteur(aSelectionne, aSurvol) {
		return this.getParametre("hauteur").getValeur(aSelectionne, aSurvol);
	}
	getCouleur(aSelectionne, aSurvol) {
		return this.getParametre("couleur").getValeur(aSelectionne, aSurvol);
	}
	getCouleurTexte(aSelectionne, aSurvol) {
		return this.getParametre("texte")
			.getParametre("couleur")
			.getValeur(aSelectionne, aSurvol);
	}
	getTailleTexte(aSelectionne, aSurvol) {
		return this.getParametre("texte")
			.getParametre("taillePolice")
			.getValeur(aSelectionne, aSurvol);
	}
	getTexteGras(aSelectionne, aSurvol) {
		return this.getParametre("texte")
			.getParametre("gras")
			.getValeur(aSelectionne, aSurvol);
	}
	getTexteSouligne(aSelectionne, aSurvol) {
		return this.getParametre("texte")
			.getParametre("souligne")
			.getValeur(aSelectionne, aSurvol);
	}
	getTexteAlignement(aSelectionne, aSurvol) {
		return this.getParametre("texte")
			.getParametre("alignementHorizontal")
			.getValeur(aSelectionne, aSurvol);
	}
	getAvecBordure(aSelectionne, aSurvol) {
		return this.getParametre("bordure")
			.getParametre("avec")
			.getValeur(aSelectionne, aSurvol);
	}
	getCouleurBordureCoinSuperieurGauche(aSelectionne, aSurvol) {
		return this.getParametre("bordure")
			.getParametre("coinSuperieurGauche")
			.getParametre("couleur")
			.getValeur(aSelectionne, aSurvol);
	}
	getCouleurBordureCoinInferieurDroit(aSelectionne, aSurvol) {
		return this.getParametre("bordure")
			.getParametre("coinInferieurDroit")
			.getParametre("couleur")
			.getValeur(aSelectionne, aSurvol);
	}
	getEpaisseurBordureCoinSuperieurGauche(aSelectionne, aSurvol) {
		return this.getParametre("bordure")
			.getParametre("coinSuperieurGauche")
			.getParametre("epaisseur")
			.getValeur(aSelectionne, aSurvol);
	}
	getEpaisseurBordureCoinInferieurDroit(aSelectionne, aSurvol) {
		return this.getParametre("bordure")
			.getParametre("coinInferieurDroit")
			.getParametre("epaisseur")
			.getValeur(aSelectionne, aSurvol);
	}
}
exports.ParametresAffichageOnglet = ParametresAffichageOnglet;
