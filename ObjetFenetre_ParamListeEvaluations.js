exports.ObjetFenetre_ParamListeEvaluations =
	exports.TypeAffichageTitreColonneCompetence = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
var TypeAffichageTitreColonneCompetence;
(function (TypeAffichageTitreColonneCompetence) {
	TypeAffichageTitreColonneCompetence[
		(TypeAffichageTitreColonneCompetence["AffichageLibelle"] = 0)
	] = "AffichageLibelle";
	TypeAffichageTitreColonneCompetence[
		(TypeAffichageTitreColonneCompetence["AffichageCode"] = 1)
	] = "AffichageCode";
})(
	TypeAffichageTitreColonneCompetence ||
		(exports.TypeAffichageTitreColonneCompetence =
			TypeAffichageTitreColonneCompetence =
				{}),
);
class ObjetFenetre_ParamListeEvaluations extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.avecOptionAfficherProjetsAcc = true;
		this.afficherProjetsAccompagnement = false;
		this.afficherPourcentageReussite = false;
		this.typeAffichageTitreColonneCompetence =
			TypeAffichageTitreColonneCompetence.AffichageLibelle;
		this.hintPourcentageReussite = "";
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
	jsxDisplayOptionAffProjetsAccompagnement() {
		return this.avecOptionAfficherProjetsAcc;
	}
	jsxModelCheckboxAfficherPourcentage() {
		return {
			getValue: () => {
				return this.afficherPourcentageReussite;
			},
			setValue: (aValue) => {
				this.afficherPourcentageReussite = aValue;
			},
		};
	}
	jsxDisplayAidePourcentageReussite() {
		return (
			!!this.hintPourcentageReussite && this.hintPourcentageReussite.length > 0
		);
	}
	jsxGetTitleAidePourcentage() {
		return {
			getTooltip: () => {
				return this.hintPourcentageReussite;
			},
		};
	}
	jsxModelRadioTypeAffichageTitreColonne(aTypeAffichage) {
		return {
			getValue: () => {
				return this.typeAffichageTitreColonneCompetence === aTypeAffichage;
			},
			setValue: (aValue) => {
				this.typeAffichageTitreColonneCompetence = aTypeAffichage;
			},
			getName: () => {
				return `${this.Nom}_TypeAffichageTitreColonne `;
			},
		};
	}
	composeContenu() {
		const T = [];
		T.push('<div class="Espace">');
		T.push('<fieldset class="EspaceBas10">');
		T.push(
			"<legend>",
			ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.FenetreParametrageAffichage.PersonnaliserColonnes",
			),
			"</legend>",
		);
		T.push('<div class="PetitEspaceHaut GrandEspaceGauche">');
		_getTypesAffichageTitreColonneCompetence().forEach((D) => {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "PetitEspaceHaut" },
					IE.jsx.str(
						"ie-radio",
						{
							"ie-model": this.jsxModelRadioTypeAffichageTitreColonne.bind(
								this,
								D[0],
							),
							class: "AlignementMilieuVertical PetitEspaceDroit",
						},
						D[1],
					),
				),
			);
		});
		T.push(
			IE.jsx.str(
				"div",
				{ class: "EspaceHaut" },
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						"ie-model": this.jsxModelCheckboxAfficherPourcentage.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.FenetreParametrageAffichage.AfficherPourcentageReussite",
					),
				),
				IE.jsx.str("ie-btntooltip", {
					class: "MargeGauche AlignementMilieuVertical",
					"ie-display": this.jsxDisplayAidePourcentageReussite.bind(this),
					"ie-model": this.jsxGetTitleAidePourcentage.bind(this),
				}),
			),
		);
		T.push("</div>");
		T.push("</fieldset>");
		T.push(
			IE.jsx.str(
				"div",
				{
					"ie-display":
						this.jsxDisplayOptionAffProjetsAccompagnement.bind(this),
				},
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						"ie-model":
							this.jsxModelCheckboxAfficherProjetsAccompagnement.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.FenetreParametrageAffichage.AfficherProjetsAccompagnement",
					),
				),
			),
		);
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aDonnees) {
		this.avecOptionAfficherProjetsAcc = aDonnees.avecOptionAfficherProjetsAcc;
		this.afficherProjetsAccompagnement = aDonnees.afficherProjetsAccompagnement;
		this.afficherPourcentageReussite = aDonnees.afficherPourcentageReussite;
		this.typeAffichageTitreColonneCompetence =
			aDonnees.typeAffichageTitreColonneCompetence;
		this.hintPourcentageReussite = aDonnees.hintPourcentageReussite;
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, {
			afficherProjetsAccompagnement: this.afficherProjetsAccompagnement,
			afficherPourcentageReussite: this.afficherPourcentageReussite,
			typeAffichageTitreColonneCompetence:
				this.typeAffichageTitreColonneCompetence,
		});
	}
}
exports.ObjetFenetre_ParamListeEvaluations = ObjetFenetre_ParamListeEvaluations;
function _getTypesAffichageTitreColonneCompetence() {
	const result = [];
	result.push([
		TypeAffichageTitreColonneCompetence.AffichageLibelle,
		ObjetTraduction_1.GTraductions.getValeur(
			"evaluations.FenetreParametrageAffichage.ColonnesAvecLibelleItem",
		),
	]);
	result.push([
		TypeAffichageTitreColonneCompetence.AffichageCode,
		ObjetTraduction_1.GTraductions.getValeur(
			"evaluations.FenetreParametrageAffichage.ColonnesAvecCodeItem",
		),
	]);
	return result;
}
