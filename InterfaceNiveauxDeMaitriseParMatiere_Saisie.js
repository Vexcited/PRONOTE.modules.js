exports.InterfaceNiveauxDeMaitriseParMatiere_Saisie = void 0;
const _InterfaceNiveauxDeMaitriseParMatiere_1 = require("_InterfaceNiveauxDeMaitriseParMatiere");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const ObjetRequeteNiveauxDeMaitriseParMatiere_1 = require("ObjetRequeteNiveauxDeMaitriseParMatiere");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
class InterfaceNiveauxDeMaitriseParMatiere_Saisie extends _InterfaceNiveauxDeMaitriseParMatiere_1._InterfaceNiveauxDeMaitriseParMatiere {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		super.construireInstances();
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementSurDernierMenuDeroulant,
			this._initialiserTripleCombo,
		);
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences_1.ObjetFenetre_DetailEvaluationsCompetences,
			this._evenementFenetreDetailEvaluations,
			this._initFenetreDetailEvaluations,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.IdentPage;
		this.AddSurZone = [this.identTripleCombo, { separateur: true }];
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Periode,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			],
			true,
		);
	}
	_evenementSurDernierMenuDeroulant() {
		this.afficherBandeau(true);
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		new ObjetRequeteNiveauxDeMaitriseParMatiere_1.ObjetRequeteNiveauxDeMaitriseParMatiere(
			this,
			this._reponseRequeteNiveauxDeMaitriseParMatiere,
		).lancerRequete({
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			eleve: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
		});
	}
	evenementAfficherMessage(aGenreMessage) {
		super.evenementAfficherMessage(aGenreMessage);
		this.surResizeInterface();
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
					this,
					this._reponseRequeteDetailEvaluations.bind(this, aParametres),
				).lancerRequete({
					eleve: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					),
					pilier: aParametres.article.pilier,
					periode: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
					numRelESI: aParametres.article.NumerosRelationsESI,
				});
				break;
		}
	}
	_initFenetreDetailEvaluations(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 700,
			hauteur: 300,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	_evenementFenetreDetailEvaluations() {
		IE.log.addLog(
			"Saisie non gérée pour le moment ; saisie non permise par delphi",
		);
	}
	_reponseRequeteDetailEvaluations(aParametres, aJSON) {
		const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
		const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
			this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			aParametres.article,
		);
		lFenetre.setDonnees(aParametres.article, aJSON, {
			titreFenetre: lTitreParDefaut,
		});
	}
}
exports.InterfaceNiveauxDeMaitriseParMatiere_Saisie =
	InterfaceNiveauxDeMaitriseParMatiere_Saisie;
