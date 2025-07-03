exports.PageSaisieOffresStagesPN = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const PageSaisieOffresStages_1 = require("PageSaisieOffresStages");
const ObjetRequeteListeSujetsStages_1 = require("ObjetRequeteListeSujetsStages");
const ObjetRequeteListeOffresStages_1 = require("ObjetRequeteListeOffresStages");
const ObjetRequeteSaisieOffresStages_1 = require("ObjetRequeteSaisieOffresStages");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const AccessApp_1 = require("AccessApp");
class PageSaisieOffresStagesPN extends ObjetInterfacePageCP_1.InterfacePageCP {
	construireInstances() {
		this.identPage = this.add(
			PageSaisieOffresStages_1.PageSaisieOffresStages,
			this._evntSaisieOffresStage.bind(this),
			this._initSaisieOffresStage.bind(this),
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identPage;
	}
	recupererDonnees() {
		new ObjetRequeteListeSujetsStages_1.ObjetRequeteListeSujetsStages(
			this,
			this.actionSurRecupererListeSujetsDeStage,
		).lancerRequete();
	}
	actionSurRecupererListeOffres(aParam) {
		this.listeOffres = aParam.listeEntreprises.get(0).listeOffresStages;
		this.getInstance(this.identPage).setDonnees({
			listeOffres: this.listeOffres,
			listeSujets: this.listeSujets,
			callbackRetour: () => {
				this.callbackRetour();
			},
		});
	}
	actionSurRecupererListeSujetsDeStage(aParam) {
		this.listeSujets = aParam.listeSujetsStages;
		new ObjetRequeteListeOffresStages_1.ObjetRequeteListeOffresStages(
			this,
			this.actionSurRecupererListeOffres,
		).lancerRequete();
	}
	lancerSaisie(aParam) {
		new ObjetRequeteSaisieOffresStages_1.ObjetRequeteSaisieOffresStages(
			this,
			this._actionSurSaisie.bind(this),
		).lancerRequete({ listeOffres: aParam.listeOffres });
	}
	callbackRetour() {
		this.getInstance(this.identPage).setDonnees({
			listeOffres: this.listeOffres,
			listeSujets: this.listeSujets,
			callbackRetour: () => {
				this.callbackRetour();
			},
		});
	}
	_evntSaisieOffresStage(aParam) {
		this.lancerSaisie(aParam);
	}
	_initSaisieOffresStage(aInstance) {
		aInstance.setOptions({
			editionOffreStage: {
				avecPeriode: true,
				avecPeriodeUnique: false,
				avecSujetObjetSaisie: true,
				avecGestionPJ: false,
				tailleMaxPieceJointe: 0,
				avecEditionDocumentsJoints: false,
				genreRessourcePJ: -1,
			},
		});
		aInstance.setAutorisations({
			autoriserEditionToutesOffresStages: (0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.stage.autoriserEditionToutesOffresStages,
			),
		});
	}
	_actionSurSaisie() {
		this.recupererDonnees();
	}
}
exports.PageSaisieOffresStagesPN = PageSaisieOffresStagesPN;
