exports.DonneesListe_SelectionDemandeur_Fd =
	exports.DonneesListe_SelectionDemandeur = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_SelectionDemandeur extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_SelectionClick: true,
			avecEvnt_Selection: true,
			avecDeploiement: true,
			avecImageSurColonneDeploiement: true,
		});
	}
	getTypeValeur() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	avecSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	surSelectionLigne(J, D, aSelectionner) {
		D.selectionne = aSelectionner && !D.estUnDeploiement;
	}
	getClass(aParams) {
		const lClasses = [];
		if (aParams.article.estUnDeploiement) {
			lClasses.push("Gras");
		}
		return lClasses.join(" ");
	}
	getValeur(aParams) {
		return aParams.article.getLibelle();
	}
	getCouleurCellule(aParams) {
		if (aParams.article.estUnDeploiement) {
			return GCouleur.liste.cumul[1];
		}
		return GCouleur.liste.editable;
	}
}
exports.DonneesListe_SelectionDemandeur = DonneesListe_SelectionDemandeur;
class DonneesListe_SelectionDemandeur_Fd extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_SelectionClick: true,
			avecEvnt_Selection: true,
			avecDeploiement: true,
		});
	}
	getTitreZonePrincipale(aDonnee) {
		return aDonnee.article.getLibelle();
	}
	avecBoutonActionLigne(aParams) {
		return false;
	}
	avecSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	surSelectionLigne(J, D, aSelectionner) {
		D.selectionne = aSelectionner && !D.estUnDeploiement;
	}
}
exports.DonneesListe_SelectionDemandeur_Fd = DonneesListe_SelectionDemandeur_Fd;
