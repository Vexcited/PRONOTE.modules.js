const {
	ObjetRequetePageOrientations,
} = require("ObjetRequetePageOrientations.js");
const { ObjetFenetre_Orientations } = require("ObjetFenetre_Orientations.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
	ObjetFenetre_RessourceOrientation,
} = require("ObjetFenetre_RessourceOrientation.js");
const { GUID } = require("GUID.js");
const {
	ObjetRequeteSaisieOrientations,
} = require("ObjetRequeteSaisieOrientations.js");
const { _InterfaceOrientation } = require("_InterfaceOrientation.js");
const { TypeRubriqueOrientation } = require("TypeRubriqueOrientation.js");
const { Type3Etats } = require("Type3Etats.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { TUtilitaireOrientation } = require("UtilitaireOrientation.js");
class InterfaceOrientationsProfesseur extends _InterfaceOrientation {
	construireInstances() {
		this.identTripleCombo = this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			_evntSurDernierMenuDeroulant.bind(this),
			_initTripleCombo.bind(this),
		);
		this.identFenetre = this.addFenetre(
			ObjetFenetre_Orientations,
			null,
			this.initialiserFenetre,
		);
		this.identFenetreRessource = this.addFenetre(
			ObjetFenetre_RessourceOrientation,
			super.evntFenetreRessource,
			this.initialiserFenetre,
		);
		this.idDivGenerale = GUID.getId();
		this.idMessage = GUID.getId();
		this.IdentOrientationsIntentions = [];
		this.IdentOrientationsDefinitif = [];
		this.identComboOrientationAR = this.add(
			ObjetSaisiePN,
			null,
			this.initialiserCombo,
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.idDivGenerale;
		this.GenreStructure = EStructureAffichage.Autre;
		this.AddSurZone = [
			this.identTripleCombo,
			{ html: this.creerBoutonAffichageInformation() },
		];
	}
	valider() {
		_saisie.call(this);
	}
	afficherPage() {
		_afficherPage.call(this);
	}
	getControleur(aInstance) {
		return $.extend(
			true,
			super.getControleur(aInstance),
			TUtilitaireOrientation.getControleurGeneral(aInstance),
			{
				btnValider: {
					event: function () {
						aInstance.valider();
					},
					getDisabled: function () {
						return !aInstance.getEtatSaisie();
					},
					getDisplay: function (aGenreRubrique) {
						const lRubrique =
							aInstance.Donnees.listeRubriques.getElementParGenre(
								aGenreRubrique,
							);
						let lAfficher = true;
						if (lRubrique) {
							lAfficher = lRubrique.avecSaisie;
						}
						return lAfficher;
					},
				},
				cbARAvisConseil: {
					getValue: function () {
						const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutreRecommandationConseil,
						);
						return !!lDonnesAR
							? lDonnesAR.estAccuse === Type3Etats.TE_Oui
							: false;
					},
					setValue: function () {
						const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutreRecommandationConseil,
						);
						if (!!lDonnesAR) {
							lDonnesAR.estAccuse = Type3Etats.TE_Oui;
							aInstance.setEtatSaisie(true);
							_saisie.call(aInstance, lDonnesAR);
						}
					},
					getDisabled: function () {
						const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutreRecommandationConseil,
						);
						if (!!lDonnesAR) {
							return (
								lDonnesAR.estAccuse === Type3Etats.TE_Oui ||
								!lDonnesAR.estEditable
							);
						}
					},
				},
				radioARStage: {
					getValue: function (aChoix) {
						const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutreRecommandationConseil,
						);
						return !!lDonnesAR
							? lDonnesAR.reponseStagePasserelle === aChoix
							: false;
					},
					setValue: function (aChoix) {
						const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutreRecommandationConseil,
						);
						if (!!lDonnesAR) {
							lDonnesAR.reponseStagePasserelle = aChoix;
							aInstance.setEtatSaisie(true);
							_saisie.call(aInstance, lDonnesAR);
						}
					},
					getDisabled: function () {
						const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutreRecommandationConseil,
						);
						if (!!lDonnesAR) {
							return !lDonnesAR.estEditable;
						}
					},
				},
				radioARProposition: {
					getValue: function (aChoix) {
						const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutrePropositionConseil,
						);
						return !!lDonnesAR ? lDonnesAR.estAccuse === aChoix : false;
					},
					setValue: function (aChoix) {
						const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutrePropositionConseil,
						);
						if (!!lDonnesAR) {
							aInstance.setEtatSaisie(true);
							lDonnesAR.estAccuse = aChoix;
							_saisie.call(aInstance, lDonnesAR);
						}
					},
					getDisabled: function () {
						const lDonneesAR = aInstance.getDonnesARDeRubriqueDeGenre(
							TypeRubriqueOrientation.RO_AutrePropositionConseil,
						);
						if (!!lDonneesAR) {
							return !lDonneesAR.estEditable;
						}
					},
				},
			},
		);
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({ estLargeurAuto: true, hauteur: 17 });
	}
	_recupererDonnees() {}
}
function _getEleve() {
	return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve);
}
function _getClasse() {
	return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
}
function _initTripleCombo(aInstance) {
	aInstance.setParametres([EGenreRessource.Classe, EGenreRessource.Eleve]);
}
function _evntSurDernierMenuDeroulant() {
	this.surSelectionEleve();
	const lEleve = _getEleve();
	const lExisteEleve =
		lEleve !== null && lEleve !== undefined && lEleve.existeNumero();
	if (lExisteEleve) {
		_afficherPage.call(this);
	}
}
function _saisie(aDonneesAR) {
	let lListeOrientations = new ObjetListeElements();
	let lDonneesAR = null;
	let lRubriqueLV;
	if (!!aDonneesAR) {
		lDonneesAR = aDonneesAR;
	} else {
		lListeOrientations = this.getListeOrientationSaisie();
		lRubriqueLV = this.rubriqueLV;
	}
	new ObjetRequeteSaisieOrientations(
		this,
		this.actionSurValidation,
	).lancerRequete({
		listeOrientations: lListeOrientations,
		donneesAR: lDonneesAR,
		eleve: _getEleve(),
		rubriqueLV: lRubriqueLV,
	});
}
function _afficherPage() {
	const lParam = { eleve: _getEleve(), classe: _getClasse() };
	new ObjetRequetePageOrientations(
		this,
		this.actionSurRecupererDonnees,
	).lancerRequete(lParam);
}
module.exports = InterfaceOrientationsProfesseur;
