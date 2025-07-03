exports.DonneesListe_ListeStagiaires = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const TypeEtatSatisfaction_1 = require("TypeEtatSatisfaction");
class DonneesListe_ListeStagiaires extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSuppression: false,
			avecEtatSaisie: false,
			avecEdition: false,
			avecTri: false,
			avecDeploiement: true,
		});
	}
	avecMenuContextuel() {
		return false;
	}
	avecEvenementSelectionClick(aParams) {
		return (
			aParams.idColonne === DonneesListe_ListeStagiaires.colonnes.evaluation &&
			!aParams.article.estTitre
		);
	}
	getAriaHasPopup(aParams) {
		if (this.avecEvenementSelectionClick(aParams)) {
			return "dialog";
		}
		return false;
	}
	getColonneDeFusion(aParams) {
		if (aParams.article.estTitre) {
			return DonneesListe_ListeStagiaires.colonnes.stagiaire;
		}
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.article.estTitre &&
			aParams.article.estUnDeploiement &&
			aParams.idColonne === DonneesListe_ListeStagiaires.colonnes.stagiaire
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeStagiaires.colonnes.evaluation:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Image;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getValeur(aParams) {
		if (aParams.article.estTitre) {
			return aParams.article.libelleSousTitre;
		}
		switch (aParams.idColonne) {
			case DonneesListe_ListeStagiaires.colonnes.stagiaire:
				return aParams.article.libelleStagiaire;
			case DonneesListe_ListeStagiaires.colonnes.sujet:
				return aParams.article.libelleSujet;
			case DonneesListe_ListeStagiaires.colonnes.entreprise:
				return aParams.article.libelleEntreprise;
			case DonneesListe_ListeStagiaires.colonnes.maitresDeStage:
				return aParams.article.libelleMDS;
			case DonneesListe_ListeStagiaires.colonnes.referants:
				return aParams.article.libelleReferant;
			case DonneesListe_ListeStagiaires.colonnes.evaluation:
				return TypeEtatSatisfaction_1.TypeEtatSatisfactionUtil.getImageListe(
					aParams.article.typeSatisfaction,
				);
		}
		return "";
	}
	getClass(aParams) {
		const lClasses = [];
		if (aParams.article.estTitre) {
			lClasses.push("Gras");
		} else if (
			aParams.idColonne === DonneesListe_ListeStagiaires.colonnes.stagiaire
		) {
			lClasses.push("EspaceGauche10");
		}
		return lClasses.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (aParams.article.estTitre) {
			lClasses.push("AlignementMilieuVertical");
		} else {
			lClasses.push("AlignementHaut");
		}
		return lClasses.join(" ");
	}
	getNiveauDeploiement() {
		return 2;
	}
	getCouleurCellule(aParams) {
		return aParams.article.estUnDeploiement
			? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement
			: ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
}
exports.DonneesListe_ListeStagiaires = DonneesListe_ListeStagiaires;
DonneesListe_ListeStagiaires.colonnes = {
	stagiaire: "DL_Stagiaires_nom",
	sujet: "DL_Stagiaires_sujet",
	entreprise: "DL_Stagiaires_entreprise",
	maitresDeStage: "DL_Stagiaires_maitrestage",
	referants: "DL_Stagiaires_referant",
	evaluation: "DL_Stagiaires_eval",
};
