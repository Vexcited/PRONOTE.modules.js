exports.InterfaceNiveauxDeMaitriseParMatiere_Consultation = void 0;
const _InterfaceNiveauxDeMaitriseParMatiere_1 = require("_InterfaceNiveauxDeMaitriseParMatiere");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const ObjetRequeteNiveauxDeMaitriseParMatiere_1 = require("ObjetRequeteNiveauxDeMaitriseParMatiere");
const Invocateur_1 = require("Invocateur");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
class InterfaceNiveauxDeMaitriseParMatiere_Consultation extends _InterfaceNiveauxDeMaitriseParMatiere_1._InterfaceNiveauxDeMaitriseParMatiere {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		super.construireInstances();
		this.identCombo = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evenementSurCombo,
			this._initialiserCombo,
		);
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences_1.ObjetFenetre_DetailEvaluationsCompetences,
			null,
			this.initFenetreDetailEvaluations,
		);
	}
	initFenetreDetailEvaluations(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 700,
			hauteur: 300,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.IdentPage;
		this.AddSurZone = [this.identCombo, { separateur: true }];
	}
	recupererDonnees() {
		const lListePeriodes = this.etatUtilisateurSco.getOngletListePeriodes();
		if (lListePeriodes && lListePeriodes.count()) {
			this.getInstance(this.identCombo).setVisible(true);
			this.getInstance(this.identCombo).setDonnees(lListePeriodes);
			this.getInstance(this.identCombo).setSelectionParElement(
				this.etatUtilisateurSco.getPeriode(),
				0,
			);
		} else {
			this.getInstance(this.identCombo).setVisible(false);
			this.evenementAfficherMessage(
				Enumere_Message_1.EGenreMessage.AucunBulletinDeCompetencesPourEleve,
			);
		}
	}
	_initialiserCombo(AInstance) {
		AInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
	_evenementSurCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
				aParams.element,
			);
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
			this.afficherBandeau(false);
			new ObjetRequeteNiveauxDeMaitriseParMatiere_1.ObjetRequeteNiveauxDeMaitriseParMatiere(
				this,
				this._reponseRequeteNiveauxDeMaitriseParMatiere,
			).lancerRequete({
				periode: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				),
			});
		}
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
					this,
					this._reponseRequeteDetailEvaluations.bind(this, aParametres),
				).lancerRequete({
					eleve: null,
					pilier: aParametres.article.pilier,
					periode: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
					numRelESI: aParametres.article.NumerosRelationsESI,
				});
				break;
		}
	}
	_reponseRequeteDetailEvaluations(aParametres, aJSON) {
		const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
		const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
			GEtatUtilisateur.getMembre(),
			aParametres.article,
		);
		lFenetre.setDonnees(aParametres.article, aJSON, {
			titreFenetre: lTitreParDefaut,
		});
	}
}
exports.InterfaceNiveauxDeMaitriseParMatiere_Consultation =
	InterfaceNiveauxDeMaitriseParMatiere_Consultation;
