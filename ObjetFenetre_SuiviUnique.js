exports.ObjetFenetre_SuiviUnique = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfaceSuivisAbsenceRetard_1 = require("InterfaceSuivisAbsenceRetard");
class ObjetFenetre_SuiviUnique extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.etatSaisie = false;
		this.setOptionsFenetre({
			hauteur: 350,
			largeur: 760,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 0) {
						return false;
					}
					return !aInstance.etatSaisie;
				},
			},
		});
	}
	construireInstances() {
		this.identSuivi = this.add(
			InterfaceSuivisAbsenceRetard_1.InterfaceSuivisAbsenceRetard,
		);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div id="',
			this.getInstance(this.identSuivi).getNom(),
			'" style="height:100%"></div>',
		);
		return T.join("");
	}
	setDonnees(aEleve, aAbsence) {
		this.getInstance(this.identSuivi).setDonnees(aEleve, null, null, aAbsence);
		this.afficher();
		this.getInstance(this.identSuivi).surResizeInterface();
	}
	setEtatSaisie(aEtatSaisie) {
		this.etatSaisie = aEtatSaisie;
		this.$refreshSelf();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			this.getInstance(this.identSuivi).valider(() => {
				this.fermer();
				this.callback.appel();
			});
		} else {
			this.fermer();
		}
	}
}
exports.ObjetFenetre_SuiviUnique = ObjetFenetre_SuiviUnique;
