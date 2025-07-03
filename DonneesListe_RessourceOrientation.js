exports.DonneesListe_RessourceOrientation = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetRequetePageOrientations_1 = require("ObjetRequetePageOrientations");
const GlossaireOrientation_1 = require("GlossaireOrientation");
class DonneesListe_RessourceOrientation extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aParam) {
		super(aParam.listeRessources);
		this.genreRessource = aParam.genre;
		this.estNiveauPremiere = aParam.estNiveauPremiere;
		this.avecFiltreNiveau = aParam.avecFiltreNiveau;
		this.estMultiNiveau = aParam.estMultiNiveau;
		this.afficherPicto = aParam.afficherPicto;
		this.setOptions({
			avecEvnt_SelectionClick: true,
			avecDeploiement: true,
			avecTri: false,
			avecBoutonActionLigne: false,
			flatDesignMinimal: true,
			avecEllipsis: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getInfosSuppZonePrincipale(aParams) {
		if (
			this.estMultiNiveau &&
			!!aParams.article.niveau &&
			!!aParams.article.niveau.getLibelle()
		) {
			return aParams.article.niveau.getLibelle();
		}
	}
	getZoneGauche(aParams) {
		return (
			!aParams.article.estUnDeploiement &&
			this.afficherPicto &&
			this.getPictoEtablissement(aParams)
		);
	}
	avecEvenementSelectionClick(aParams) {
		return (
			aParams.article.getGenre() !== undefined ||
			this.genreRessource !==
				ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.orientation
		);
	}
	avecDeploiementSurColonne(aParams) {
		return aParams.article.estUnDeploiement;
	}
	getVisible(D) {
		if (
			!this.estNiveauPremiere ||
			this.genreRessource !==
				ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.specialite
		) {
			return true;
		}
		let lVisible = true;
		if (this.avecFiltreNiveau && !D.estSpecialiteAnneePrecedente) {
			lVisible = false;
		}
		return lVisible;
	}
	getPictoEtablissement(aParams) {
		const lLettre = aParams.article.horsEtablissement
			? GlossaireOrientation_1.TradGlossaireOrientation.Ressources
					.LettreHorsEtablissement
			: GlossaireOrientation_1.TradGlossaireOrientation.Ressources
					.LettreEtablissement;
		const lTitle = aParams.article.horsEtablissement
			? GlossaireOrientation_1.TradGlossaireOrientation.Ressources
					.DispoHorsEtablissement
			: GlossaireOrientation_1.TradGlossaireOrientation.Ressources
					.DispoEtablissement;
		return IE.jsx.str(
			"i",
			{ class: "icon-text", "ie-tooltiplabel": lTitle, role: "presentation" },
			lLettre,
		);
	}
	setFiltreNiveau(aAvecFiltre) {
		return (this.avecFiltreNiveau = aAvecFiltre);
	}
}
exports.DonneesListe_RessourceOrientation = DonneesListe_RessourceOrientation;
