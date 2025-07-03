exports.ObjetFenetre_ParametresAffListeStagiaires = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
const ObjetTraduction_2 = require("ObjetTraduction");
const TradObjetFenetre_ParametresAffListeStagiaires =
	ObjetTraduction_2.TraductionsModule.getModule(
		"ObjetFenetre_ParametresAffListeStagiaires",
		{
			InfosStagiaire: "",
			Adresse: "",
			Telephone: "",
			Email: "",
			DateNaissance: "",
			Formation: "",
			InfosEntreprise: "",
			DenominationCommerciale: "",
			CoordonneesEntreprise: "",
			ResponsableEntreprise: "",
		},
	);
class ObjetFenetre_ParametresAffListeStagiaires extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this._parametres = {
			dateNaissance: false,
			formation: false,
			adresse: false,
			telephone: false,
			email: false,
			denominationCommerciale: false,
			coordonneesEntreprise: false,
			responsableEntreprise: false,
		};
		this.setOptionsFenetre({
			avecRetaillage: false,
			largeurMin: 300,
			largeur: 300,
			hauteur: 210,
		});
	}
	setDonnees(aParametres) {
		$.extend(this._parametres, aParametres);
		this.setOptionsFenetre({
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.afficher();
	}
	composeContenu() {
		const lInfosIdentiteEleve = [];
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterIdentiteEleve,
			)
		) {
			lInfosIdentiteEleve.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxAdresse.bind(this) },
							TradObjetFenetre_ParametresAffListeStagiaires.Adresse,
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxTelephone.bind(this) },
							TradObjetFenetre_ParametresAffListeStagiaires.Telephone,
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxEmail.bind(this) },
							TradObjetFenetre_ParametresAffListeStagiaires.Email,
						),
					),
				),
			);
		}
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "Texte10 Espace" },
				this._composeTitreSection(
					TradObjetFenetre_ParametresAffListeStagiaires.InfosStagiaire,
				),
				IE.jsx.str(
					"div",
					{ class: "Texte10 EspaceBas" },
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxDateNaissance.bind(this) },
							TradObjetFenetre_ParametresAffListeStagiaires.DateNaissance,
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxFormation.bind(this) },
							TradObjetFenetre_ParametresAffListeStagiaires.Formation,
						),
					),
					lInfosIdentiteEleve.join(""),
				),
				this._composeTitreSection(
					TradObjetFenetre_ParametresAffListeStagiaires.InfosEntreprise,
					true,
				),
				IE.jsx.str(
					"div",
					{ class: "Texte10" },
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model":
									this.jsxModeleCheckboxDenominationCommerciale.bind(this),
							},
							TradObjetFenetre_ParametresAffListeStagiaires.DenominationCommerciale,
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model":
									this.jsxModeleCheckboxCoordonneesEntreprise.bind(this),
							},
							TradObjetFenetre_ParametresAffListeStagiaires.CoordonneesEntreprise,
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model":
									this.jsxModeleCheckboxResponsableEntreprise.bind(this),
							},
							TradObjetFenetre_ParametresAffListeStagiaires.ResponsableEntreprise,
						),
					),
				),
			),
		);
		return T.join("");
	}
	_composeTitreSection(aMessage, aAvecMargeHaut = false) {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: aAvecMargeHaut ? "EspaceHaut" : "" },
				IE.jsx.str("div", { class: "Texte10 Gras PetitEspaceBas" }, aMessage),
			),
		);
		return T.join("");
	}
	jsxModeleCheckboxDateNaissance() {
		return {
			getValue: () => {
				return this._parametres && this._parametres.dateNaissance
					? this._parametres.dateNaissance
					: false;
			},
			setValue: (aValue) => {
				this._parametres.dateNaissance = aValue;
			},
		};
	}
	jsxModeleCheckboxFormation() {
		return {
			getValue: () => {
				return this._parametres && this._parametres.formation
					? this._parametres.formation
					: false;
			},
			setValue: (aValue) => {
				this._parametres.formation = aValue;
			},
		};
	}
	jsxModeleCheckboxAdresse() {
		return {
			getValue: () => {
				return this._parametres && this._parametres.adresse
					? this._parametres.adresse
					: false;
			},
			setValue: (aValue) => {
				this._parametres.adresse = aValue;
			},
		};
	}
	jsxModeleCheckboxTelephone() {
		return {
			getValue: () => {
				return this._parametres && this._parametres.telephone
					? this._parametres.telephone
					: false;
			},
			setValue: (aValue) => {
				this._parametres.telephone = aValue;
			},
		};
	}
	jsxModeleCheckboxEmail() {
		return {
			getValue: () => {
				return this._parametres && this._parametres.email
					? this._parametres.email
					: false;
			},
			setValue: (aValue) => {
				this._parametres.email = aValue;
			},
		};
	}
	jsxModeleCheckboxDenominationCommerciale() {
		return {
			getValue: () => {
				return this._parametres && this._parametres.denominationCommerciale
					? this._parametres.denominationCommerciale
					: false;
			},
			setValue: (aValue) => {
				this._parametres.denominationCommerciale = aValue;
			},
		};
	}
	jsxModeleCheckboxCoordonneesEntreprise() {
		return {
			getValue: () => {
				return this._parametres && this._parametres.coordonneesEntreprise
					? this._parametres.coordonneesEntreprise
					: false;
			},
			setValue: (aValue) => {
				this._parametres.coordonneesEntreprise = aValue;
			},
		};
	}
	jsxModeleCheckboxResponsableEntreprise() {
		return {
			getValue: () => {
				return this._parametres && this._parametres.responsableEntreprise
					? this._parametres.responsableEntreprise
					: false;
			},
			setValue: (aValue) => {
				this._parametres.responsableEntreprise = aValue;
			},
		};
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this._parametres);
	}
}
exports.ObjetFenetre_ParametresAffListeStagiaires =
	ObjetFenetre_ParametresAffListeStagiaires;
