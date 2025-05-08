const { GStyle } = require("ObjetStyle.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	DonneesListe_EvaluationAccueilStage,
} = require("DonneesListe_EvaluationAccueilStage.js");
const {
	TypeEtatSatisfaction,
	TypeEtatSatisfactionUtil,
} = require("TypeEtatSatisfaction.js");
const { GUID } = require("GUID.js");
class ObjetFenetre_EvaluationAccueilStage extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {
			listeQuestions: new ObjetListeElements(),
			observation: "",
			editable: false,
			typeSatisfaction: TypeEtatSatisfaction.Tes_NonEvalue,
		};
	}
	construireInstances() {
		this.identListeEvaluation = this.add(
			ObjetListe,
			null,
			this.initialiserListeEvaluation,
		);
	}
	setDonnees(aParam) {
		$.extend(this.donnees, aParam);
		this.afficher();
		this.getInstance(this.identListeEvaluation).setDonnees(
			new DonneesListe_EvaluationAccueilStage(
				this.donnees.listeQuestions,
				this.donnees.editable,
			),
		);
	}
	composeContenu() {
		const T = [];
		T.push('<div class="NoWrap EspaceBas EspaceHaut">');
		T.push(
			'<div class="Gras InlineBlock AlignementMilieuVertical EspaceDroit">',
		);
		T.push(
			GTraductions.getValeur("questionnaireStage.EvaluationAccueilStagiaire"),
		);
		T.push("</div>");
		T.push(
			'<div class="InlineBlock AlignementMilieuVertical" ie-html="imageSatisfaction"></div>',
		);
		T.push("</div>");
		T.push(
			'<div class="EspaceHaut EspaceBas" id="',
			this.getInstance(this.identListeEvaluation).getNom(),
			'"></div>',
		);
		const lIdObservation = GUID.getId();
		T.push(
			'<div id="',
			lIdObservation,
			'" class="Gras EspaceHaut">',
			GTraductions.getValeur("questionnaireStage.Observations"),
			"</div>",
		);
		T.push(
			'<div><ie-textareamax aria-labelledby="',
			lIdObservation,
			'" ie-model="observation" maxlength="1000" style="',
			GStyle.composeWidth(778),
			GStyle.composeHeight(120),
			'" ></ie-textareamax></div>',
		);
		return T.join("");
	}
	initialiserListeEvaluation(aInstance) {
		DonneesListe_EvaluationAccueilStage.init(aInstance);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			observation: {
				getValue: function () {
					return aInstance.donnees.observation
						? aInstance.donnees.observation
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.donnees.observation !== aValue) {
						aInstance.donnees.observation = aValue;
						aInstance.setEtatSaisie(true);
					}
				},
				getDisabled: function () {
					return !aInstance.donnees.editable;
				},
			},
			imageSatisfaction: function () {
				const lHtml = [];
				lHtml.push(
					'<div class="',
					TypeEtatSatisfactionUtil.getImage(aInstance.donnees.typeSatisfaction),
					'"></div>',
				);
				return lHtml.join("");
			},
		});
	}
}
module.exports = { ObjetFenetre_EvaluationAccueilStage };
