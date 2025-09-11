exports.ObjetPublication = void 0;
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
class ObjetPublication extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.id = { cbPublie: this.Nom + "_CBPubliee" };
		this.donnees = {
			publie: false,
			dateDebut: GParametres.PremiereDate,
			dateFin: GParametres.DerniereDate,
		};
	}
	initialiser() {
		this.objDateDebut = new ObjetCelluleDate_1.ObjetCelluleDate(
			this.Nom + ".dateDebut",
			null,
			this,
			this.surDateDebut,
		);
		this.objDateFin = new ObjetCelluleDate_1.ObjetCelluleDate(
			this.Nom + ".dateFin",
			null,
			this,
			this.surDateFin,
		);
		this.initDate(this.objDateDebut, true);
		this.initDate(this.objDateFin, false);
		this.afficher();
		this.objDateDebut.initialiser();
		this.objDateFin.initialiser();
	}
	setDonnees(aDonnees) {
		$.extend(this.donnees, aDonnees);
		this.objDateDebut.setDonnees(this.donnees.dateDebut);
		this.objDateFin.setDonnees(this.donnees.dateFin);
		this.objDateDebut.setActif(!!this.donnees.publie);
		this.objDateFin.setActif(!!this.donnees.publie);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbPublication: {
				getValue: function () {
					return !!aInstance.donnees && !!aInstance.donnees.publie;
				},
				setValue: function (aValeur) {
					if (!!aInstance.donnees) {
						aInstance.donnees.publie = aValeur;
						aInstance.objDateDebut.setActif(!!aValeur);
						aInstance.objDateFin.setActif(!!aValeur);
						aInstance.onChange();
					}
				},
			},
			getTextePublie: function () {
				const lTextePublie =
					ObjetTraduction_1.GTraductions.getValeur("actualites.Publier");
				return lTextePublie;
			},
			getClass: function () {
				return !!aInstance.donnees && !!aInstance.donnees.publie ? "Gras" : "";
			},
		});
	}
	construireAffichage() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ style: "display:flex; align-items:center; gap:0.3rem;" },
				IE.jsx.str("ie-checkbox", {
					"ie-model": "cbPublication",
					"ie-texte": "getTextePublie",
					"ie-icon": "icon_info_sondage_publier",
					"ie-class": "getClass",
				}),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"span",
						{ "ie-class": "getClass" },
						ObjetTraduction_1.GTraductions.getValeur("aPartirDu").toLowerCase(),
					),
				),
				IE.jsx.str("div", { id: this.objDateDebut.getNom() }),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"span",
						{ "ie-class": "getClass" },
						ObjetTraduction_1.GTraductions.getValeur("jusquAu").toLowerCase(),
					),
				),
				IE.jsx.str("div", { id: this.objDateFin.getNom() }),
			),
		);
	}
	initDate(aInstance, aEstDebut) {
		aInstance.setOptionsObjetCelluleDate({
			ariaLabel: aEstDebut
				? ObjetTraduction_1.GTraductions.getValeur("aPartirDu")
				: ObjetTraduction_1.GTraductions.getValeur("jusquAu"),
		});
		aInstance.setParametresFenetre(
			window.GParametres.PremierLundi,
			ObjetDate_1.GDate.getJourSuivant(window.GParametres.PremiereDate, -100),
			ObjetDate_1.GDate.getJourSuivant(window.GParametres.DerniereDate, 100),
		);
	}
	surDateDebut(aDate) {
		this.donnees.dateDebut = aDate;
		if (this.donnees.dateDebut > this.donnees.dateFin) {
			this.donnees.dateFin = this.donnees.dateDebut;
			this.objDateFin.setDonnees(this.donnees.dateFin);
		}
		this.onChange();
	}
	surDateFin(aDate) {
		this.donnees.dateFin = aDate;
		if (this.donnees.dateFin < this.donnees.dateDebut) {
			this.donnees.dateDebut = this.donnees.dateFin;
			this.objDateDebut.setDonnees(this.donnees.dateDebut);
		}
		this.onChange();
	}
	onChange() {
		this.objDateDebut.setDonnees(this.donnees.dateDebut);
		this.objDateFin.setDonnees(this.donnees.dateFin);
		if (this.Pere && this.Evenement) {
			this.callback.appel(this.donnees);
		}
	}
}
exports.ObjetPublication = ObjetPublication;
