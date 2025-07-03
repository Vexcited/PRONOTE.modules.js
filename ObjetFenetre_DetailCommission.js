exports.ObjetFenetre_DetailCommission = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDetailCommission_1 = require("ObjetDetailCommission");
class ObjetFenetre_DetailCommission extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			hauteurMaxContenu: 800,
			avecScroll: true,
			largeur: 600,
			avecTailleSelonContenu: true,
			titre: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.commission"),
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	construireInstances() {
		this.identObjetDetailCommission = this.add(
			ObjetDetailCommission_1.ObjetDetailCommission,
		);
	}
	setDonnees(aDonnees) {
		this.afficher();
		this.getInstance(this.identObjetDetailCommission).setDonnees(aDonnees);
	}
	composeContenu() {
		return `<div id="${this.getNomInstance(this.identObjetDetailCommission)}" class="flex-contain flex-cols full-size"></div>`;
	}
}
exports.ObjetFenetre_DetailCommission = ObjetFenetre_DetailCommission;
