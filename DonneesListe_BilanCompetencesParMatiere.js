exports.DonneesListe_BilanCompetencesParMatiere = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
class DonneesListe_BilanCompetencesParMatiere extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecTri: false,
			avecDeploiement: true,
		});
		this.optionsAffichage = { afficheJaugeChronologique: false };
	}
	setOptionsAffichage(aOptions) {
		Object.assign(this.optionsAffichage, aOptions);
	}
	_estUneColonneDeJaugeAvecDonnees(aParams) {
		let lEstUneCelluleJaugeAvecDonnees = false;
		let lObjConcerne;
		if (this.estUneColonneJaugeDeService(aParams.idColonne)) {
			lObjConcerne =
				DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
					aParams.article,
					aParams.declarationColonne.serviceConcerne.getNumero(),
				);
		} else if (
			aParams.idColonne ===
			DonneesListe_BilanCompetencesParMatiere.colonnes.jauge
		) {
			lObjConcerne = aParams.article;
		}
		if (lObjConcerne) {
			lEstUneCelluleJaugeAvecDonnees =
				lObjConcerne.relationsESI && lObjConcerne.relationsESI.length > 0;
		}
		return lEstUneCelluleJaugeAvecDonnees;
	}
	estUneColonneJaugeDeService(aColonneId) {
		return (
			aColonneId.indexOf(
				DonneesListe_BilanCompetencesParMatiere.colonnes.prefixe_jauge_service,
			) === 0
		);
	}
	estUneColonneNiveauDeService(aColonneId) {
		return (
			aColonneId.indexOf(
				DonneesListe_BilanCompetencesParMatiere.colonnes.prefixe_niveau_service,
			) === 0
		);
	}
	static getElementServiceConcerne(aArticle, aNumeroService) {
		let lElementServiceConcerne = null;
		if (aNumeroService && aArticle && aArticle.listeColonnesServices) {
			lElementServiceConcerne =
				aArticle.listeColonnesServices.getElementParNumero(aNumeroService);
		}
		return lElementServiceConcerne;
	}
	avecMenuContextuel() {
		return false;
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_BilanCompetencesParMatiere.colonnes.libelle
		);
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_BilanCompetencesParMatiere.colonnes.libelle
		);
	}
	selectionParCellule() {
		return true;
	}
	avecSelection(aParams) {
		if (aParams.colonne > -1) {
			return this.estUneColonneNiveauDeService(aParams.idColonne);
		}
		return false;
	}
	avecEvenementSelectionClick(aParams) {
		let lAvecEvenement = false;
		if (this._estUneColonneDeJaugeAvecDonnees(aParams)) {
			lAvecEvenement = true;
		} else if (this.estUneCelluleNiveauDeServiceEditable(aParams)) {
			lAvecEvenement = true;
		}
		return lAvecEvenement;
	}
	estUneCelluleNiveauDeServiceEditable(aParams) {
		if (this.estUneColonneNiveauDeService(aParams.idColonne)) {
			const lElementServiceConcerne =
				DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
					aParams.article,
					aParams.declarationColonne.serviceConcerne.getNumero(),
				);
			return (
				lElementServiceConcerne &&
				lElementServiceConcerne.niveauAcquiEstEditable
			);
		}
		return false;
	}
	composeHtmlJauge(aListeNiveaux, aListeNiveauxParNiveau) {
		let lJauge = "";
		if (this.optionsAffichage.afficheJaugeChronologique) {
			lJauge =
				UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeChronologique(
					{
						listeNiveaux: aListeNiveaux,
						hint: UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
							aListeNiveaux,
						),
					},
				);
		} else {
			lJauge =
				UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux({
					listeNiveaux: aListeNiveauxParNiveau,
					hint: UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
						aListeNiveauxParNiveau,
					),
				});
		}
		return lJauge;
	}
	getValeur(aParams) {
		if (this.estUneColonneJaugeDeService(aParams.idColonne)) {
			const lElementServiceConcerne =
				DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
					aParams.article,
					aParams.declarationColonne.serviceConcerne.getNumero(),
				);
			if (lElementServiceConcerne) {
				return this.composeHtmlJauge(
					lElementServiceConcerne.listeNiveaux,
					lElementServiceConcerne.listeNiveauxParNiveau,
				);
			}
			return "";
		} else if (this.estUneColonneNiveauDeService(aParams.idColonne)) {
			const lElementServiceConcerne =
				DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
					aParams.article,
					aParams.declarationColonne.serviceConcerne.getNumero(),
				);
			if (lElementServiceConcerne && lElementServiceConcerne.niveauAcqui) {
				return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
					lElementServiceConcerne.niveauAcqui,
				);
			}
			return "";
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_BilanCompetencesParMatiere.colonnes.libelle:
					return aParams.article.getLibelle();
				case DonneesListe_BilanCompetencesParMatiere.colonnes.jauge: {
					return this.composeHtmlJauge(
						aParams.article.listeNiveaux,
						aParams.article.listeNiveauxParNiveau,
					);
				}
			}
		}
		return "";
	}
	getCouleurCellule(aParams) {
		if (!!aParams.article) {
			let lCouleurCellule =
				GCouleur.liste.cumul[aParams.article.niveauDeploiement];
			if (this.estUneCelluleNiveauDeServiceEditable(aParams)) {
				lCouleurCellule =
					ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
			}
			return lCouleurCellule;
		}
		return null;
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (this._estUneColonneDeJaugeAvecDonnees(aParams)) {
			lClasses.push("AvecMain");
		} else if (
			aParams.idColonne ===
			DonneesListe_BilanCompetencesParMatiere.colonnes.libelle
		) {
			if (aParams.article.estUnDeploiement) {
				lClasses.push("AvecMain");
			}
		}
		if (this.estUneColonneNiveauDeService(aParams.idColonne)) {
			lClasses.push("AlignementMilieu");
			if (this.estUneCelluleNiveauDeServiceEditable(aParams)) {
				lClasses.push("AvecMain");
			}
		}
		return lClasses.join(" ");
	}
}
exports.DonneesListe_BilanCompetencesParMatiere =
	DonneesListe_BilanCompetencesParMatiere;
DonneesListe_BilanCompetencesParMatiere.colonnes = {
	libelle: "DLBCPM_Libelle",
	jauge: "DLBCPM_Jauge",
	prefixe_jauge_service: "DLBCPM_Jauge_Serv_",
	prefixe_niveau_service: "DLBCPM_Niveau_Serv_",
};
