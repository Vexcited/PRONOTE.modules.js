exports.ObjetFenetre_PostIt = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
class ObjetFenetre_PostIt extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idtextarea = GUID_1.GUID.getId();
		this.postIt = "";
		this.label = "";
		this.setOptionsFenetre({
			avecTailleSelonContenu: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			label: {
				avec() {
					return !!aInstance.label;
				},
				getLabel() {
					return aInstance.label;
				},
			},
			textPostIt: {
				getValue() {
					return aInstance.postIt ? aInstance.postIt : "";
				},
				setValue(aValeur) {
					aInstance.postIt = aValeur;
				},
			},
		});
	}
	setDonnees(aDonnees) {
		this.postIt = aDonnees.texte || "";
		this.label = aDonnees.label || "";
		this.taillePostIt = aDonnees.taillePostIt || 10000;
		this.afficher(this.composeContenu());
	}
	composeContenu() {
		if (!this.taillePostIt) {
			return;
		}
		const H = [];
		H.push(
			`<label ie-if="label.avec" ie-html="label.getLabel" for="${this.idtextarea}"></label>`,
		);
		H.push(
			`<ie-textareamax id="${this.idtextarea}" ie-model="textPostIt" maxlength="${this.taillePostIt}" class="full-width ${!IE.estMobile ? "full-height" : ""}"></ie-textareamax>`,
		);
		return H.join("");
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			this.callback.appel(this.postIt);
		}
		this.fermer();
	}
}
exports.ObjetFenetre_PostIt = ObjetFenetre_PostIt;
