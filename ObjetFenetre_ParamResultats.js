exports.ObjetFenetre_ParamResultats = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ParamResultats extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.avecMediane = false;
		this.avecHaute = false;
		this.avecBasse = false;
		this.avecAbsences = false;
		this.avecCompetences = true;
		this.avecSousServices = true;
		this.uniquementSousServices = false;
		this.matieresEquivalence = false;
		this.parametresBulletin = true;
		this.masquerSansNotes = false;
		this.avecCouleurMoyenne = false;
		this.avecGestionNotation = lApplicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
		);
	}
	setContexte(aAvecDonneesItalie) {
		this.avecDonneesItalie = aAvecDonneesItalie;
	}
	jsxModelCheckboxGererNoteMediane() {
		return {
			getValue: () => {
				return !!this.avecMediane;
			},
			setValue: (aValue) => {
				this.avecMediane = aValue;
				if (!aValue) {
					this.avecMediane = false;
				}
			},
		};
	}
	jsxModelCheckboxGererNoteHaute() {
		return {
			getValue: () => {
				return !!this.avecHaute;
			},
			setValue: (aValue) => {
				this.avecHaute = aValue;
				if (!aValue) {
					this.avecHaute = false;
				}
			},
		};
	}
	jsxModelCheckboxGererNoteBasse() {
		return {
			getValue: () => {
				return !!this.avecBasse;
			},
			setValue: (aValue) => {
				this.avecBasse = aValue;
				if (!aValue) {
					this.avecBasse = false;
				}
			},
		};
	}
	composeLignesTotal() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "GrandEspaceBas" },
				IE.jsx.str(
					"fieldset",
					null,
					IE.jsx.str(
						"legend",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.options.separateurLignes",
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-checkbox",
							{
								class: "AlignementMilieuVertical",
								style: "margin-right:.4rem; margin-bottom:.4rem;",
								"ie-model": this.jsxModelCheckboxGererNoteMediane.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"resultatsClasses.options.noteMediane",
							),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-checkbox",
							{
								class: "AlignementMilieuVertical",
								style: "margin-right:.4rem; margin-bottom:.4rem;",
								"ie-model": this.jsxModelCheckboxGererNoteHaute.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"resultatsClasses.options.noteHaute",
							),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-checkbox",
							{
								class: "AlignementMilieuVertical",
								style: "margin-right:.4rem; margin-bottom:.4rem;",
								"ie-model": this.jsxModelCheckboxGererNoteBasse.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"resultatsClasses.options.noteBasse",
							),
						),
					),
				),
			),
		);
		return T.join("");
	}
	jsxModelCheckboxMasquerServicesSansNote() {
		return {
			getValue: () => {
				return !!this.masquerSansNotes;
			},
			setValue: (aValue) => {
				this.masquerSansNotes = aValue;
				if (!aValue) {
					this.masquerSansNotes = false;
				}
			},
		};
	}
	jsxModelCheckboxAfficherCouleurMoyenne() {
		return {
			getValue: () => {
				return !!this.avecCouleurMoyenne;
			},
			setValue: (aValue) => {
				this.avecCouleurMoyenne = aValue;
				if (!aValue) {
					this.avecCouleurMoyenne = false;
				}
			},
		};
	}
	jsxModelCheckboxAvecSousServices() {
		return {
			getValue: () => {
				return !!this.avecSousServices;
			},
			setValue: (aValue) => {
				this.avecSousServices = aValue;
				if (!aValue) {
					this.avecSousServices = false;
				}
			},
			getDisabled: () => {
				return this.uniquementSousServices;
			},
		};
	}
	jsxModelCheckboxAvecAbsences() {
		return {
			getValue: () => {
				return !!this.avecAbsences;
			},
			setValue: (aValue) => {
				this.avecAbsences = aValue;
				if (!aValue) {
					this.avecAbsences = false;
				}
			},
			getDisabled: () => {
				return this.uniquementSousServices;
			},
		};
	}
	composeContenu() {
		const T = [];
		T.push('<div class="Espace">');
		if (this.avecGestionNotation) {
			T.push(this.composeLignesTotal());
		}
		T.push("<fieldset>");
		T.push(
			"<legend>" +
				ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.options.separateurServices",
				) +
				"</legend>",
		);
		T.push(
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						style: "margin-right:.4rem; margin-bottom:.4rem;",
						"ie-model": this.jsxModelCheckboxAvecSousServices.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"resultatsClasses.options.sousServices",
					),
				),
			),
		);
		T.push(
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						style: "margin-right:.4rem; margin-bottom:.4rem;",
						"ie-model": this.jsxModelCheckboxAvecAbsences.bind(this),
					},
					this.avecDonneesItalie
						? ObjetTraduction_1.GTraductions.getValeur(
								"resultatsClasses.options.absences",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"resultatsClasses.options.afficherHManquees",
							),
				),
			),
		);
		T.push(
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						style: "margin-right:.4rem; margin-bottom:.4rem;",
						"ie-model": this.jsxModelCheckboxMasquerServicesSansNote.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"resultatsClasses.options.MasquerSansNotes",
					),
				),
			),
		);
		if (this.avecGestionNotation) {
			const lLibelleOptionCouleur = this.avecDonneesItalie
				? ObjetTraduction_1.GTraductions.getValeur(
						"resultatsClasses.options.AfficherRougeInferieureTroisCinquieme",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"resultatsClasses.options.AfficherRougeInferieurMoyenne",
					);
			T.push(
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "AlignementMilieuVertical",
							style: "margin-right:.4rem; margin-bottom:.4rem;",
							"ie-model":
								this.jsxModelCheckboxAfficherCouleurMoyenne.bind(this),
						},
						lLibelleOptionCouleur,
					),
				),
			);
		}
		T.push("</fieldset>");
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aDonnees) {
		this.avecDonneesItalie = aDonnees.avecDonneesItalie;
		this.avecMediane = aDonnees.avecMediane;
		this.avecHaute = aDonnees.avecHaute;
		this.avecBasse = aDonnees.avecBasse;
		this.avecAbsences = aDonnees.avecAbsences;
		this.avecCompetences = aDonnees.avecCompetences;
		this.avecSousServices = aDonnees.avecSousServices;
		this.uniquementSousServices = aDonnees.uniquementSousServices;
		this.matieresEquivalence = aDonnees.matieresEquivalence;
		this.parametresBulletin = aDonnees.parametresBulletin;
		this.masquerSansNotes = aDonnees.masquerSansNotes;
		this.avecCouleurMoyenne = aDonnees.avecCouleurMoyenne;
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, {
			avecMediane: this.avecMediane,
			avecHaute: this.avecHaute,
			avecBasse: this.avecBasse,
			avecAbsences: this.avecAbsences,
			avecCompetences: this.avecCompetences && this.matieresEquivalence,
			avecSousServices: this.avecSousServices,
			uniquementSousServices: this.uniquementSousServices,
			matieresEquivalence: false,
			parametresBulletin: true,
			masquerSansNotes: this.masquerSansNotes,
			avecCouleurMoyenne: this.avecCouleurMoyenne,
		});
	}
}
exports.ObjetFenetre_ParamResultats = ObjetFenetre_ParamResultats;
