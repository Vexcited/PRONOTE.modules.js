exports.ObjetFenetre_SaisieMessage = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
require("IEHtml.TextareaMax.js");
class ObjetFenetre_SaisieMessage extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idValeur = this.Nom + "_Valeur";
		this.donnees = {
			message: null,
			estPublie: null,
			messageEstModifie: false,
			estPublieEstModifie: false,
		};
		this.setOptionsFenetre({
			modale: true,
			largeur: 500,
			hauteur: 200,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.paramsFenetreSaisieMessage = {
			maxLengthSaisie: 0,
			validationSurRetourChariot: true,
			afficherZoneTexte: true,
			titreMessage: "",
			avecControlePublication: false,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			modelChampTexte: {
				getValue() {
					return aInstance.donnees.message || "";
				},
				setValue(aValue) {
					aInstance.donnees.message = aValue;
				},
				node() {
					$(this.node).on("change", function () {
						$(this).removeAttr("placeholder");
						aInstance.donnees.messageEstModifie = true;
						if (
							aInstance.paramsFenetreSaisieMessage.validationSurRetourChariot &&
							GNavigateur.isToucheRetourChariot()
						) {
							aInstance.surValidation(1);
						}
					});
				},
			},
			cbControlePublication: {
				getValue() {
					return aInstance.donnees.estPublie;
				},
				setValue(aEstPublie) {
					aInstance.donnees.estPublie = aEstPublie;
				},
				getIndeterminate() {
					return aInstance.donnees.estPublie === null;
				},
				node() {
					$(this.node).on("change", () => {
						aInstance.donnees.estPublieEstModifie = true;
					});
				},
			},
		});
	}
	composeContenu() {
		const lAttrMax =
			this.paramsFenetreSaisieMessage.maxLengthSaisie > 0
				? 'maxlength="' + this.paramsFenetreSaisieMessage.maxLengthSaisie + '"'
				: "";
		const T = [];
		T.push('<div class="flex-contain cols flex-gap full-size">');
		if (this.paramsFenetreSaisieMessage.titreMessage) {
			T.push(
				'<h4 class="regular">',
				this.paramsFenetreSaisieMessage.titreMessage,
				"</h4>",
			);
		}
		T.push('<div class="fluid-bloc full-size">');
		if (!this.paramsFenetreSaisieMessage.afficherZoneTexte) {
			T.push(
				'<input ie-model="modelChampTexte" type="text" ',
				lAttrMax,
				' id="',
				this.idValeur,
				'" class="Fenetre_Bordure Texte10 full-size m-all-none" />',
			);
		} else {
			T.push(
				'<ie-textareamax class="full-size" ie-model="modelChampTexte" ',
				lAttrMax,
				' id="',
				this.idValeur,
				'"></ie-textareamax>',
			);
		}
		T.push("</div>");
		if (this.paramsFenetreSaisieMessage.avecControlePublication) {
			T.push(
				'<ie-checkbox ie-model="cbControlePublication">',
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.PublierSurEspaceParent",
				),
				"</ie-checkbox>",
			);
		}
		T.push("</div>");
		return T.join("");
	}
	setParametresFenetreSaisieMessage(aParams) {
		Object.assign(this.paramsFenetreSaisieMessage, aParams);
	}
	setDonnees(aMessage, aEstPublie) {
		(this.donnees.messageEstModifie = false),
			(this.donnees.estPublieEstModifie = false);
		this.donnees.message = aMessage;
		this.donnees.estPublie = aEstPublie;
		const $inputValeur = $("#" + this.idValeur.escapeJQ());
		if (this.donnees.message === null) {
			$inputValeur.attr(
				"placeholder",
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.CommentairesDifferents",
				),
			);
		} else {
			$inputValeur.removeAttr("placeholder");
		}
		this.afficher();
	}
	focusSurPremierElement() {
		ObjetHtml_1.GHtml.setFocusEdit(this.idValeur);
	}
	surValidation(aGenreBouton) {
		this.fermer();
		const lDonnees = { message: "", estPublie: undefined };
		if (this.donnees.messageEstModifie) {
			lDonnees.message = this.donnees.message;
		}
		if (this.donnees.estPublieEstModifie) {
			lDonnees.estPublie = this.donnees.estPublie;
		}
		this.callback.appel(aGenreBouton, lDonnees);
	}
}
exports.ObjetFenetre_SaisieMessage = ObjetFenetre_SaisieMessage;
