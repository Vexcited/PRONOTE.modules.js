exports.ObjetFenetre_CalendrierStagePeriode = void 0;
const ObjetCalendrierPeriode_1 = require("ObjetCalendrierPeriode");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetFenetre_CalendrierStagePeriode extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrierPeriode_1.ObjetCalendrierPeriode,
			null,
			(aInstance) => {
				aInstance.setParametres({ avecPeriodes: true });
			},
		);
	}
	composeContenu() {
		return IE.jsx.str(
			"div",
			{ class: "CalendrierPeriode" },
			IE.jsx.str("div", { id: this.getNomInstance(this.identCalendrier) }),
		);
	}
	setDonnees(aOffreStage) {
		this.donnees = {};
		this.donnees.Zones = new ObjetListeElements_1.ObjetListeElements();
		let lObjZone =
			new ObjetCalendrierPeriode_1.CalendrierPeriode.ObjetElementZoneCalendrier(
				aOffreStage.getLibelle(),
			);
		lObjZone.donnees = aOffreStage.periodes;
		lObjZone.class = ["zone-stageContexte"];
		this.donnees.Zones.add(lObjZone);
		this.getInstance(this.identCalendrier).setDonnees(this.donnees);
	}
}
exports.ObjetFenetre_CalendrierStagePeriode =
	ObjetFenetre_CalendrierStagePeriode;
