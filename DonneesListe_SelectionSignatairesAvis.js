exports.DonneesListe_SelectionSignatairesAvis = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_SelectionSignatairesAvis extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_Selection: true,
			avecBoutonActionLigne: false,
			avecDeselectionSurNonSelectionnable: true,
			avecDeploiement: true,
			avecSelection: true,
			avecEvnt_SelectionClick: true,
		});
	}
	getTitreZonePrincipale(aDonnees) {
		let H = [];
		H.push(
			`<div ie-ellipsis  class="ie-titre"><span>${aDonnees.article.getLibelle()}</span>`,
		);
		H.push(`</div>`);
		return H.join("");
	}
	avecSelection(aDonnees) {
		return !aDonnees.article.estUnDeploiement;
	}
	avecEvenementSelection(aDonnees) {
		return !aDonnees.article.estUnDeploiement;
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getLibelle();
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getNumero();
				}),
			]),
		];
	}
}
exports.DonneesListe_SelectionSignatairesAvis =
	DonneesListe_SelectionSignatairesAvis;
