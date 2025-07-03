exports.InterfacePageEtablissement = void 0;
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetListe_1 = require("ObjetListe");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const AccessApp_1 = require("AccessApp");
class InterfacePageEtablissement extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.appSco = (0, AccessApp_1.getApp)();
		this.parametresSco = this.appSco.getObjetParametres();
		this.selectionEvaluation = {};
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this.evenementSurCalendrier,
			this.initialiserCalendrier,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
	}
	initialiserCalendrier(aInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aInstance);
		aInstance.setControleNavigation(true);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
	}
	recupererDonnees() {
		this.afficherPage();
	}
	afficherPage() {
		this.setEtatSaisie(false);
		this.getInstance(this.identCalendrier).setSelection(
			this.appSco.getEtatUtilisateur().getSemaineSelectionnee(),
		);
	}
	evenementSurCalendrier(aNumeroSemaine) {
		this.appSco.getEtatUtilisateur().setSemaineSelectionnee(aNumeroSemaine);
		const lDates = this.getInstance(this.identCalendrier).getDates();
		const lNavigation = {};
		lNavigation.dateDebut = lDates.dateDebut;
		lNavigation.dateFin = lDates.dateFin;
		this.parametresSco.listeComboPeriodes.navigation = lNavigation;
		this.requetePage(lNavigation);
	}
}
exports.InterfacePageEtablissement = InterfacePageEtablissement;
