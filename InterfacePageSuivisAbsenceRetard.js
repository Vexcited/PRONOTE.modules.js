const { GHtml } = require("ObjetHtml.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
	InterfaceSuivisAbsenceRetard,
} = require("InterfaceSuivisAbsenceRetard.js");
const { TUtilitaireListePeriodes } = require("UtilitaireListePeriodes.js");
class InterfacePageSuivisAbsenceRetard extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.listePeriodes = TUtilitaireListePeriodes.construireListePeriodes([
			TUtilitaireListePeriodes.choix.aujourdhui,
			TUtilitaireListePeriodes.choix.semainePrecedente,
			TUtilitaireListePeriodes.choix.semaineCourante,
			TUtilitaireListePeriodes.choix.moisCourant,
			TUtilitaireListePeriodes.choix.annee,
			TUtilitaireListePeriodes.choix.periodes,
			TUtilitaireListePeriodes.choix.mois,
		]);
	}
	construireInstances() {
		this.identPage = this.add(InterfaceSuivisAbsenceRetard);
		this.identComboPeriode = this.add(
			ObjetSaisie,
			_evenementSurComboPeriode,
			_initialiserComboPeriode,
		);
		this.identDate = this.add(
			ObjetCelluleDate,
			this.evenementSurDate.bind(this, true),
			this.initialiserDate,
		);
		this.identDate2 = this.add(
			ObjetCelluleDate,
			this.evenementSurDate.bind(this, false),
			this.initialiserDate,
		);
		this.identTripleCombo = this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.construireFicheEleveEtFichePhoto();
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identPage;
		this.AddSurZone = [
			this.identTripleCombo,
			{ separateur: true },
			{ html: GTraductions.getValeur("Periode") },
			this.identComboPeriode,
			{ html: GTraductions.getValeur("Du") },
			this.identDate,
			{ html: GTraductions.getValeur("Au") },
			this.identDate2,
		];
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
	}
	getPrioriteAffichageBandeauLargeur() {
		return [];
	}
	initialiserFenetreFicheEleve(aInstance) {
		super.initialiserFenetreFicheEleve(aInstance);
	}
	initialiserDate(aInstance) {
		aInstance.setControleNavigation(true);
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([EGenreRessource.Classe, EGenreRessource.Eleve]);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	afficherPage() {
		if (!this.eleve) {
			GHtml.setDisplay(this.getInstance(this.identListe).getNom(), false);
		} else {
			const lNavigation = GParametres.listeComboPeriodes.navigation;
			if (lNavigation && lNavigation.dateDebut && lNavigation.dateFin) {
				this.getInstance(this.identDate).setDonnees(lNavigation.dateDebut);
				this.getInstance(this.identDate2).setDonnees(lNavigation.dateFin);
				_actualiserComboSelonDates.call(
					this,
					lNavigation.dateDebut,
					lNavigation.dateFin,
				);
			} else {
				let lIndiceSemaineCourante = -1;
				this.listePeriodes.parcourir((D, aIndice) => {
					if (D.choix === TUtilitaireListePeriodes.choix.semaineCourante) {
						lIndiceSemaineCourante = aIndice;
						return false;
					}
				});
				this.getInstance(this.identComboPeriode).setSelection(
					lIndiceSemaineCourante,
				);
			}
		}
		this.getInstance(this.identPage).setDonnees(
			this.eleve,
			GParametres.listeComboPeriodes.navigation.dateDebut,
			GParametres.listeComboPeriodes.navigation.dateFin,
		);
	}
	evenementSurDernierMenuDeroulant() {
		this.eleve = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Eleve,
		);
		this.afficherBandeau(true);
		this.surResizeInterface();
		this.surSelectionEleve();
		this.afficherPage();
	}
	evenementSurDate(aDateDebut, aDate) {
		const lNavigation = GParametres.listeComboPeriodes.navigation || {
			dateDebut: this.getInstance(this.identDate).getDate(),
			dateFin: this.getInstance(this.identDate2).getDate(),
		};
		if (aDateDebut) {
			if (this.getInstance(this.identDate2).getDate() < aDate) {
				this.getInstance(this.identDate2).setDonnees(aDate);
				lNavigation.dateFin = aDate;
			}
			lNavigation.dateDebut = aDate;
		} else {
			if (this.getInstance(this.identDate).getDate() > aDate) {
				this.getInstance(this.identDate).setDonnees(aDate);
				lNavigation.dateDebut = aDate;
			}
			lNavigation.dateFin = aDate;
		}
		_actualiserComboSelonDates.call(
			this,
			lNavigation.dateDebut,
			lNavigation.dateFin,
		);
		GParametres.listeComboPeriodes.navigation = lNavigation;
		this.getInstance(this.identPage).setDonnees(
			this.eleve,
			GParametres.listeComboPeriodes.navigation.dateDebut,
			GParametres.listeComboPeriodes.navigation.dateFin,
		);
	}
	valider() {
		this.getInstance(this.identPage).valider(
			this.actionSurValidation.bind(this),
		);
	}
}
function _evenementSurComboPeriode(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		const lNavigation = (GParametres.listeComboPeriodes.navigation = {
			dateDebut: aParams.element.dates.debut,
			dateFin: aParams.element.dates.fin,
		});
		this.getInstance(this.identDate).setDonnees(lNavigation.dateDebut);
		this.getInstance(this.identDate2).setDonnees(lNavigation.dateFin);
		if (this.getInstance(this.identComboPeriode).InteractionUtilisateur) {
			this.getInstance(this.identPage).setDonnees(
				this.eleve,
				GParametres.listeComboPeriodes.navigation.dateDebut,
				GParametres.listeComboPeriodes.navigation.dateFin,
			);
		}
	}
}
function _initialiserComboPeriode(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 150,
		hauteur: 17,
		classTexte: "Gras",
	});
	aInstance.setControleNavigation(true);
	aInstance.setDonnees(this.listePeriodes);
}
function _actualiserComboSelonDates(aDateDebut, aDateFin) {
	let lIndiceSemaineCourante = -1;
	this.listePeriodes.parcourir((D, aIndice) => {
		if (
			GDate.estJourEgal(D.dates.debut, aDateDebut) &&
			GDate.estJourEgal(D.dates.fin, aDateFin)
		) {
			lIndiceSemaineCourante = aIndice;
			return false;
		}
	});
	if (lIndiceSemaineCourante >= 0) {
		this.getInstance(this.identComboPeriode).setSelection(
			lIndiceSemaineCourante,
		);
	} else {
		this.getInstance(this.identComboPeriode).setContenu("");
	}
}
module.exports = { InterfacePageSuivisAbsenceRetard };
