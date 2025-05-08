const {
	_InterfaceNiveauxDeMaitriseParMatiere,
} = require("_InterfaceNiveauxDeMaitriseParMatiere.js");
const {
	ObjetFenetre_DetailEvaluationsCompetences,
} = require("ObjetFenetre_DetailEvaluationsCompetences.js");
const ObjetRequeteNiveauxDeMaitriseParMatiere = require("ObjetRequeteNiveauxDeMaitriseParMatiere.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
class InterfaceNiveauxDeMaitriseParMatiere_Consultation extends _InterfaceNiveauxDeMaitriseParMatiere {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identCombo = this.add(
			ObjetSaisiePN,
			this._evenementSurCombo,
			this._initialiserCombo,
		);
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences,
			null,
			this.initFenetreDetailEvaluations,
		);
		this.IdentPage = this.add(ObjetListe, _evenementSurListe.bind(this));
	}
	initFenetreDetailEvaluations(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 700,
			hauteur: 300,
			listeBoutons: [GTraductions.getValeur("Fermer")],
		});
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.IdentPage;
		this.AddSurZone = [this.identCombo, { separateur: true }];
	}
	recupererDonnees() {
		this.listePeriodes = GEtatUtilisateur.getOngletListePeriodes();
		if (this.listePeriodes && this.listePeriodes.count()) {
			this.Instances[this.identCombo].setVisible(true);
			this.Instances[this.identCombo].setDonnees(this.listePeriodes);
			this.Instances[this.identCombo].setSelectionParElement(
				GEtatUtilisateur.getPeriode(),
				0,
			);
		} else {
			this.Instances[this.identCombo].setVisible(false);
			this.evenementAfficherMessage(
				EGenreMessage.AucunBulletinDeCompetencesPourEleve,
			);
		}
	}
	_initialiserCombo(AInstance) {
		AInstance.setOptionsObjetSaisie({
			labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
		});
	}
	_evenementSurCombo(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			GEtatUtilisateur.Navigation.setRessource(
				EGenreRessource.Periode,
				aParams.element,
			);
			Invocateur.evenement(
				ObjetInvocateur.events.activationImpression,
				EGenreImpression.Aucune,
			);
			this.afficherBandeau(false);
			new ObjetRequeteNiveauxDeMaitriseParMatiere(
				this,
				this._reponseRequeteNiveauxDeMaitriseParMatiere,
			).lancerRequete({
				periode: GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Periode,
				),
				eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
			});
		}
	}
}
function _evenementSurListe(aParametres, aGenreEvenement) {
	switch (aGenreEvenement) {
		case EGenreEvenementListe.Selection:
			new ObjetRequeteDetailEvaluationsCompetences(
				this,
				_reponseRequeteDetailEvaluations.bind(this, aParametres),
			).lancerRequete({
				eleve: null,
				pilier: aParametres.article.pilier,
				periode: GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Periode,
				),
				numRelESI: aParametres.article.NumerosRelationsESI,
			});
			break;
	}
}
function _reponseRequeteDetailEvaluations(aParametres, aJSON) {
	const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
	const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
		GEtatUtilisateur.getMembre(),
		aParametres.article,
	);
	lFenetre.setDonnees(aParametres.article, aJSON, {
		titreFenetre: lTitreParDefaut,
	});
}
module.exports = { InterfaceNiveauxDeMaitriseParMatiere_Consultation };
