exports.DonneesListe_SelecteurMembreCP = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_SelecteurMembreCP extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_SelectionClick: true,
			avecTri: false,
			avecEllipsis: false,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getZoneGauche(aParams) {
		return this.composePhoto(aParams.article);
	}
	avecSelection(aParams) {
		return true;
	}
	avecEvenementSelection(aParams) {
		return this.avecSelection(aParams);
	}
	getHtmlPhotoAppli() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"figure",
				{ "aria-hidden": "true", class: "identite-appli" },
				IE.jsx.str("i", { class: "icon_user" }),
			),
		);
	}
}
exports.DonneesListe_SelecteurMembreCP = DonneesListe_SelecteurMembreCP;
