exports.ObjetFenetre_FiltrePeriodeOffresStages = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const tag_1 = require("tag");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_FiltrePeriodeOffresStages extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = null;
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"OffreStage.periodePossibleDeStage",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
	}
	construireInstances() {
		this.identDateDebut = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementDate.bind(this, true),
			this._initDate,
		);
		this.identDateFin = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementDate.bind(this, false),
			this._initDate,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnSupprimer: {
				event() {
					aInstance.surValidation(2);
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			(0, tag_1.tag)(
				"div",
				{ class: "flex-contain" },
				(0, tag_1.tag)(
					"div",
					{ class: "Gras EspaceDroit MargeHaut" },
					ObjetTraduction_1.GTraductions.getValeur("Du").ucfirst(),
				),
				(0, tag_1.tag)("div", {
					class: "EspaceDroit",
					id: this.getInstance(this.identDateDebut).getNom(),
				}),
				(0, tag_1.tag)(
					"div",
					{ class: "Gras EspaceDroit MargeHaut" },
					ObjetTraduction_1.GTraductions.getValeur("Au").ucfirst(),
				),
				(0, tag_1.tag)("div", {
					class: "EspaceDroit",
					id: this.getInstance(this.identDateFin).getNom(),
				}),
			),
		);
		return T.join("");
	}
	composeBas() {
		return (0, tag_1.tag)(
			"div",
			{ class: "compose-bas" },
			(0, tag_1.tag)("ie-btnicon", {
				"ie-model": "btnSupprimer",
				title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				class: "icon_trash avecFond i-medium",
			}),
		);
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.dateDebut = this.donnees.dateDebut
			? new Date(this.donnees.dateDebut)
			: null;
		this.dateFin = this.donnees.dateFin ? new Date(this.donnees.dateFin) : null;
		this.getInstance(this.identDateDebut).setDonnees(this.dateDebut);
		this.getInstance(this.identDateFin).setDonnees(this.dateFin);
	}
	surValidation(aNumeroBouton) {
		let lModif = false;
		if (aNumeroBouton === 1 && !!this.dateDebut && !!this.dateFin) {
			lModif = true;
		} else if (aNumeroBouton === 2) {
			this.dateDebut = null;
			this.dateFin = null;
			lModif = true;
		}
		if (lModif) {
			this.donnees.dateDebut = this.dateDebut;
			this.donnees.dateFin = this.dateFin;
			this.donnees.Actif = aNumeroBouton === 1;
		}
		this.callback.appel(aNumeroBouton, lModif);
		this.fermer();
	}
	_initDate(aInstance) {
		aInstance.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
		);
		aInstance.setOptionsObjetCelluleDate({ avecInitDateSiVide: true });
	}
	_evenementDate(aEstDateDebut, aDate) {
		if (aEstDateDebut) {
			this.dateDebut = aDate;
			if (this.dateDebut > this.dateFin) {
				this.dateFin = new Date(this.dateDebut.getTime());
				this.getInstance(this.identDateFin).setDonnees(this.dateFin);
			}
		} else {
			this.dateFin = aDate;
			if (this.dateDebut > this.dateFin) {
				this.dateDebut = new Date(this.dateFin.getTime());
				this.getInstance(this.identDateDebut).setDonnees(this.dateDebut);
			}
		}
	}
}
exports.ObjetFenetre_FiltrePeriodeOffresStages =
	ObjetFenetre_FiltrePeriodeOffresStages;
