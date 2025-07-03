exports.ObjetFenetre_CalendrierPeriode = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetCalendrierPeriode_1 = require("ObjetCalendrierPeriode");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
class ObjetFenetre_CalendrierPeriode extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 1000,
			hauteurMaxContenu: 650,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
	}
	construireInstances() {
		this.idCalendrier = this.add(
			ObjetCalendrierPeriode_1.ObjetCalendrierPeriode,
			this.evenementSurCalendrier,
			(aInstanceCalendrier) => {
				aInstanceCalendrier.setParametres({
					avecEdition: true,
					avecSuppressionSurZone: true,
					avecJoursFeries: false,
					avecJoursNonOuvres: false,
				});
			},
		);
	}
	setParametres(aParams) {
		if (aParams.avecZoneUnique !== undefined) {
			this.avecZoneUnique = aParams.avecZoneUnique;
		}
		this.getInstance(this.idCalendrier).setParametres(aParams);
	}
	composeContenu() {
		return IE.jsx.str(
			"div",
			{ class: "CalendrierPeriode" },
			IE.jsx.str("div", { id: this.getNomInstance(this.idCalendrier) }),
		);
	}
	composeBas() {
		return IE.jsx.str(
			"div",
			{ class: "compose-bas" },
			IE.jsx.str("ie-btnicon", {
				title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				class: "icon_trash avecFond i-medium",
				"ie-model": this.jsxModeleBoutonSuppr.bind(this),
			}),
		);
	}
	jsxModeleBoutonSuppr() {
		return {
			event: () => {
				this.donnees = new ObjetListeElements_1.ObjetListeElements();
				this.actualiserCalendrier();
			},
		};
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.actualiserCalendrier();
		this.$refreshSelf();
		this.afficher();
	}
	actualiserCalendrier() {
		const lZones = new ObjetListeElements_1.ObjetListeElements();
		lZones.add(
			ObjetElement_1.ObjetElement.create({
				id: "periodes",
				class: ["zone-theme"],
				editable: true,
				donnees: this.donnees,
			}),
		);
		const lInstanceCalendrier = this.getInstance(this.idCalendrier);
		const lScrollTop = lInstanceCalendrier.getValeurScrollTop();
		lInstanceCalendrier.setDonnees({ Zones: lZones });
		lInstanceCalendrier.setValeurScrollTop(lScrollTop);
	}
	evenementSurCalendrier(aParams) {
		if (aParams.estSurZone) {
			this.donnees = this.donnees.removeFilter((aPeriode) => {
				return (
					aPeriode.dateDebut >= aParams.dates.dateDebut &&
					aPeriode.dateFin <= aParams.dates.dateFin
				);
			});
			this.donnees.parcourir((aPeriode) => {
				const lDateBorneDebut = new Date(aParams.dates.dateDebut);
				const lDateBorneFin = new Date(aParams.dates.dateFin);
				aPeriode.dateDebut = ObjetDate_1.GDate.dateEntreLesDates(
					aPeriode.dateDebut,
					lDateBorneDebut,
					lDateBorneFin,
				)
					? ObjetDate_1.GDate.getJourSuivant(lDateBorneFin)
					: aPeriode.dateDebut;
				aPeriode.dateFin = ObjetDate_1.GDate.dateEntreLesDates(
					aPeriode.dateFin,
					lDateBorneDebut,
					lDateBorneFin,
				)
					? new Date(lDateBorneDebut.setDate(lDateBorneDebut.getDate() - 1))
					: aPeriode.dateFin;
			});
			this.donnees.parcourir((aPeriode) => {
				const lDateBorneDebut = new Date(aParams.dates.dateDebut);
				const lDateBorneFin = new Date(aParams.dates.dateFin);
				const lPeriodeDebut = new Date(aPeriode.dateDebut);
				const lPeriodeFin = new Date(aPeriode.dateFin);
				if (
					ObjetDate_1.GDate.dateEntreLesDates(
						lDateBorneDebut,
						lPeriodeDebut,
						lPeriodeFin,
					) &&
					ObjetDate_1.GDate.dateEntreLesDates(
						lDateBorneFin,
						lPeriodeDebut,
						lPeriodeFin,
					)
				) {
					if (!this.avecZoneUnique) {
						aPeriode.dateFin = new Date(
							lDateBorneDebut.setDate(lDateBorneDebut.getDate() - 1),
						);
						this.donnees.add(
							ObjetElement_1.ObjetElement.create({
								dateDebut: ObjetDate_1.GDate.getJourSuivant(lDateBorneFin),
								dateFin: lPeriodeFin,
							}),
						);
					} else {
						GApplication.getMessage().afficher({
							message: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreCalendrierPeriode.periodeDiscontinue",
							),
						});
						return;
					}
				}
			});
		} else {
			const lPeriode = ObjetElement_1.ObjetElement.create({
				dateDebut: new Date(aParams.dates.dateDebut),
				dateFin: new Date(aParams.dates.dateFin),
			});
			if (!this.avecZoneUnique) {
				this.donnees = this.donnees.removeFilter((aPeriode) => {
					return (
						aPeriode.dateDebut > aParams.dates.dateDebut &&
						aPeriode.dateFin < aParams.dates.dateFin
					);
				});
			}
			let lPeriodeFusionnee = null;
			if (aParams.estFiniSurZone) {
				this.donnees.parcourir((aPeriode) => {
					const lDateBorneDebut = new Date(aParams.dates.dateDebut);
					const lDateBorneFin = new Date(aParams.dates.dateFin);
					if (
						ObjetDate_1.GDate.dateEntreLesDates(
							aPeriode.dateDebut,
							lDateBorneDebut,
							lDateBorneFin,
						)
					) {
						aPeriode.dateDebut = new Date(lDateBorneDebut);
						lPeriodeFusionnee = aPeriode;
					}
					if (
						ObjetDate_1.GDate.dateEntreLesDates(
							aPeriode.dateFin,
							lDateBorneDebut,
							lDateBorneFin,
						)
					) {
						aPeriode.dateFin = new Date(lDateBorneFin);
						lPeriodeFusionnee = aPeriode;
					}
				});
			}
			this.donnees.parcourir((aPeriode, aIndex) => {
				const lDateBorneDebut = new Date(aParams.dates.dateDebut);
				const lDateBorneFin = new Date(aParams.dates.dateFin);
				if (
					ObjetDate_1.GDate.estDateEgale(
						aPeriode.dateFin,
						new Date(lDateBorneDebut.setDate(lDateBorneDebut.getDate() - 1)),
					)
				) {
					if (!lPeriodeFusionnee) {
						aPeriode.dateFin = new Date(aParams.dates.dateFin);
						lPeriodeFusionnee = aPeriode;
					} else {
						lPeriodeFusionnee.dateDebut = new Date(aPeriode.dateDebut);
						this.donnees.remove(aIndex);
					}
				}
				if (
					ObjetDate_1.GDate.estDateEgale(
						aPeriode.dateDebut,
						new Date(lDateBorneFin.setDate(lDateBorneFin.getDate() + 1)),
					)
				) {
					if (!lPeriodeFusionnee) {
						aPeriode.dateDebut = new Date(aParams.dates.dateDebut);
						lPeriodeFusionnee = aPeriode;
					} else {
						lPeriodeFusionnee.dateFin = new Date(aPeriode.dateFin);
						this.donnees.remove(aIndex);
					}
				}
			});
			if (!lPeriodeFusionnee) {
				if (this.avecZoneUnique) {
					this.donnees = new ObjetListeElements_1.ObjetListeElements().add(
						lPeriode,
					);
				} else {
					this.donnees.add(lPeriode);
				}
			}
		}
		this.actualiserCalendrier();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			this.callback.appel(this.donnees);
		}
		this.fermer();
	}
}
exports.ObjetFenetre_CalendrierPeriode = ObjetFenetre_CalendrierPeriode;
