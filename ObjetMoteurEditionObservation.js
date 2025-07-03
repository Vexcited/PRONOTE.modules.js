exports.ObjetMoteurEditionObservation = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
class ObjetMoteurEditionObservation {
	constructor() {
		this.avecDate = true;
		this.disabled = false;
		this.existeDateVisu = false;
		this.estEnConsultationUniquement = false;
		this.avecBoutonSuppression = false;
		this.numBoutonAnnuler = 0;
		this.numBoutonValider = 1;
		this.observation = null;
		this.commentaireOrigine = null;
		this.checkPublieOrigine = null;
		this.dateOrigine = null;
		this.avecDate = true;
		this.disabled = false;
		this.existeDateVisu = false;
		this.estEnConsultationUniquement = false;
		this.avecBoutonSuppression = false;
		this.numBoutonSupprimer = null;
		this.numBoutonAnnuler = 0;
		this.numBoutonValider = 1;
		this.listeBoutons = [
			ObjetTraduction_1.GTraductions.getValeur("Annuler"),
			ObjetTraduction_1.GTraductions.getValeur("Valider"),
		];
	}
	init(aParam) {
		this.observation = aParam.observation;
		this.commentaireOrigine = aParam.observation.commentaire;
		this.checkPublieOrigine = aParam.observation.estPubliee;
		this.dateMiseEnEvidenceOrigine = aParam.observation.dateFinMiseEnEvidence;
		this.dateOrigine = aParam.observation.date;
		this.numeroObservation = aParam.numeroObservation;
		this.genreEtat = aParam.genreEtat;
		this.typeObservation = aParam.typeObservation;
		this.avecDate = aParam.avecDate;
		this.publiable = aParam.publiable;
		this.disabled =
			aParam.actif === undefined || aParam.actif === null
				? false
				: !aParam.actif;
		if (this.disabled) {
			this.listeBoutons = [ObjetTraduction_1.GTraductions.getValeur("Fermer")];
		}
		this.existeDateVisu = this.observation.dateVisu !== undefined;
		this.estEnConsultationUniquement =
			(aParam.observation.avecARObservation && this.existeDateVisu) ||
			this.disabled;
		this.avecBoutonSuppression =
			!this.disabled &&
			this.genreEtat === Enumere_Etat_1.EGenreEtat.Suppression &&
			this.observation.dateVisu === undefined;
		if (this.avecBoutonSuppression) {
			this.listeBoutons.unshift(
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			);
			this.numBoutonSupprimer = 0;
			this.numBoutonAnnuler = 1;
			this.numBoutonValider = 2;
		}
		if (aParam.maxlengthCommentaire) {
			this.maxlengthCommentaire = aParam.maxlengthCommentaire;
		}
	}
	getTitre() {
		if (
			this.typeObservation ===
			TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_ObservationParent
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"Observations.ObservationsParents",
			);
		} else if (
			this.typeObservation ===
			TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"Observations.Encouragements",
			);
		} else if (
			(this.typeObservation ===
				TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres ||
				this.typeObservation ===
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet) &&
			this.observation &&
			this.observation.observation &&
			this.observation.observation.getLibelle()
		) {
			return this.observation.observation.getLibelle();
		} else if (
			this.observation.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.Dispense
		) {
			return this.disabled
				? ObjetTraduction_1.GTraductions.getValeur(
						"Observations.ObservationsDispenseNE",
					).ucfirst()
				: ObjetTraduction_1.GTraductions.getValeur(
						"Observations.ObservationsDispense",
					);
		} else {
			return this.observation && this.observation.estPubliee
				? ObjetTraduction_1.GTraductions.getValeur(
						"Observations.ObservationsPublie",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Observations.ObservationsNonPublie",
					);
		}
	}
	validationActif(aCommentaire) {
		return (
			(this.typeObservation !==
				TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_ObservationParent &&
				this.typeObservation !==
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement) ||
			aCommentaire.trim() !== ""
		);
	}
	surValidation(aNumeroBouton) {
		let lResult = false;
		if (aNumeroBouton === this.numBoutonSupprimer) {
			this.observation.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			lResult = true;
		} else if (
			(aNumeroBouton === this.numBoutonAnnuler || aNumeroBouton === -1) &&
			!this.estEnConsultationUniquement
		) {
			this.observation.commentaire = this.commentaireOrigine;
			this.observation.dateFinMiseEnEvidence = this.dateMiseEnEvidenceOrigine;
			this.observation.estPubliee = this.checkPublieOrigine;
			this.observation.date = this.dateOrigine;
			if (this.genreEtat === Enumere_Etat_1.EGenreEtat.Creation) {
				this.observation.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			}
			lResult = true;
		} else if (aNumeroBouton === this.numBoutonValider) {
			this.observation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lResult = true;
		}
		return lResult;
	}
}
exports.ObjetMoteurEditionObservation = ObjetMoteurEditionObservation;
