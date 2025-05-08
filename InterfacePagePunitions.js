const ObjetRequetePagePunitions = require("ObjetRequetePagePunitions.js");
const DonneesListe_Punitions = require("DonneesListe_Punitions.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { ObjetListe } = require("ObjetListe.js");
const { InterfacePage } = require("InterfacePage.js");
const ObjetRequeteSaisiePunitions = require("ObjetRequeteSaisiePunitions.js");
class ObjetAffichagePagePunitions extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idxFiltre = GEtatUtilisateur.getFiltreSurveillances();
		this.filtres = new ObjetListeElements();
		this.filtres.addElement(
			new ObjetElement(
				GTraductions.getValeur("punition.surveillance.toutes"),
				null,
				ObjetAffichagePagePunitions.genreFiltre.toutes,
			),
		);
		this.filtres.addElement(
			new ObjetElement(
				GTraductions.getValeur("punition.surveillance.lesMiennes"),
				null,
				ObjetAffichagePagePunitions.genreFiltre.lesMiennes,
			),
		);
		this.filtres.addElement(
			new ObjetElement(
				GTraductions.getValeur("punition.surveillance.lesNonAttribuees"),
				null,
				ObjetAffichagePagePunitions.genreFiltre.lesNonAttribuees,
			),
		);
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate,
			this.evenementSurDate,
			this.initialiserDate,
		);
		this.identFiltre = this.add(
			ObjetSaisie,
			_evenementFiltre.bind(this),
			_initFiltre.bind(this),
		);
		this.identListe = this.add(ObjetListe, null, this.initialiserListe);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [{ ident: this.identDate }, { ident: this.identFiltre }];
	}
	initialiserDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ avecBoutonsPrecedentSuivant: true });
		aInstance.setControleNavigation(true);
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe(DonneesListe_Punitions.options);
		GEtatUtilisateur.setTriListe({ liste: aInstance, tri: [0, 1] });
	}
	requetePage(aNavigation) {
		new ObjetRequetePagePunitions(
			this,
			this._reponseRequetePagePunitions,
		).lancerRequete({
			dateDebut: aNavigation.dateDebut,
			dateFin: aNavigation.dateFin,
		});
	}
	recupererDonnees() {
		this.afficherPage();
		this.getInstance(this.identFiltre).setDonnees(this.filtres, this.idxFiltre);
	}
	afficherPage() {
		this.setEtatSaisie(false);
		const lDate = GParametres.listeComboPeriodes.navigation
			? GParametres.listeComboPeriodes.navigation.dateDebut
			: GDate.getDateCourante();
		this.getInstance(this.identDate).setDonnees(lDate);
		this.evenementSurDate(lDate);
	}
	_reponseRequetePagePunitions(aListePunitions) {
		this.listePunitions = aListePunitions;
		_filtrerDonnees.call(this);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Punitions(this.listePunitions),
		);
	}
	valider() {
		new ObjetRequeteSaisiePunitions(
			this,
			this.actionSurValidation,
		).lancerRequete(this.listePunitions);
	}
	evenementSurDate(aDate) {
		this.setEtatSaisie(false);
		const lNavigation = {};
		lNavigation.dateDebut = aDate;
		lNavigation.dateFin = aDate;
		GParametres.listeComboPeriodes.navigation = lNavigation;
		this.requetePage(lNavigation);
	}
}
ObjetAffichagePagePunitions.genreFiltre = {
	toutes: 0,
	lesMiennes: 1,
	lesNonAttribuees: 2,
};
function _initFiltre(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 200,
		labelWAICellule: GTraductions.getValeur("punition.surveillances"),
		deroulerListeSeulementSiPlusieursElements: false,
		initAutoSelectionAvecUnElement: false,
		classTexte: "Gras",
		texteEdit: GTraductions.getValeur("punition.surveillances"),
	});
}
function _evenementFiltre(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.idxFiltre = aParams.indice;
		GEtatUtilisateur.setFiltreSurveillances(this.idxFiltre);
		_filtrerDonnees.call(this);
		if (this.listePunitions) {
			this.getInstance(this.identListe).actualiser(true);
		}
	}
}
function _filtrerDonnees() {
	if (this.listePunitions) {
		this.listePunitions.parcourir((aElement) => {
			aElement.visible = false;
			switch (this.idxFiltre) {
				case ObjetAffichagePagePunitions.genreFiltre.toutes:
					aElement.visible = true;
					break;
				case ObjetAffichagePagePunitions.genreFiltre.lesMiennes:
					aElement.visible = aElement.estLeSurveillant;
					_verifierVisibilitePere(aElement);
					break;
				case ObjetAffichagePagePunitions.genreFiltre.lesNonAttribuees:
					aElement.visible = aElement.sansSurveillant;
					_verifierVisibilitePere(aElement);
					break;
				default:
					aElement.visible = true;
					break;
			}
		});
		this.listePunitions.parcourir((aElement) => {
			if (!aElement.visible && aElement.pere && aElement.pere.visible) {
				aElement.visible = true;
			}
		});
	}
}
function _verifierVisibilitePere(aElement) {
	if (aElement.visible && aElement.pere) {
		aElement.pere.visible = true;
	}
}
module.exports = ObjetAffichagePagePunitions;
