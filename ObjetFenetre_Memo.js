exports.ObjetFenetre_Memo = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_Memo extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.memo = "";
		this.idTextArea = this.Nom + "_textarea";
		this.idDiv = this.Nom + "_div";
		this._parametres = {
			contenu: "",
			titre: ObjetTraduction_1.GTraductions.getValeur("EDT.MemoPublic"),
			callback: null,
			nonEditable: true,
			avecValidationAuto: true,
			tailleMaxSaisie: 255,
		};
		this.setOptionsFenetre({
			avecRetaillage: true,
			largeurMin: 300,
			hauteurMin: 40,
			largeur: 500,
			hauteur: 228,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			textarea: {
				getValue() {
					return aInstance._parametres.contenu;
				},
				setValue(aValue) {
					aInstance._parametres.contenu = aValue;
				},
			},
		});
	}
	setDonnees(aParametres) {
		$.extend(this._parametres, aParametres);
		const lListeBoutons = [];
		if (!this._parametres.nonEditable) {
			lListeBoutons.push(ObjetTraduction_1.GTraductions.getValeur("Annuler"));
			lListeBoutons.push(ObjetTraduction_1.GTraductions.getValeur("Valider"));
		} else {
			lListeBoutons.push(ObjetTraduction_1.GTraductions.getValeur("Fermer"));
		}
		this.setOptionsFenetre({
			titre: this._parametres.titre,
			listeBoutons: lListeBoutons,
		});
		this.afficher(this.composeContenu());
		if (!this._parametres.nonEditable) {
			ObjetHtml_1.GHtml.getElement(this.idTextArea).focus();
		}
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str("ie-textareamax", {
				"ie-model": "textarea",
				id: this.idTextArea,
				maxlength: this._parametres.tailleMaxSaisie,
				class: "Table",
				readonly: !!this._parametres.nonEditable,
				"aria-labelledby": this.IdTitre,
			}),
		);
		return H.join("");
	}
	surValidation(ANumeroBouton) {
		this.fermer();
		if (this._parametres.callback) {
			this._parametres.callback(ANumeroBouton, this._parametres.contenu);
		}
	}
}
exports.ObjetFenetre_Memo = ObjetFenetre_Memo;
