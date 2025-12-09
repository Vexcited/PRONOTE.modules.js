exports._ObjetCelluleSemaine = void 0;
const Enumere_Event_1 = require("Enumere_Event");
const ObjetCelluleBouton_1 = require("ObjetCelluleBouton");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class _ObjetCelluleSemaine extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.nombreSemainesSelection = 1;
		this.cycles = IE.Cycles;
		this.cellule = new ObjetCelluleBouton_1.ObjetCelluleBouton(
			this.Nom + ".cellule",
			null,
			this,
			this.surCellule,
		);
		this.dateFinPersonnalise = GParametres.DerniereDate;
		this.dateDebutPersonnalise = GParametres.PremiereDate;
		this.setParametres();
		this.IdPremierElement = this.cellule.getPremierElement();
	}
	setParametresObjetCelluleSemaine(aNombreSemainesSelection, aInstanceCycle) {
		if (aNombreSemainesSelection) {
			this.nombreSemainesSelection = aNombreSemainesSelection;
		}
		if (aInstanceCycle) {
			this.cycles = aInstanceCycle;
		}
		this.cellule.setParametresPN(true, 160);
		this.cellule.setOptionsObjetCelluleBouton({ popupWAI: "dialog" });
	}
	setParametresDateFinPersonnalise(aDateFin) {
		this.dateFinPersonnalise = !!aDateFin ? aDateFin : GParametres.DerniereDate;
	}
	setParametresDateDebutPersonnalise(aDateDebut) {
		this.dateDebutPersonnalise = !!aDateDebut
			? aDateDebut
			: GParametres.PremiereDate;
	}
	initialiser() {
		super.initialiser();
		this.cellule.initialiser();
	}
	setDonnees(aDate) {
		this.dateDebut = aDate;
		this.actualiserDonnees(this.dateDebut);
	}
	construireAffichage() {
		return IE.jsx.str(
			"div",
			{ class: "input-wrapper", "ie-class": "getClassesDynamiques" },
			IE.jsx.str("ie-btnimage", {
				class: [
					"icon_angle_left",
					IE.estMobile
						? IEHtml_BtnImage_css_1.StylesIEHtmlBtnImage.btActivable
						: "",
				],
				"ie-model": "btnPrec",
				title: ObjetTraduction_1.GTraductions.getValeur("Precedent"),
			}),
			IE.jsx.str("div", { id: this.cellule.getNom() }),
			IE.jsx.str("ie-btnimage", {
				class: [
					"icon_angle_right",
					IE.estMobile
						? IEHtml_BtnImage_css_1.StylesIEHtmlBtnImage.btActivable
						: "",
				],
				"ie-model": "btnSuiv",
				title: ObjetTraduction_1.GTraductions.getValeur("Suivant"),
			}),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getClassesDynamiques() {
				const lClasses = [];
				if (!aInstance.getActif()) {
					lClasses.push("input-wrapper-disabled");
				}
				return lClasses.join(" ");
			},
			btnPrec: {
				event() {
					if (aInstance.getActif()) {
						aInstance.actualiserDonnees(aInstance.dateDebut, -1);
					}
				},
				getDisabled() {
					if (!aInstance.getActif()) {
						return false;
					}
					if (aInstance.nombreSemainesSelection) {
						return aInstance.dateDebut && aInstance.dateDebutPersonnalise
							? !ObjetDate_1.GDate.estAvantJour(
									aInstance.dateDebutPersonnalise,
									aInstance.dateDebut,
								)
							: true;
					}
					return false;
				},
			},
			btnSuiv: {
				event() {
					if (aInstance.getActif()) {
						aInstance.actualiserDonnees(aInstance.dateDebut, 1);
					}
				},
				getDisabled() {
					if (!aInstance.getActif()) {
						return false;
					}
					if (aInstance.nombreSemainesSelection) {
						if (!aInstance.dateFin || !aInstance.dateFinPersonnalise) {
							return true;
						}
						const lCycle = aInstance.cycles.cycleDeLaDate(aInstance.dateFin);
						return !ObjetDate_1.GDate.estAvantJour(
							aInstance.cycles.dateFinCycle(lCycle),
							aInstance.dateFinPersonnalise,
						);
					}
					return false;
				},
			},
		});
	}
	_getChaineDate() {
		return (
			ObjetTraduction_1.GTraductions.getValeur("Du") +
			ObjetDate_1.GDate.formatDate(this.dateDebut, " %JJ %MMM ") +
			ObjetTraduction_1.GTraductions.getValeur("Au") +
			ObjetDate_1.GDate.formatDate(this.dateFin, " %JJ %MMM")
		);
	}
	surCellule(aGenreEvent) {
		if (!this.getActif()) {
			return;
		}
		switch (aGenreEvent) {
			case Enumere_Event_1.EEvent.SurClick: {
				this._ouvrirFenetreDate();
				break;
			}
			case Enumere_Event_1.EEvent.SurKeyUp: {
				if (
					ObjetNavigateur_1.Navigateur.isToucheRetourChariot() ||
					ObjetNavigateur_1.Navigateur.isToucheFlecheBas()
				) {
					this._ouvrirFenetreDate();
				}
			}
		}
	}
	surFenetreDate(aGenreBouton, aDate) {
		if (
			aGenreBouton === 1 &&
			this.cycles.cycleDeLaDate(this.dateDebut) !==
				this.cycles.cycleDeLaDate(aDate)
		) {
			this.actualiserDonnees(aDate);
		}
	}
	_ouvrirFenetreDate() {
		const lParamJoursOuvres = this.options.uniquementJoursOuvres
			? GParametres.JoursOuvres
			: null;
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			{
				pere: this,
				evenement: this.surFenetreDate,
				initialiser: (aInstance) => {
					aInstance.setParametres(
						GParametres.PremierLundi,
						this.dateDebutPersonnalise,
						this.dateFinPersonnalise,
						lParamJoursOuvres,
					);
				},
			},
		);
		const lDate = ObjetDate_1.GDate.dateEntreLesDates(
			this.dateDebut,
			this.dateDebutPersonnalise,
			this.dateFinPersonnalise,
		)
			? this.dateDebut
			: this.dateDebutPersonnalise;
		lFenetre.setDonnees(lDate);
		lFenetre.positionnerSousId(this.Nom);
		this.callback.appel();
	}
	actualiserDonnees(aDate, aDecalage) {
		const lDomaine = this.getDomaineSelectionne();
		if (this.nombreSemainesSelection) {
			const lCycle = this.cycles.cycleDeLaDate(aDate),
				lCycleDebut = Math.borner(
					lCycle + (aDecalage || 0),
					1,
					this.cycles.nombreCyclesAnneeScolaire() -
						this.nombreSemainesSelection +
						1,
				),
				lCycleFin = lCycleDebut + this.nombreSemainesSelection - 1;
			this.dateDebut = this.options.uniquementJoursOuvres
				? this.cycles.datePremierJourOuvreCycle(lCycleDebut)
				: this.cycles.dateDebutCycle(lCycleDebut);
			this.dateFin = this.cycles.dateDernierJourOuvreCycle(lCycleFin);
			this.cellule.setLibelle(this._getChaineDate());
			lDomaine.vider();
			lDomaine.setValeur(true, lCycleDebut, lCycleFin);
			this.callback.appel(lDomaine);
			this.$refreshSelf();
		} else {
		}
	}
	setActif(aActif) {
		super.setActif(aActif);
		this.$refreshSelf();
	}
}
exports._ObjetCelluleSemaine = _ObjetCelluleSemaine;
