exports.ObjetWrapperCentraleNotifications_Mobile = void 0;
const ObjetCentraleNotifications_1 = require("ObjetCentraleNotifications");
const ObjetFenetre_1 = require("ObjetFenetre");
class ObjetWrapperCentraleNotifications_Mobile {
	constructor(aDonnees) {
		this.donnees = aDonnees;
	}
	ouvrir() {
		if (!this.instanceNotif) {
			this.instanceNotif = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				_ObjetFenetreNotifications_Mobile,
				{ pere: this.donnees.pere },
				{
					actionneur: this.donnees.actionneur,
					callbackApresFermer: () => {
						this.instanceNotif = null;
					},
				},
			);
			this.instanceNotif.afficher();
		} else {
			this.instanceNotif.fermer();
			this.instanceNotif = null;
		}
	}
}
exports.ObjetWrapperCentraleNotifications_Mobile =
	ObjetWrapperCentraleNotifications_Mobile;
class _ObjetFenetreNotifications_Mobile extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			fermerFenetreSurClicHorsFenetre: true,
			listeBoutons: [],
			avecCroixFermeture: false,
			themeMenuDark: true,
		});
	}
	construireInstances() {
		this.identNotif = this.add(
			ObjetCentraleNotifications_1.ObjetCentraleNotifications,
			() => {
				this.fermer();
			},
			(aInstance) => {
				aInstance.setOptions({ actionneur: this.optionsFenetre.actionneur });
			},
		);
	}
	composeContenu() {
		return IE.jsx.str("div", {
			id: this.getNomInstance(this.identNotif),
			style: "height:100%",
		});
	}
}
