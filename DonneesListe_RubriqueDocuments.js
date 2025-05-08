const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const {
	UtilitaireDocumentATelecharger,
} = require("UtilitaireDocumentATelecharger.js");
class DonneesListe_RubriqueDocuments extends ObjetDonneesListeFlatDesign {
	constructor(aListe, aParams) {
		super(aListe);
		this.parametres = Object.assign({}, aParams);
		this.setOptions({
			avecTri: false,
			avecDeselectionSurNonSelectionnable: false,
			flatDesignMinimal: true,
			avecBoutonActionLigne: false,
			avecSelection: true,
			avecEvnt_Selection: true,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle().ucfirst();
	}
	getZoneGauche(aParams) {
		return UtilitaireDocumentATelecharger.getIconListeRubrique({
			categorie: aParams.article,
		});
	}
	getZoneComplementaire(aParams) {
		if (aParams.article.compteur >= 0) {
			return `<div class="ie-texte">${aParams.article.compteur}</div>`;
		}
		return "";
	}
}
module.exports = { DonneesListe_RubriqueDocuments };
