exports.DonneesListe_SelectionPersonnel = void 0;
const ObjetTri_1 = require("ObjetTri");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_SelectionPersonnel extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecBoutonActionLigne: false,
			flatDesignMinimal: true,
			avecEvnt_Selection: true,
		});
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.getNumero();
			}),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
}
exports.DonneesListe_SelectionPersonnel = DonneesListe_SelectionPersonnel;
