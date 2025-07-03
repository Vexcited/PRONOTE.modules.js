exports.ObjetFenetre_EvaluationAccueilStage = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_EvaluationAccueilStage_1 = require("DonneesListe_EvaluationAccueilStage");
const TypeEtatSatisfaction_1 = require("TypeEtatSatisfaction");
const GUID_1 = require("GUID");
class ObjetFenetre_EvaluationAccueilStage extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {
			listeQuestions: new ObjetListeElements_1.ObjetListeElements(),
			observation: "",
			editable: false,
			typeSatisfaction:
				TypeEtatSatisfaction_1.TypeEtatSatisfaction.Tes_NonEvalue,
		};
	}
	construireInstances() {
		this.identListeEvaluation = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initialiserListeEvaluation,
		);
	}
	setDonnees(aParam) {
		$.extend(this.donnees, aParam);
		this.afficher();
		this.getInstance(this.identListeEvaluation).setDonnees(
			new DonneesListe_EvaluationAccueilStage_1.DonneesListe_EvaluationAccueilStage(
				this.donnees.listeQuestions,
				this.donnees.editable,
			),
		);
	}
	composeContenu() {
		const lIdObservation = GUID_1.GUID.getId();
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "NoWrap EspaceBas EspaceHaut" },
					IE.jsx.str(
						"div",
						{ class: "Gras InlineBlock AlignementMilieuVertical EspaceDroit" },
						ObjetTraduction_1.GTraductions.getValeur(
							"questionnaireStage.EvaluationAccueilStagiaire",
						),
					),
					IE.jsx.str("div", {
						class: "InlineBlock AlignementMilieuVertical",
						"ie-html": this.jsxGetHtmlEtatSatisfaction.bind(this),
					}),
				),
				IE.jsx.str("div", {
					class: "EspaceHaut EspaceBas",
					id: this.getNomInstance(this.identListeEvaluation),
				}),
				IE.jsx.str(
					"div",
					{ id: lIdObservation, class: "Gras EspaceHaut" },
					ObjetTraduction_1.GTraductions.getValeur(
						"questionnaireStage.Observations",
					),
				),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str("ie-textareamax", {
						"aria-labelledby": lIdObservation,
						"ie-model": this.jsxModeleTextareaObservation.bind(this),
						maxlength: "1000",
						style:
							ObjetStyle_1.GStyle.composeWidth(778) +
							ObjetStyle_1.GStyle.composeHeight(120),
					}),
				),
			),
		);
		return T.join("");
	}
	initialiserListeEvaluation(aInstance) {
		DonneesListe_EvaluationAccueilStage_1.DonneesListe_EvaluationAccueilStage.init(
			aInstance,
		);
		aInstance.setOptionsListe({
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
				"questionnaireStage.EvaluationAccueilStagiaire",
			),
		});
	}
	jsxGetHtmlEtatSatisfaction() {
		return IE.jsx.str("div", {
			class: TypeEtatSatisfaction_1.TypeEtatSatisfactionUtil.getImage(
				this.donnees.typeSatisfaction,
			),
		});
	}
	jsxModeleTextareaObservation() {
		return {
			getValue: () => {
				return this.donnees.observation ? this.donnees.observation : "";
			},
			setValue: (aValue) => {
				if (this.donnees.observation !== aValue) {
					this.donnees.observation = aValue;
					this.setEtatSaisie(true);
				}
			},
			getDisabled: () => {
				return !this.donnees.editable;
			},
		};
	}
}
exports.ObjetFenetre_EvaluationAccueilStage =
	ObjetFenetre_EvaluationAccueilStage;
