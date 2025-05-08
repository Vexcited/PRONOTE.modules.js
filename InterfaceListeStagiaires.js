const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const {
	ObjetFenetre_ParametresAffListeStagiaires,
} = require("ObjetFenetre_ParametresAffListeStagiaires.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	DonneesListe_ListeStagiaires,
} = require("DonneesListe_ListeStagiaires.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetFenetre_EvaluationAccueilStage,
} = require("ObjetFenetre_EvaluationAccueilStage.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
Requetes.inscrire("EvaluationAccueilStage", ObjetRequeteConsultation);
Requetes.inscrire("ListeSessionsDeStage", ObjetRequeteConsultation);
Requetes.inscrire("ListeStagiaires", ObjetRequeteConsultation);
class InterfaceListeStagiaires extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lAvecDonneesAdministratives = GApplication.droits.get(
			TypeDroits.eleves.consulterIdentiteEleve,
		);
		this.parametres = {
			dateNaissance: true,
			formation: true,
			adresse: lAvecDonneesAdministratives,
			telephone: lAvecDonneesAdministratives,
			email: lAvecDonneesAdministratives,
			denominationCommerciale: true,
			coordonneesEntreprise: true,
			responsableEntreprise: true,
			session: null,
		};
		const lSession = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.SessionDeStage,
		);
		if (lSession && lSession.existeNumero()) {
			this.parametres.session = lSession;
		}
	}
	construireInstances() {
		this.identCombo = this.add(
			ObjetSaisie,
			_surEvenementComboListeSessions.bind(this),
			_initialiserComboListeSessions,
		);
		this.identListe = this.add(
			ObjetListe,
			_evenementListe.bind(this),
			_initialiserListe,
		);
		this.identParam = this.addFenetre(
			ObjetFenetre_ParametresAffListeStagiaires,
			_evenementFenetreParametrage.bind(this),
		);
		this.identFenetreEvaluation = this.addFenetre(
			ObjetFenetre_EvaluationAccueilStage,
			null,
			_initialiserFenetreEvaluationStage,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identCombo);
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau.getHtmlBtnParametrer(
				"btnParametresAffichage",
			),
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnParametresAffichage: {
				event() {
					aInstance
						.getInstance(aInstance.identParam)
						.setDonnees(aInstance.parametres);
				},
				getTitle() {
					return GTraductions.getValeur("stage.listeStagiaire.parametres");
				},
				getSelection() {
					return aInstance.getInstance(aInstance.identParam).estAffiche();
				},
			},
		});
	}
	recupererDonnees() {
		this.setEtatSaisie(false);
		Requetes(
			"ListeSessionsDeStage",
			this,
			_actionApresRequeteListeSessionsDeStage,
		).lancerRequete();
	}
}
function _initialiserComboListeSessions(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 160,
		labelWAICellule: GTraductions.getValeur("stage.listeStagiaire.comboStage"),
		initAutoSelectionAvecUnElement: false,
	});
	aInstance.setVisible(true);
}
function _surEvenementComboListeSessions(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		if (aParams.element.getGenre() === -1) {
			this.parametres.session = null;
		} else {
			this.parametres.session = aParams.element;
		}
		GEtatUtilisateur.Navigation.setRessource(
			EGenreRessource.SessionDeStage,
			this.parametres.session,
		);
		Requetes("ListeStagiaires", this, _actionApresComboSession).lancerRequete(
			this.parametres,
		);
	}
}
function _initialiserListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ListeStagiaires.colonnes.stagiaire,
		titre: GTraductions.getValeur("stage.listeStagiaire.stagiaire"),
		taille: 240,
	});
	lColonnes.push({
		id: DonneesListe_ListeStagiaires.colonnes.sujet,
		titre: GTraductions.getValeur("stage.listeStagiaire.sujet"),
		taille: 280,
	});
	lColonnes.push({
		id: DonneesListe_ListeStagiaires.colonnes.entreprise,
		titre: GTraductions.getValeur("stage.listeStagiaire.entreprise"),
		taille: 220,
	});
	lColonnes.push({
		id: DonneesListe_ListeStagiaires.colonnes.maitresDeStage,
		titre: GTraductions.getValeur("stage.listeStagiaire.maitresDeStage"),
		taille: 220,
	});
	lColonnes.push({
		id: DonneesListe_ListeStagiaires.colonnes.referants,
		titre: GTraductions.getValeur("stage.listeStagiaire.referants"),
		taille: 220,
	});
	lColonnes.push({
		id: DonneesListe_ListeStagiaires.colonnes.evaluation,
		titre: GTraductions.getValeur(
			"questionnaireStage.EvaluationEntrepriseAccueil",
		),
		taille: 200,
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		largeurImage: 32,
		avecFondBlanc: true,
		colonnesTriables: false,
	});
}
function _evenementListe(aParametres) {
	if (
		aParametres.genreEvenement === EGenreEvenementListe.Edition &&
		aParametres.idColonne === DonneesListe_ListeStagiaires.colonnes.evaluation
	) {
		const lStage = aParametres.article;
		if (!lStage.estTitre) {
			Requetes(
				"EvaluationAccueilStage",
				this,
				_actionApresRequeteEvaluationAccueilStage.bind(
					this,
					lStage.typeSatisfaction,
				),
			).lancerRequete({ stage: lStage });
		}
	}
}
function _actionApresRequeteEvaluationAccueilStage(aTypeSatisfaction, aJSON) {
	this.observation = aJSON && aJSON.observation ? aJSON.observation : "";
	this.listeQuestions =
		aJSON && aJSON.listeQuestions
			? aJSON.listeQuestions
			: new ObjetListeElements();
	this.editable = aJSON && aJSON.editable ? aJSON.editable : false;
	this.getInstance(this.identFenetreEvaluation).setDonnees({
		listeQuestions: this.listeQuestions,
		observation: this.observation,
		editable: this.editable,
		typeSatisfaction: aTypeSatisfaction,
	});
}
function _initialiserFenetreEvaluationStage(aInstance) {
	aInstance.setOptionsFenetre({
		titre: GTraductions.getValeur(
			"questionnaireStage.EvaluationEntrepriseAccueil",
		),
		largeur: 820,
		hauteur: 500,
		listeBoutons: [GTraductions.getValeur("Fermer")],
	});
}
function _evenementFenetreParametrage(aNumeroBouton, aParam) {
	if (aNumeroBouton === 1) {
		$.extend(this.parametres, aParam);
		Requetes("ListeStagiaires", this, _actionApresComboSession).lancerRequete(
			this.parametres,
		);
	}
}
function _actionApresComboSession(aJSON) {
	this.stages = _formatDonnees.bind(this)(aJSON);
	this.getInstance(this.identListe).setDonnees(
		new DonneesListe_ListeStagiaires(this.stages),
	);
}
function _formatDonnees(aJSON) {
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
function _getParametresPDF() {
	const lResult = {
		genreGenerationPDF: TypeHttpGenerationPDFSco.ListeStagiaires,
		parametres: this.parametres,
	};
	return lResult;
}
function _actionApresRequeteListeSessionsDeStage(aJSON) {
	this.sessionsDeStages = aJSON.sessionsDeStages;
	this.sessionsDeStages.insererElement(
		new ObjetElement(
			GTraductions.getValeur("stage.toutesLesSessions"),
			null,
			-1,
		),
		0,
	);
	this.sessionsDeStages.setTri([
		ObjetTri.init("Genre", true),
		ObjetTri.init("Libelle", true),
	]);
	this.sessionsDeStages.trier();
	this.getInstance(this.identCombo).setDonnees(this.sessionsDeStages);
	const lIndice = this.parametres.session
		? this.sessionsDeStages.getIndiceParNumeroEtGenre(
				this.parametres.session.getNumero(),
			)
		: 0;
	this.getInstance(this.identCombo).setSelection(lIndice);
	Invocateur.evenement(
		ObjetInvocateur.events.activationImpression,
		EGenreImpression.GenerationPDF,
		this,
		_getParametresPDF.bind(this),
	);
}
module.exports = { InterfaceListeStagiaires };
