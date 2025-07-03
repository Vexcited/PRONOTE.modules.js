exports.DonneesListe_SelectionMatiere = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const ObjetTri_1 = require("ObjetTri");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_SelectionMatiere extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aFiltreEnseignees) {
		super(aDonnees);
		this.setOptions({
			avecBoutonActionLigne: false,
			avecEvnt_Selection: true,
			flatDesignMinimal: true,
		});
		this.filtreUniquementEnseignees = aFiltreEnseignees === true;
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getZoneMessage(aParams) {
		return aParams.article.code || "";
	}
	getZoneGauche(aParams) {
		return aParams.article.couleur
			? '<div style="' +
					ObjetStyle_1.GStyle.composeCouleurFond(aParams.article.couleur) +
					'height:2rem;padding:0.2rem;border-radius:0.4rem;"></div>'
			: '<div class="m-right"></div>';
	}
	getVisible(D) {
		if (this.filtreUniquementEnseignees) {
			return D.estEnseignee === true;
		}
		return true;
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.existeNumero();
			}),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
}
exports.DonneesListe_SelectionMatiere = DonneesListe_SelectionMatiere;
