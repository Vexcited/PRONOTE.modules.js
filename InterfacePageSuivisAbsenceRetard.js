exports.InterfacePageSuivisAbsenceRetard = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const InterfaceSuivisAbsenceRetard_1 = require("InterfaceSuivisAbsenceRetard");
const UtilitaireListePeriodes_1 = require("UtilitaireListePeriodes");
class InterfacePageSuivisAbsenceRetard extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.listePeriodes =
			UtilitaireListePeriodes_1.TUtilitaireListePeriodes.construireListePeriodes(
				[
					UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.aujourdhui,
					UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
						.semainePrecedente,
					UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
						.semaineCourante,
					UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.moisCourant,
					UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.annee,
					UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.periodes,
					UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.mois,
				],
			);
		this.parametresSco = this.applicationSco.getObjetParametres();
	}
	construireInstances() {
		this.identPage = this.add(
			InterfaceSuivisAbsenceRetard_1.InterfaceSuivisAbsenceRetard,
		);
		this.identComboPeriode = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evenementSurComboPeriode,
			this._initialiserComboPeriode,
		);
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDate.bind(this, true),
			this.initialiserDate,
		);
		this.identDate2 = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDate.bind(this, false),
			this.initialiserDate,
		);
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
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
			{ html: ObjetTraduction_1.GTraductions.getValeur("Periode") },
			this.identComboPeriode,
			{ html: ObjetTraduction_1.GTraductions.getValeur("Du") },
			this.identDate,
			{ html: ObjetTraduction_1.GTraductions.getValeur("Au") },
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
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	afficherPage() {
		if (!this.eleve) {
			ObjetHtml_1.GHtml.setDisplay(this.getNomInstance(this.identListe), false);
		} else {
			const lNavigation = this.parametresSco.listeComboPeriodes.navigation;
			if (lNavigation && lNavigation.dateDebut && lNavigation.dateFin) {
				this.getInstance(this.identDate).setDonnees(lNavigation.dateDebut);
				this.getInstance(this.identDate2).setDonnees(lNavigation.dateFin);
				this._actualiserComboSelonDates(
					lNavigation.dateDebut,
					lNavigation.dateFin,
				);
			} else {
				let lIndiceSemaineCourante = -1;
				this.listePeriodes.parcourir((D, aIndice) => {
					if (
						D.choix ===
						UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
							.semaineCourante
					) {
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
			this.parametresSco.listeComboPeriodes.navigation.dateDebut,
			this.parametresSco.listeComboPeriodes.navigation.dateFin,
		);
	}
	evenementSurDernierMenuDeroulant() {
		this.eleve = this.applicationSco
			.getEtatUtilisateur()
			.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Eleve);
		this.afficherBandeau(true);
		this.surResizeInterface();
		this.surSelectionEleve();
		this.afficherPage();
	}
	evenementSurDate(aDateDebut, aDate) {
		const lNavigation = this.parametresSco.listeComboPeriodes.navigation || {
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
		this._actualiserComboSelonDates(lNavigation.dateDebut, lNavigation.dateFin);
		this.parametresSco.listeComboPeriodes.navigation = lNavigation;
		this.getInstance(this.identPage).setDonnees(
			this.eleve,
			this.parametresSco.listeComboPeriodes.navigation.dateDebut,
			this.parametresSco.listeComboPeriodes.navigation.dateFin,
		);
	}
	valider() {
		this.getInstance(this.identPage).valider(
			this.actionSurValidation.bind(this),
		);
	}
	_evenementSurComboPeriode(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			const lNavigation = (this.parametresSco.listeComboPeriodes.navigation = {
				dateDebut: aParams.element.dates.debut,
				dateFin: aParams.element.dates.fin,
			});
			this.getInstance(this.identDate).setDonnees(lNavigation.dateDebut);
			this.getInstance(this.identDate2).setDonnees(lNavigation.dateFin);
			if (this.getInstance(this.identComboPeriode).InteractionUtilisateur) {
				this.getInstance(this.identPage).setDonnees(
					this.eleve,
					this.parametresSco.listeComboPeriodes.navigation.dateDebut,
					this.parametresSco.listeComboPeriodes.navigation.dateFin,
				);
			}
		}
	}
	_initialiserComboPeriode(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 150,
			hauteur: 17,
			classTexte: "Gras",
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur("Periode"),
		});
		aInstance.setControleNavigation(true);
		aInstance.setDonnees(this.listePeriodes);
	}
	_actualiserComboSelonDates(aDateDebut, aDateFin) {
		let lIndiceSemaineCourante = -1;
		this.listePeriodes.parcourir((D, aIndice) => {
			if (
				ObjetDate_1.GDate.estJourEgal(D.dates.debut, aDateDebut) &&
				ObjetDate_1.GDate.estJourEgal(D.dates.fin, aDateFin)
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
}
exports.InterfacePageSuivisAbsenceRetard = InterfacePageSuivisAbsenceRetard;
