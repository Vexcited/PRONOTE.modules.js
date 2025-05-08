const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
class DonneesListeSondagesBiblio extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecRechercheSelectionMiroir: true,
			avecTri: false,
			avecBoutonActionLigne: false,
		});
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		if (aParams.article && aParams.article.estUnDeploiement) {
			H.push(aParams.article.categorie.getLibelle());
		}
		return H.join("");
	}
	estSelectionCibleMiroirDeSelectionSource(
		aParamsCelluleSource,
		aParamsCelluleCible,
	) {
		return (
			!!aParamsCelluleSource.article.pere &&
			aParamsCelluleSource.article.pere.getNumero() ===
				aParamsCelluleCible.article.getNumero()
		);
	}
	getVisible(D) {
		return D.visible !== false;
	}
}
module.exports = { DonneesListeSondagesBiblio };
