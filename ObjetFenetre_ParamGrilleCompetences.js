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
	jsxDisplayCoefficients() {
		return this.avecGestionCoefficients;
	}
	jsxModelCheckboxAfficherNbEvaluations() {
		return {
			getValue: () => {
				return this.avecAffichageNbEvaluations;
			},
			setValue: (aValue) => {
				this.avecAffichageNbEvaluations = aValue;
			},
		};
	}
	jsxModelCheckboxGererSousItems() {
		return {
			getValue: () => {
				return !!this.referentielAvecSousItem;
			},
			setValue: (aValue) => {
				this.referentielAvecSousItem = aValue;
				if (!aValue) {
					this.referentielAvecCoeffSousItem = false;
				}
			},
		};
	}
	jsxModelCheckboxCoefficientElementPilier() {
		return {
			getValue: () => {
				return !!this.referentielAvecCoeffElementPilier;
			},
			setValue: (aValue) => {
				this.referentielAvecCoeffElementPilier = aValue;
			},
		};
	}
	jsxModelCheckboxCoefficientCompetence() {
		return {
			getValue: () => {
				return !!this.referentielAvecCoeffCompetence;
			},
			setValue: (aValue) => {
				this.referentielAvecCoeffCompetence = aValue;
			},
		};
	}
	jsxModelCheckboxCoefficientSousItem() {
		return {
			getValue: () => {
				return !!this.referentielAvecCoeffSousItem;
			},
			setValue: (aValue) => {
				this.referentielAvecCoeffSousItem = aValue;
			},
			getDisabled: () => {
				return !this.referentielAvecSousItem;
			},
		};
	}
	composeContenu() {
		const H = [];
		H.push(
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
							"ie-model": this.jsxModelCheckboxGererSousItems.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"competencesGrilles.FenetreParametrage.GererSousItems",
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "GrandEspaceHaut" },
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "AlignementMilieuVertical",
							"ie-model": this.jsxModelCheckboxAfficherNbEvaluations.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"competencesGrilles.FenetreParametrage.AfficherNbEvaluations",
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "GrandEspaceHaut",
						"ie-display": this.jsxDisplayCoefficients.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"competencesGrilles.FenetreParametrage.GererCoefficients",
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "EspaceGauche10",
						"ie-display": this.jsxDisplayCoefficients.bind(this),
					},
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{
								class: "AlignementMilieuVertical",
								"ie-model":
									this.jsxModelCheckboxCoefficientElementPilier.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"competencesGrilles.FenetreParametrage.CoefficientElmPilier",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{
								class: "AlignementMilieuVertical",
								"ie-model":
									this.jsxModelCheckboxCoefficientCompetence.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"competencesGrilles.FenetreParametrage.CoefficientCompetence",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{
								class: "AlignementMilieuVertical",
								"ie-model": this.jsxModelCheckboxCoefficientSousItem.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"competencesGrilles.FenetreParametrage.CoefficientSousItem",
							),
						),
					),
				),
			),
		);
		return H.join("");
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
