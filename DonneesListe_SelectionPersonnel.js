const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetTri } = require("ObjetTri.js");
class DonneesListe_SelectionPersonnel extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionPersonnel.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri.init((D) => {
				return !!D.getNumero();
			}),
		);
		lTris.push(ObjetTri.init("Libelle"));
		return lTris;
	}
}
DonneesListe_SelectionPersonnel.colonnes = {
	libelle: "DL_SelectionPersonnel_libelle",
};
module.exports = { DonneesListe_SelectionPersonnel };
