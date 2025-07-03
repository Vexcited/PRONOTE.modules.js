exports.ObjetFenetre_ParametresReleveDEvaluations = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNote_1 = require("TypeNote");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
const ObjetRequeteReleveDEvaluations_1 = require("ObjetRequeteReleveDEvaluations");
class ObjetFenetre_ParametresReleveDEvaluations extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.strMarqueurAsterisque = " (*)";
		this.typeReleveEvaluations = undefined;
		this.constantes = null;
		this.optionsAffichage = {
			avecSynthese: false,
			typeEvolution: 0,
			toleranceEvolution: 0,
			avecPourcentageAcqui: false,
			avecPositionnementLSUNiveau: false,
			avecPositionnementPrecedents: false,
			avecPositionnementLSUNote: false,
			avecNiveauMaitriseDomaine: false,
			avecAppreciations: false,
			avecSimuCalculPositionnement: false,
			avecRegroupementParDomaine: false,
			avecEvaluationsCoeffNul: false,
			avecEvaluationsHistoriques: false,
			avecProjetsAccompagnement: false,
			ordreColonnes: 0,
		};
		this.avecChangementsDonneesCalculSimu = false;
	}
	_getLibelleAsterisque() {
		let lLibelle;
		if (
			this.typeReleveEvaluations ===
			ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
				.TypeAffichage.AffichageParService
		) {
			lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.SelonDroitMaquette",
			);
		} else {
			lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.SelonOptionCalculNivAcqui",
			);
		}
		return lLibelle;
	}
	_avecAsterisqueSelonDroitMaquette() {
		return (
			this.typeReleveEvaluations ===
			ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
				.TypeAffichage.AffichageParService
		);
	}
	_getTrisPossibles() {
		const result = [];
		result.push([
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.OrdonnerParEvaluation",
			),
			this.constantes.TypesTri.ParEvaluation,
		]);
		result.push([
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.OrdonnerParDate",
			),
			this.constantes.TypesTri.ParDate,
		]);
		result.push([
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.OrdonnerParCompetence",
			),
			this.constantes.TypesTri.ParCompetence,
		]);
		if (
			this.typeReleveEvaluations ===
			ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
				.TypeAffichage.AffichageParClasse
		) {
			result.push([
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.OrdonnerParMatiere",
				),
				this.constantes.TypesTri.ParMatiere,
			]);
		}
		return result;
	}
	jsxModeleCheckboxRegroupementParDomaine() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecRegroupementParDomaine;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecRegroupementParDomaine = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecEvaluationsCoeffNul() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecEvaluationsCoeffNul;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecEvaluationsCoeffNul = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecEvaluationsHistoriques() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecEvaluationsHistoriques;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecEvaluationsHistoriques = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecProjetsAccompagnement() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecProjetsAccompagnement;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecProjetsAccompagnement = aValue;
			},
		};
	}
	_getOptionsGeneralesPossibles() {
		const result = [];
		if (
			this.typeReleveEvaluations ===
				ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
					.TypeAffichage.AffichageParService &&
			!this.etatUtilisateurSco.pourPrimaire()
		) {
			result.push([
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AvecRegroupementParDomaine",
				),
				this.jsxModeleCheckboxRegroupementParDomaine.bind(this),
			]);
		}
		result.push([
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.AvecEvaluationsCoeffNul",
			),
			this.jsxModeleCheckboxAvecEvaluationsCoeffNul.bind(this),
		]);
		if (
			this.typeReleveEvaluations ===
			ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
				.TypeAffichage.AffichageParClasse
		) {
			result.push([
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AvecEvaluationsHistoriques",
				) + this.strMarqueurAsterisque,
				this.jsxModeleCheckboxAvecEvaluationsHistoriques.bind(this),
			]);
		}
		result.push([
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.AvecProjetsAccompagnement",
			),
			this.jsxModeleCheckboxAvecProjetsAccompagnement.bind(this),
		]);
		return result;
	}
	jsxModeleCheckboxAvecSynthese() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecSynthese;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecSynthese = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecEvolution() {
		return {
			getValue: () => {
				return (
					this.optionsAffichage.typeEvolution !==
					this.constantes.TypesEvolution.Aucun
				);
			},
			setValue: (aValue) => {
				const lDataTemp = aValue
					? this.constantes.TypesEvolution.Score
					: this.constantes.TypesEvolution.Aucun;
				this.optionsAffichage.typeEvolution = lDataTemp;
			},
		};
	}
	jsxModeleCheckboxAvecPourcentageAcqui() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecPourcentageAcqui;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecPourcentageAcqui = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecPositionnementLSUNiveau() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecPositionnementLSUNiveau;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecPositionnementLSUNiveau = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecPosPeriodesPrecedentes() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecPositionnementPrecedents;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecPositionnementPrecedents = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecPositionnementLSUNote() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecPositionnementLSUNote;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecPositionnementLSUNote = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecAppreciations() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecAppreciations;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecAppreciations = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecNiveauxMaitriseDomaine() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecNiveauMaitriseDomaine;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecNiveauMaitriseDomaine = aValue;
			},
		};
	}
	jsxModeleCheckboxAvecSimuCalculPositionnement() {
		return {
			getValue: () => {
				return this.optionsAffichage.avecSimuCalculPositionnement;
			},
			setValue: (aValue) => {
				this.optionsAffichage.avecSimuCalculPositionnement = aValue;
			},
		};
	}
	_getColonnesComplementairesPossibles() {
		const result = [];
		result.push([
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.AvecSynthese",
			),
			this.jsxModeleCheckboxAvecSynthese.bind(this),
		]);
		if (
			this.typeReleveEvaluations ===
			ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
				.TypeAffichage.AffichageParClasse
		) {
			result.push([
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AvecEvolution",
				),
				this.jsxModeleCheckboxAvecEvolution.bind(this),
				"checkAvecEvolution",
			]);
		}
		result.push([
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.AvecPourcentageAcqui",
			) +
				(this._avecAsterisqueSelonDroitMaquette()
					? this.strMarqueurAsterisque
					: ""),
			this.jsxModeleCheckboxAvecPourcentageAcqui.bind(this),
		]);
		if (
			this.typeReleveEvaluations ===
			ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
				.TypeAffichage.AffichageParService
		) {
			result.push([
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AvecPosLSUNiveau",
				) + this.strMarqueurAsterisque,
				this.jsxModeleCheckboxAvecPositionnementLSUNiveau.bind(this),
			]);
			result.push([
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AvecPosPeriodesPrecedentes",
				) + this.strMarqueurAsterisque,
				this.jsxModeleCheckboxAvecPosPeriodesPrecedentes.bind(this),
			]);
			if (!this.etatUtilisateurSco.pourPrimaire()) {
				result.push([
					ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.parametres.AvecPosLSUNote",
					) + this.strMarqueurAsterisque,
					this.jsxModeleCheckboxAvecPositionnementLSUNote.bind(this),
				]);
			}
			result.push([
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AvecAppreciations",
				) + this.strMarqueurAsterisque,
				this.jsxModeleCheckboxAvecAppreciations.bind(this),
			]);
		} else {
			result.push([
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AvecNiveauMaitriseDomaine",
				),
				this.jsxModeleCheckboxAvecNiveauxMaitriseDomaine.bind(this),
			]);
		}
		result.push([
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.AvecSimulationsCalculPosLSU",
			) + this.strMarqueurAsterisque,
			this.jsxModeleCheckboxAvecSimuCalculPositionnement.bind(this),
			"checkAvecSimuCalculPositionnement",
		]);
		return result;
	}
	jsxModeleRadioTriColonne(aGenreTri) {
		return {
			getValue: () => {
				return this.optionsAffichage.ordreColonnes === aGenreTri;
			},
			setValue: (aValue) => {
				this.optionsAffichage.ordreColonnes = aGenreTri;
			},
			getName: () => {
				return `${this.Nom}_TriColonne`;
			},
		};
	}
	jsxModeleBoutonAfficherPrefCalculPositionnement() {
		return {
			event: () => {
				const lEstContexteParService =
					this.typeReleveEvaluations ===
					ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
						.TypeAffichage.AffichageParService;
				const lEstEnSaisie =
					!!this.optionsAffichage.avecSimuCalculPositionnement;
				UtilitaireCompetences_1.TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement(
					lEstContexteParService,
					{
						enLectureSeule: !lEstEnSaisie,
						callbackSurChangement: () => {
							this.avecChangementsDonneesCalculSimu = true;
						},
					},
				);
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
				);
			},
		};
	}
	jsxModeleRadioTypeEvolution(aTypeEvolution) {
		return {
			getValue: () => {
				return this.optionsAffichage.typeEvolution === aTypeEvolution;
			},
			setValue: (aValue) => {
				this.optionsAffichage.typeEvolution = aTypeEvolution;
			},
			getName: () => {
				return `${this.Nom}_TypeEvolution`;
			},
			getDisabled: () => {
				return (
					this.optionsAffichage.typeEvolution ===
					this.constantes.TypesEvolution.Aucun
				);
			},
		};
	}
	jsxModeleToleranceReussite() {
		return {
			getNote: () => {
				return new TypeNote_1.TypeNote(
					this.optionsAffichage.toleranceEvolution || 0,
				);
			},
			setNote: (aNote) => {
				this.optionsAffichage.toleranceEvolution = aNote.getValeur();
			},
			getOptionsNote: () => {
				return {
					avecVirgule: false,
					sansNotePossible: false,
					avecAnnotation: false,
					min: 0,
					max: 100,
					hintSurErreur: true,
				};
			},
			getDisabled: () => {
				return (
					this.optionsAffichage.typeEvolution !==
					this.constantes.TypesEvolution.TauxReussite
				);
			},
		};
	}
	composeContenu() {
		const T = [];
		T.push('<div class="EspaceGauche">');
		T.push(
			"<fieldset>",
			"<legend>",
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.PresenterResultats",
			),
			"</legend>",
			'<div class="GrandEspaceGauche">',
		);
		this._getTrisPossibles().forEach((D) => {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "PetitEspaceHaut" },
					IE.jsx.str(
						"ie-radio",
						{
							"ie-model": this.jsxModeleRadioTriColonne.bind(this, D[1]),
							class: "AlignementMilieuVertical PetitEspaceDroit",
						},
						D[0],
					),
				),
			);
		});
		T.push("</div>", "</fieldset>");
		T.push('<div class="EspaceHaut">');
		this._getOptionsGeneralesPossibles().forEach((D) => {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "EspaceHaut" },
					IE.jsx.str(
						"ie-checkbox",
						{ class: "AlignementMilieuVertical m-right", "ie-model": D[1] },
						D[0],
					),
				),
			);
		});
		T.push("</div>");
		T.push(
			'<div class="EspaceHaut10">',
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.ColonnesComplementaires",
			),
			"</div>",
			'<div class="GrandEspaceGauche">',
		);
		this._getColonnesComplementairesPossibles().forEach((D) => {
			T.push('<div class="EspaceHaut">');
			T.push(
				IE.jsx.str(
					"ie-checkbox",
					{ class: "AlignementMilieuVertical m-right", "ie-model": D[1] },
					D[0],
				),
			);
			if (D[2] === "checkAvecSimuCalculPositionnement") {
				T.push(
					IE.jsx.str("ie-btnicon", {
						style: "float: right;",
						"ie-model":
							this.jsxModeleBoutonAfficherPrefCalculPositionnement.bind(this),
						class: "icon_cog",
					}),
				);
			} else if (D[2] === "checkAvecEvolution") {
				T.push("</div>");
				const lIdTolerance = GUID_1.GUID.getId();
				T.push('<div class="GrandEspaceGauche">');
				T.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModeleRadioTypeEvolution.bind(
										this,
										this.constantes.TypesEvolution.TauxReussite,
									),
									class: "AlignementMilieuVertical PetitEspaceDroit",
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"releve_evaluations.parametres.Evolution.SurTauxReussite",
								),
							),
							IE.jsx.str(
								"label",
								{ for: lIdTolerance, class: "m-left" },
								ObjetTraduction_1.GTraductions.getValeur(
									"releve_evaluations.parametres.Evolution.ToleranceTxReussite",
								),
							),
							IE.jsx.str("ie-inputnote", {
								id: lIdTolerance,
								"ie-model": this.jsxModeleToleranceReussite.bind(this),
								style: "width:30px;",
								class: "m-left",
							}),
						),
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModeleRadioTypeEvolution.bind(
										this,
										this.constantes.TypesEvolution.Score,
									),
									class: "AlignementMilieuVertical PetitEspaceDroit",
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"releve_evaluations.parametres.Evolution.SurScore",
								),
							),
						),
					),
				);
			}
			T.push("</div>");
		});
		T.push(" </div>", "</div>");
		T.push("</div>");
		T.push(
			'<div class="Espace Italique">',
			this._getLibelleAsterisque(),
			"</div>",
		);
		return T.join("");
	}
	setParametres(aTypeReleveEvaluations, aConstantes) {
		this.typeReleveEvaluations = aTypeReleveEvaluations;
		this.constantes = aConstantes;
	}
	setOptionsAffichage(aOptionsAffichage) {
		Object.assign(this.optionsAffichage, aOptionsAffichage);
		this.avecChangementsDonneesCalculSimu = false;
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		if (aNumeroBouton === 1 || this.avecChangementsDonneesCalculSimu) {
			this.callback.appel(
				this.optionsAffichage,
				this.avecChangementsDonneesCalculSimu,
			);
		}
	}
}
exports.ObjetFenetre_ParametresReleveDEvaluations =
	ObjetFenetre_ParametresReleveDEvaluations;
