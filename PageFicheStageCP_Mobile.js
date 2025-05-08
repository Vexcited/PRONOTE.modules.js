exports.PageFicheStageCP_Mobile = void 0;
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const Enumere_AffichageFicheStage_1 = require("Enumere_AffichageFicheStage");
class PageFicheStageCP_Mobile extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.initParametres();
	}
	initParametres() {
		this.parametres = {
			avecEdition: false,
			avecEditionDocumentsJoints: false,
			avecEditionSuivisDeStage: false,
			avecCommentaire: false,
		};
	}
	setParametres(aParametres) {
		$.extend(this.parametres, aParametres);
	}
	setDonnees(aDonnees) {
		this.etudiant = aDonnees.etudiant;
		this.donnees = aDonnees.stage;
		this.listePJ = aDonnees.pj;
		this.selectOngletStage = aDonnees.genreOnglet;
		(this.evenements = aDonnees.evenements),
			(this.lieux = aDonnees.lieux),
			(this.instanceListeSuivis = this.creerInstanceListeSuivis());
		this.controleur = {};
		this.controleur = this.getControleur(this);
		this.afficher();
		if (
			this.selectOngletStage ===
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi
		) {
			this.initialiserListeSuivis();
		}
	}
}
exports.PageFicheStageCP_Mobile = PageFicheStageCP_Mobile;
