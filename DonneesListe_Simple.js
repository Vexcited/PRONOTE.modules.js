exports.DonneesListe_Simple = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
class DonneesListe_Simple extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aOptions) {
		super(aDonnees);
		const lOptionsParDefaut = {
			avecSelection: true,
			avecEdition: false,
			avecMenuContextuel: true,
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecEvnt_Edition: false,
			avecEvnt_Creation: false,
			avecEvnt_ApresSuppression: false,
			avecTri: true,
		};
		this.setOptions($.extend(lOptionsParDefaut, aOptions));
	}
	getCouleurCellule() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
}
exports.DonneesListe_Simple = DonneesListe_Simple;
