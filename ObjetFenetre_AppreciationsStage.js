exports.ObjetFenetre_AppreciationsStage = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
class ObjetFenetre_AppreciationsStage extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheStage.appreciations",
			),
			largeur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	jsxModeleTextareaAppreciation(aAppreciation) {
		return {
			getValue: () => {
				return !!aAppreciation ? aAppreciation.appreciation : "";
			},
			setValue: (aValue) => {
				if (!!aAppreciation) {
					aAppreciation.appreciation = aValue;
				}
			},
		};
	}
	composeContenu() {
		if (!this.donnees) {
			return "";
		}
		const lHTML = [];
		const lAttributTxtArea = IE.estMobile
			? {
					"ie-autoresize": true,
					style: "max-height: 11rem;height: 100%;overflow:auto;",
					class: "m-top-l",
				}
			: {
					"ie-autoresize": true,
					style: "width: 100%;min-height: 4rem;max-height: 11rem;height: 100%;",
					class: "Gras",
				};
		this.donnees.parcourir((aAppreciation) => {
			if (aAppreciation.avecEditionAppreciation) {
				lHTML.push(
					IE.jsx.str(
						"div",
						{ class: "field-contain label-up" },
						IE.jsx.str("label", null, aAppreciation.getLibelle()),
						IE.jsx.str(
							"ie-textareamax",
							Object.assign(
								{
									"aria-label": ObjetChaine_1.GChaine.toTitle(
										aAppreciation.getLibelle(),
									),
									"ie-model": this.jsxModeleTextareaAppreciation.bind(
										this,
										aAppreciation,
									),
								},
								lAttributTxtArea,
							),
							" ",
							aAppreciation.appreciation,
						),
					),
				);
			}
		});
		return lHTML.join("");
	}
	setDonnees(aDonnees) {
		this.donnees = MethodesObjet_1.MethodesObjet.dupliquer(aDonnees);
		this.afficher(this.composeContenu());
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this.donnees);
	}
}
exports.ObjetFenetre_AppreciationsStage = ObjetFenetre_AppreciationsStage;
