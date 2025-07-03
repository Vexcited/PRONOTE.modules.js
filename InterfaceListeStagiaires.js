exports.InterfaceListeStagiaires = void 0;
const ObjetFenetre_ParametresAffListeStagiaires_1 = require("ObjetFenetre_ParametresAffListeStagiaires");
const Invocateur_1 = require("Invocateur");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_ListeStagiaires_1 = require("DonneesListe_ListeStagiaires");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetFenetre_EvaluationAccueilStage_1 = require("ObjetFenetre_EvaluationAccueilStage");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteListeSessionsDeStage_1 = require("ObjetRequeteListeSessionsDeStage");
const AccessApp_1 = require("AccessApp");
const ObjetRequeteListeStagiaires_1 = require("ObjetRequeteListeStagiaires");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetRequeteEvaluationAccueilStage_1 = require("ObjetRequeteEvaluationAccueilStage");
class InterfaceListeStagiaires extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		const lAvecDonneesAdministratives = lApplicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.eleves.consulterIdentiteEleve,
		);
		this.parametres = {
			session: null,
			dateNaissance: true,
			formation: true,
			adresse: lAvecDonneesAdministratives,
			telephone: lAvecDonneesAdministratives,
			email: lAvecDonneesAdministratives,
			denominationCommerciale: true,
			coordonneesEntreprise: true,
			responsableEntreprise: true,
		};
		const lSession = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.SessionDeStage,
		);
		if (lSession && lSession.existeNumero()) {
			this.parametres.session = lSession;
		}
	}
	construireInstances() {
		this.identCombo = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._surEvenementComboListeSessions.bind(this),
			this._initialiserComboListeSessions,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe.bind(this),
			this._initialiserListe,
		);
		this.identFenetreParametresAff = this.addFenetre(
			ObjetFenetre_ParametresAffListeStagiaires_1.ObjetFenetre_ParametresAffListeStagiaires,
			this._evenementFenetreParametresAff.bind(this),
			this._initialiserFenetreParametresAff,
		);
		this.identFenetreEvaluation = this.addFenetre(
			ObjetFenetre_EvaluationAccueilStage_1.ObjetFenetre_EvaluationAccueilStage,
			null,
			this._initialiserFenetreEvaluationStage,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identCombo);
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
				this.jsxModeleBoutonParametressAffichage.bind(this),
			),
		});
	}
	jsxModeleBoutonParametressAffichage() {
		return {
			event: () => {
				this.getInstance(this.identFenetreParametresAff).setDonnees(
					this.parametres,
				);
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"stage.listeStagiaire.parametres",
				);
			},
			getSelection: () => {
				return this.getInstance(this.identFenetreParametresAff).estAffiche();
			},
		};
	}
	recupererDonnees() {
		this.setEtatSaisie(false);
		new ObjetRequeteListeSessionsDeStage_1.ObjetRequeteListeSessionsDeStage(
			this,
			this._actionApresRequeteListeSessionsDeStage.bind(this),
		).lancerRequete();
	}
	_actionApresRequeteListeSessionsDeStage(aJSON) {
		const lSessionsDeStages = aJSON.sessionsDeStages;
		lSessionsDeStages.insererElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("stage.toutesLesSessions"),
				null,
				-1,
			),
			0,
		);
		lSessionsDeStages.setTri([
			ObjetTri_1.ObjetTri.init(
				"Genre",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
			ObjetTri_1.ObjetTri.init(
				"Libelle",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
		]);
		lSessionsDeStages.trier();
		this.getInstance(this.identCombo).setDonnees(lSessionsDeStages);
		const lIndice = this.parametres.session
			? lSessionsDeStages.getIndiceParNumeroEtGenre(
					this.parametres.session.getNumero(),
				)
			: 0;
		this.getInstance(this.identCombo).setSelection(lIndice);
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
			this,
			this._getParametresPDF.bind(this),
		);
	}
	_initialiserComboListeSessions(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 160,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"stage.listeStagiaire.comboStage",
			),
			initAutoSelectionAvecUnElement: false,
		});
		aInstance.setVisible(true);
	}
	_surEvenementComboListeSessions(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (aParams.element.getGenre() === -1) {
				this.parametres.session = null;
			} else {
				this.parametres.session = aParams.element;
			}
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.SessionDeStage,
				this.parametres.session,
			);
			new ObjetRequeteListeStagiaires_1.ObjetRequeteListeStagiaires(
				this,
				this._actionApresComboSession,
			).lancerRequete(this.parametres);
		}
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ListeStagiaires_1.DonneesListe_ListeStagiaires.colonnes
				.stagiaire,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"stage.listeStagiaire.stagiaire",
			),
			taille: 240,
		});
		lColonnes.push({
			id: DonneesListe_ListeStagiaires_1.DonneesListe_ListeStagiaires.colonnes
				.sujet,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"stage.listeStagiaire.sujet",
			),
			taille: 280,
		});
		lColonnes.push({
			id: DonneesListe_ListeStagiaires_1.DonneesListe_ListeStagiaires.colonnes
				.entreprise,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"stage.listeStagiaire.entreprise",
			),
			taille: 220,
		});
		lColonnes.push({
			id: DonneesListe_ListeStagiaires_1.DonneesListe_ListeStagiaires.colonnes
				.maitresDeStage,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"stage.listeStagiaire.maitresDeStage",
			),
			taille: 220,
		});
		lColonnes.push({
			id: DonneesListe_ListeStagiaires_1.DonneesListe_ListeStagiaires.colonnes
				.referants,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"stage.listeStagiaire.referants",
			),
			taille: 220,
		});
		lColonnes.push({
			id: DonneesListe_ListeStagiaires_1.DonneesListe_ListeStagiaires.colonnes
				.evaluation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"questionnaireStage.EvaluationEntrepriseAccueil",
			),
			taille: 200,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			largeurImage: 32,
			colonnesTriables: false,
			scrollHorizontal: true,
			ariaLabel: () => {
				var _a, _b;
				return `${this.etatUtilisateurSco.getLibelleLongOnglet()} ${((_b = (_a = this.parametres) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.getLibelle()) || ObjetTraduction_1.GTraductions.getValeur("stage.toutesLesSessions")}`.trim();
			},
		});
	}
	_evenementListe(aParametres) {
		if (
			aParametres.genreEvenement ===
				Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick &&
			aParametres.idColonne ===
				DonneesListe_ListeStagiaires_1.DonneesListe_ListeStagiaires.colonnes
					.evaluation
		) {
			const lStage = aParametres.article;
			if (!lStage.estTitre) {
				new ObjetRequeteEvaluationAccueilStage_1.ObjetRequeteEvaluationAccueilStage(
					this,
					this._actionApresRequeteEvaluationAccueilStage.bind(
						this,
						lStage.typeSatisfaction,
					),
				).lancerRequete({ stage: lStage });
			}
		}
	}
	_actionApresRequeteEvaluationAccueilStage(aTypeSatisfaction, aJSON) {
		const lObservation = aJSON && aJSON.observation ? aJSON.observation : "";
		const lListeQuestions =
			aJSON && aJSON.listeQuestions
				? aJSON.listeQuestions
				: new ObjetListeElements_1.ObjetListeElements();
		const lEditable = aJSON && aJSON.editable ? aJSON.editable : false;
		this.getInstance(this.identFenetreEvaluation).setDonnees({
			listeQuestions: lListeQuestions,
			observation: lObservation,
			editable: lEditable,
			typeSatisfaction: aTypeSatisfaction,
		});
	}
	_initialiserFenetreEvaluationStage(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"questionnaireStage.EvaluationEntrepriseAccueil",
			),
			largeur: 820,
			hauteur: 500,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	_initialiserFenetreParametresAff(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"stage.listeStagiaire.parametres",
			),
		});
	}
	_evenementFenetreParametresAff(aNumeroBouton, aParam) {
		if (aNumeroBouton === 1) {
			$.extend(this.parametres, aParam);
			new ObjetRequeteListeStagiaires_1.ObjetRequeteListeStagiaires(
				this,
				this._actionApresComboSession,
			).lancerRequete(this.parametres);
		}
	}
	_actionApresComboSession(aJSON) {
		const lStages = this._formatDonnees(aJSON);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ListeStagiaires_1.DonneesListe_ListeStagiaires(lStages),
		);
	}
	_formatDonnees(aJSON) {
		const lResult = aJSON.stages;
		let lPere;
		for (let i = 0; i < lResult.count(); i++) {
			let lStage = lResult.get(i);
			if (lStage.estTitre) {
				lPere = lStage;
				lStage.estUnDeploiement = true;
				lStage.estDeploye = true;
			} else {
				lStage.pere = lPere;
				lStage.estUnDeploiement = false;
				lStage.estDeploye = true;
			}
		}
		return lResult;
	}
	_getParametresPDF() {
		const lResult = {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.ListeStagiaires,
			parametres: this.parametres,
		};
		return lResult;
	}
}
exports.InterfaceListeStagiaires = InterfaceListeStagiaires;
