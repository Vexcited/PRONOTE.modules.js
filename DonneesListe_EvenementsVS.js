const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
class DonneesListe_EvenementsVS extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aAvecTotalHeuresManquees) {
		super(aDonnees);
		this.avecTotalHeuresManquees = !!aAvecTotalHeuresManquees;
		this.setOptions({
			avecEvnt_Selection: true,
			avecDeselectionSurNonSelectionnable: false,
			avecEvnt_SelectionDblClick: false,
			avecBoutonActionLigne: false,
			avecTri: false,
		});
	}
	avecSurvolCelluleVisible(aParams) {
		return aParams.article.nombre !== 0 && aParams.ligne !== 0;
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.titreSection;
	}
	getInfosSuppZonePrincipale(aParams) {
		return aParams.article.detail;
	}
	getZoneGauche(aParams) {
		return (
			'<div class="zone-contenu-format"><i aria-hidden="true" class="icon ' +
			aParams.article.iconSection +
			'"></i></div>'
		);
	}
	getZoneComplementaire(aParams) {
		const lClasses = [];
		if (aParams.ligne === 0) {
			lClasses.push("total");
		}
		return (
			"<span" +
			(lClasses.length ? ' class="' + lClasses.join(" ") + '"' : "") +
			">" +
			aParams.article.nombre +
			"</span>"
		);
	}
	getClass(aParams) {
		const lClass =
			"celluleEvenementVS " +
			(aParams.ligne === 0 &&
			!GEtatUtilisateur.pourPrimaire() &&
			this.avecTotalHeuresManquees
				? "total"
				: "");
		return lClass;
	}
	getClassCelluleConteneur() {
		return "fd_ligne";
	}
	getVisible(aParams) {
		return aParams.estVisible;
	}
}
module.exports = { DonneesListe_EvenementsVS };
