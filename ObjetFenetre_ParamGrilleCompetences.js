exports.ObjetFenetre_ParamGrilleCompetences = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeReferentielGrilleCompetence_1 = require("TypeReferentielGrilleCompetence");
class ObjetFenetre_ParamGrilleCompetences extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecAffichageNbEvaluations = false;
		this.referentielAvecSousItem = null;
		this.avecGestionCoefficients = false;
		this.referentielAvecCoeffElementPilier = null;
		this.referentielAvecCoeffCompetence = null;
		this.referentielAvecCoeffSousItem = null;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			checkAffichageNbEvaluations: {
				getValue() {
					return aInstance.avecAffichageNbEvaluations;
				},
				setValue(aData) {
					aInstance.avecAffichageNbEvaluations = aData;
				},
			},
			displayCoefficients() {
				return aInstance.avecGestionCoefficients;
			},
			checkGererSousItem: {
				getValue() {
					return !!aInstance.referentielAvecSousItem;
				},
				setValue(aData) {
					aInstance.referentielAvecSousItem = aData;
					if (!aData) {
						aInstance.referentielAvecCoeffSousItem = false;
					}
				},
			},
			checkCoeffElementPilier: {
				getValue() {
					return !!aInstance.referentielAvecCoeffElementPilier;
				},
				setValue(aData) {
					aInstance.referentielAvecCoeffElementPilier = aData;
				},
			},
			checkCoeffCompetence: {
				getValue() {
					return !!aInstance.referentielAvecCoeffCompetence;
				},
				setValue(aData) {
					aInstance.referentielAvecCoeffCompetence = aData;
				},
			},
			checkCoeffSousItem: {
				getDisabled() {
					return !aInstance.referentielAvecSousItem;
				},
				getValue() {
					return !!aInstance.referentielAvecCoeffSousItem;
				},
				setValue(aData) {
					aInstance.referentielAvecCoeffSousItem = aData;
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div class="Espace">');
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "AlignementMilieuVertical",
							"ie-model": "checkGererSousItem",
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"competencesGrilles.FenetreParametrage.GererSousItems",
						),
					),
				),
			),
		);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "GrandEspaceHaut" },
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "AlignementMilieuVertical",
							"ie-model": "checkAffichageNbEvaluations",
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"competencesGrilles.FenetreParametrage.AfficherNbEvaluations",
						),
					),
				),
			),
		);
		T.push(
			'<div class="GrandEspaceHaut" ie-display="displayCoefficients">',
			ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.FenetreParametrage.GererCoefficients",
			),
			"</div>",
		);
		T.push(
			'<div class="EspaceGauche10" ie-display="displayCoefficients">',
			'<div class="PetitEspaceHaut">',
			'<ie-checkbox class="AlignementMilieuVertical" ie-model="checkCoeffElementPilier">',
			ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.FenetreParametrage.CoefficientElmPilier",
			),
			"</ie-checkbox>",
			"</div>",
			'<div class="PetitEspaceHaut">',
			'<ie-checkbox class="AlignementMilieuVertical" ie-model="checkCoeffCompetence">',
			ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.FenetreParametrage.CoefficientCompetence",
			),
			"</ie-checkbox>",
			"</div>",
			'<div class="PetitEspaceHaut">',
			'<ie-checkbox class="AlignementMilieuVertical" ie-model="checkCoeffSousItem">',
			ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.FenetreParametrage.CoefficientSousItem",
			),
			"</ie-checkbox>",
			"</div>",
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aGenreReferentiel, aReferentiel, aOptionsAffichage) {
		this.avecAffichageNbEvaluations = aOptionsAffichage.afficherNbEvaluations;
		this.referentielAvecSousItem = aReferentiel.avecSousItems;
		this.avecGestionCoefficients =
			aGenreReferentiel ===
			TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
				.GR_PilierDeCompetence;
		this.referentielAvecCoeffElementPilier = aReferentiel.avecCoeffElmtPilier;
		this.referentielAvecCoeffCompetence = aReferentiel.avecCoeffCompetence;
		this.referentielAvecCoeffSousItem = aReferentiel.avecCoeffSousItem;
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, {
			afficherNbEvaluations: this.avecAffichageNbEvaluations,
			avecSousItem: this.referentielAvecSousItem,
			avecCoeffElementPilier: this.referentielAvecCoeffElementPilier,
			avecCoeffCompetence: this.referentielAvecCoeffCompetence,
			avecCoeffSousItem: this.referentielAvecCoeffSousItem,
		});
	}
}
exports.ObjetFenetre_ParamGrilleCompetences =
	ObjetFenetre_ParamGrilleCompetences;
