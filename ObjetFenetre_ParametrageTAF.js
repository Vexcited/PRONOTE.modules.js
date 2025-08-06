exports.ObjetFenetre_ParametrageTAF = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ParametrageTAF extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.paramTaf.SaisieTAFsPreferences",
			),
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			largeur: 400,
		});
		this.duree = this.appSco.parametresUtilisateur.get("CDT.TAF.Duree");
	}
	jsxModeleCheckboxMiseEnForme() {
		return {
			getValue: () => {
				return this.appSco.parametresUtilisateur.get(
					"CDT.TAF.ActiverMiseEnForme",
				);
			},
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.TAF.ActiverMiseEnForme",
					aValue,
				);
			},
		};
	}
	jsxModeleRadioDuree(aEstAucune) {
		return {
			getValue: () => {
				return aEstAucune ? this.duree === 0 : this.duree > 0;
			},
			setValue: (aValue) => {
				if (aEstAucune) {
					this.duree = 0;
				} else {
					if (!this.duree) {
						this.duree = ObjetFenetre_ParametrageTAF.cDureeDefaut;
					}
				}
				this.appSco.parametresUtilisateur.set("CDT.TAF.Duree", this.duree);
			},
			getName: () => {
				return `${this.Nom}_Duree`;
			},
		};
	}
	jsxModeleInputDuree() {
		let lValueInput = this.duree;
		return {
			getValue: () => {
				return (
					lValueInput || ObjetFenetre_ParametrageTAF.cDureeDefaut
				).toString();
			},
			setValue: (aValue) => {
				lValueInput = parseInt(aValue);
			},
			exitChange: () => {
				this.duree = lValueInput;
				this.appSco.parametresUtilisateur.set("CDT.TAF.Duree", this.duree);
			},
			getDisabled: () => {
				return this.duree === 0;
			},
		};
	}
	jsxGetStyleSpanMinutes() {
		return {
			color: this.duree === 0 ? GCouleur.nonEditable.texte : GCouleur.noir,
		};
	}
	jsxComboModelNiveau() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.paramTaf.NiveauDifficulteParDef",
					),
				});
			},
			getDonnees: (aListe) => {
				if (aListe) {
					return;
				}
				if (!this.listeNiveaux) {
					this.listeNiveaux =
						TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.toListe();
				}
				return this.listeNiveaux;
			},
			getIndiceSelection: () => {
				return this.appSco.parametresUtilisateur.get(
					"CDT.TAF.NiveauDifficulte",
				);
			},
			event: (aParams) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.element
				) {
					this.appSco.parametresUtilisateur.set(
						"CDT.TAF.NiveauDifficulte",
						aParams.element.getGenre(),
					);
				}
			},
		};
	}
	jsxCbEleveDetache() {
		return {
			getValue: () =>
				this.appSco.parametresUtilisateur.get(
					"CDT.TAF.AffecterParDefautElevesDetaches",
				),
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.TAF.AffecterParDefautElevesDetaches",
					aValue,
				);
			},
			getDisabled: () => this.appSco.getModeExclusif(),
		};
	}
	composeContenu() {
		const lLargeurLibelle = 160;
		const lIdLegend = GUID_1.GUID.getId();
		const lIdMinutes = GUID_1.GUID.getId();
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
						{ "ie-model": this.jsxModeleCheckboxMiseEnForme.bind(this) },
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.paramTaf.ActiverMiseEnForme",
						),
					),
				),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "long-text",
							"ie-model": this.jsxCbEleveDetache.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.paramTaf.AffecterElevesDetaches",
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						role: "group",
						class: "EspaceHaut NoWrap",
						"aria-labelledby": lIdLegend,
					},
					IE.jsx.str(
						"div",
						{
							id: lIdLegend,
							class: "InlineBlock AlignementMilieuVertical",
							style: ObjetStyle_1.GStyle.composeWidth(lLargeurLibelle),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.paramTaf.DureeEstimeeParDef",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "InlineBlock AlignementMilieuVertical PetitEspaceDroit" },
						IE.jsx.str(
							"ie-radio",
							{ "ie-model": this.jsxModeleRadioDuree.bind(this, false) },
							IE.jsx.str("input", {
								"aria-labelledby": lIdMinutes,
								"ie-model": this.jsxModeleInputDuree.bind(this),
								"ie-mask": "/[^0-9]/i",
								maxlength: "10",
								class: "CelluleTexte",
								style: ObjetStyle_1.GStyle.composeWidth(40),
							}),
							IE.jsx.str(
								"span",
								{
									id: lIdMinutes,
									class: "EspaceGauche",
									"ie-style": this.jsxGetStyleSpanMinutes.bind(this),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.paramTaf.DureeMinutes",
								),
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "InlineBlock AlignementMilieuVertical EspaceGauche" },
						IE.jsx.str(
							"ie-radio",
							{ "ie-model": this.jsxModeleRadioDuree.bind(this, true) },
							ObjetTraduction_1.GTraductions.getValeur("Aucune"),
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "EspaceHaut NoWrap" },
					IE.jsx.str(
						"div",
						{
							class: "InlineBlock AlignementMilieuVertical",
							style: ObjetStyle_1.GStyle.composeWidth(lLargeurLibelle),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.paramTaf.NiveauDifficulteParDef",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "InlineBlock AlignementMilieuVertical" },
						IE.jsx.str("ie-combo", {
							"ie-model": this.jsxComboModelNiveau.bind(this),
						}),
					),
				),
			),
		);
		return H.join("");
	}
}
exports.ObjetFenetre_ParametrageTAF = ObjetFenetre_ParametrageTAF;
ObjetFenetre_ParametrageTAF.cDureeDefaut = 15;
