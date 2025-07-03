exports.DonneesListe_EvenementsVS = void 0;
const AccessApp_1 = require("AccessApp");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_EvenementsVS extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aAvecTotalHeuresManquees) {
		super(aDonnees);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
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
			'<div class="zone-contenu-format"><i role="presentation" class="icon ' +
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
			!this.etatUtilisateurSco.pourPrimaire() &&
			this.avecTotalHeuresManquees
				? "total"
				: "");
		return lClass;
	}
	getClassCelluleConteneur() {
		return "fd_ligne";
	}
	getVisible(D) {
		return D.estVisible;
	}
}
exports.DonneesListe_EvenementsVS = DonneesListe_EvenementsVS;
