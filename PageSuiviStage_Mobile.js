exports.PageSuiviStage_Mobile = void 0;
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const UtilitaireFicheStage_1 = require("UtilitaireFicheStage");
class PageSuiviStage_Mobile extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.initParametres();
	}
	initParametres() {
		this.parametres = { avecEditionSuivisDeStage: false };
	}
	setParametres(aParametres) {
		$.extend(this.parametres, aParametres);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			retourPrec: {
				event: function () {
					aInstance.callback.appel();
				},
			},
		});
	}
	setDonnees(aSuivi, aStage, aParam) {
		this.suivi = aSuivi;
		this.stage = aStage;
		(this.evenements = aParam.evenements),
			(this.lieux = aParam.lieux),
			(this.controleur = {});
		this.controleur = this.getControleur(this);
		this.afficher();
	}
	construireAffichage() {
		const H = [];
		if (this.suivi) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "conteneur-FicheStage" },
					UtilitaireFicheStage_1.UtilitaireFicheStage.composeSurSuivi(
						this.suivi,
						{
							parametres: this.parametres,
							controleur: this.controleur,
							stage: this.stage,
							evenements: this.evenements,
							lieux: this.lieux,
							pere: this.Nom,
						},
					),
				),
			);
		}
		return H.join("");
	}
	actionSurValidation(aParamCallBack) {
		if (aParamCallBack) {
			this.callback.appel({ suivi: aParamCallBack.suivi, stage: this.stage });
		} else {
			this.callback.appel();
		}
	}
}
exports.PageSuiviStage_Mobile = PageSuiviStage_Mobile;
