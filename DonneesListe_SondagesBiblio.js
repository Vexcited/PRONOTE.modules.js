exports.DonneesListeSondagesBiblio = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListeSondagesBiblio extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
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
exports.DonneesListeSondagesBiblio = DonneesListeSondagesBiblio;
