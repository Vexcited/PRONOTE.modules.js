const {
	_InterfaceNiveauxDeMaitriseParMatiere,
} = require("_InterfaceNiveauxDeMaitriseParMatiere.js");
const {
	ObjetFenetre_DetailEvaluationsCompetences,
} = require("ObjetFenetre_DetailEvaluationsCompetences.js");
const ObjetRequeteNiveauxDeMaitriseParMatiere = require("ObjetRequeteNiveauxDeMaitriseParMatiere.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
	ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
class InterfaceNiveauxDeMaitriseParMatiere_Saisie extends _InterfaceNiveauxDeMaitriseParMatiere {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			this._evenementSurDernierMenuDeroulant,
			this._initialiserTripleCombo,
		);
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences,
			_evenementFenetreDetailEvaluations,
			_initFenetreDetailEvaluations,
		);
		this.IdentPage = this.add(ObjetListe, _evenementSurListe.bind(this));
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.IdentPage;
		this.AddSurZone = [this.identTripleCombo, { separateur: true }];
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[EGenreRessource.Classe, EGenreRessource.Periode, EGenreRessource.Eleve],
			true,
		);
	}
	_evenementSurDernierMenuDeroulant() {
		this.afficherBandeau(true);
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.Aucune,
		);
		new ObjetRequeteNiveauxDeMaitriseParMatiere(
			this,
			this._reponseRequeteNiveauxDeMaitriseParMatiere,
		).lancerRequete({
			classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
			periode: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Periode,
			),
			eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
		});
	}
	evenementAfficherMessage(aGenreMessage) {
		super.evenementAfficherMessage(aGenreMessage);
		this.surResizeInterface();
	}
}
function _evenementSurListe(aParametres, aGenreEvenement) {
	switch (aGenreEvenement) {
		case EGenreEvenementListe.Selection:
			new ObjetRequeteDetailEvaluationsCompetences(
				this,
				_reponseRequeteDetailEvaluations.bind(this, aParametres),
			).lancerRequete({
				eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
				pilier: aParametres.article.pilier,
				periode: GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Periode,
				),
				numRelESI: aParametres.article.NumerosRelationsESI,
			});
			break;
	}
}
function _initFenetreDetailEvaluations(aInstance) {
	aInstance.setOptionsFenetre({
		titre: "",
		largeur: 700,
		hauteur: 300,
		listeBoutons: [GTraductions.getValeur("Fermer")],
	});
}
function _evenementFenetreDetailEvaluations() {
	IE.log.addLog(
		"Saisie non gérée pour le moment ; saisie non permise par delphi",
	);
}
function _reponseRequeteDetailEvaluations(aParametres, aJSON) {
	const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
	const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
		GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
		aParametres.article,
	);
	lFenetre.setDonnees(aParametres.article, aJSON, {
		titreFenetre: lTitreParDefaut,
	});
}
module.exports = { InterfaceNiveauxDeMaitriseParMatiere_Saisie };
