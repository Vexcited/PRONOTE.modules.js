exports.ObjetFenetre_ParamSaisieNotes = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_ParamSaisieNotes extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.afficherProjetsAccompagnement = false;
		this.afficherMoyenneBrute = false;
	}
	jsxModelCheckboxAfficherProjetsAccompagnement() {
		return {
			getValue: () => {
				return this.afficherProjetsAccompagnement;
			},
			setValue: (aValue) => {
				this.afficherProjetsAccompagnement = aValue;
			},
		};
	}
	jsxModelCheckboxAfficherMoyenneBrute() {
		return {
			getValue: () => {
				return this.afficherMoyenneBrute;
			},
			setValue: (aValue) => {
				this.afficherMoyenneBrute = aValue;
			},
		};
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "Espace" },
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "AlignementMilieuVertical",
							"ie-model":
								this.jsxModelCheckboxAfficherProjetsAccompagnement.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"Notes.FenetreParametrageAffichage.AfficherProjetsAccompagnement",
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "EspaceHaut" },
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "AlignementMilieuVertical",
							"ie-model": this.jsxModelCheckboxAfficherMoyenneBrute.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"Notes.FenetreParametrageAffichage.AfficherMoyenneBrute",
						),
					),
				),
			),
		);
		return T.join("");
	}
	setDonnees(aDonnees) {
		this.afficherProjetsAccompagnement = aDonnees.afficherProjetsAccompagnement;
		this.afficherMoyenneBrute = aDonnees.afficherMoyenneBrute;
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, {
			afficherProjetsAccompagnement: this.afficherProjetsAccompagnement,
			afficherMoyenneBrute: this.afficherMoyenneBrute,
		});
	}
}
exports.ObjetFenetre_ParamSaisieNotes = ObjetFenetre_ParamSaisieNotes;
