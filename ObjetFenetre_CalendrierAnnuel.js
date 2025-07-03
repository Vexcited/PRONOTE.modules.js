exports.ObjetFenetre_CalendrierAnnuel = void 0;
const AccessApp_1 = require("AccessApp");
const ObjetCalendrierAnnuel_1 = require("ObjetCalendrierAnnuel");
const ObjetFenetre_1 = require("ObjetFenetre");
class ObjetFenetre_CalendrierAnnuel extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = null;
	}
	construireInstances() {
		this.idCalendrier = this.add(ObjetCalendrierAnnuel_1.ObjetCalendrierAnnuel);
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str("div", {
				id: this.getNomInstance(this.idCalendrier),
				style: "width:100%;height:100%;",
			}),
		);
		return T.join("");
	}
	setParametres(aOptions) {
		this.getInstance(this.idCalendrier).setParametres(aOptions);
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.getInstance(this.idCalendrier).setDonnees(aDonnees);
	}
	surValidation(aNumeroBouton) {
		let lModif = false;
		if (aNumeroBouton === 1) {
			lModif = this.getInstance(this.idCalendrier).updateDonnees();
		} else {
			this.getInstance(this.idCalendrier).afficherDonnees();
		}
		this.callback.appel(aNumeroBouton, lModif);
		this.fermer();
	}
	afficherDonnees() {
		this.getInstance(this.idCalendrier).afficherDonnees();
	}
	afficherDefautCarnet(aParam, aDonneesCarnet) {
		const lParam = {
			ligneDate: false,
			numeroJour: true,
			initialeJour: true,
			hauteurLigne: "35px",
			cadreTotal: true,
		};
		$.extend(lParam, aParam);
		this.setParametres(lParam);
		this.setDonnees({
			carnet: {
				donnees: aDonneesCarnet,
				variables: ["date"],
				couleur: (0, AccessApp_1.getApp)().getCouleur().selection.fond,
				texte: { couleur: (0, AccessApp_1.getApp)().getCouleur().blanc },
				symbolImpression: "X",
			},
		});
		this.afficher();
	}
	surAfficher() {
		this.getInstance(this.idCalendrier).ajouterEvenement();
	}
}
exports.ObjetFenetre_CalendrierAnnuel = ObjetFenetre_CalendrierAnnuel;
