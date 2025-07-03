exports.ObjetFenetre_ParamRecapDevoirRendu = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_ParamRecapDevoirRendu extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this._optionsAffichage = {
			aucunRendu: true,
			avecRendu: true,
			avecDepot: true,
			qcm: true,
		};
	}
	jsxModelCheckboxAfficherAucunRendu() {
		return {
			getValue: () => {
				return this._optionsAffichage.aucunRendu;
			},
			setValue: (aValue) => {
				this._optionsAffichage.aucunRendu = aValue;
			},
		};
	}
	jsxModelCheckboxAfficherAvecRendu() {
		return {
			getValue: () => {
				return this._optionsAffichage.avecRendu;
			},
			setValue: (aValue) => {
				this._optionsAffichage.avecRendu = aValue;
			},
		};
	}
	jsxModelCheckboxAfficherAvecDepot() {
		return {
			getValue: () => {
				return this._optionsAffichage.avecDepot;
			},
			setValue: (aValue) => {
				this._optionsAffichage.avecDepot = aValue;
			},
		};
	}
	jsxModelCheckboxAfficherQCM() {
		return {
			getValue: () => {
				return this._optionsAffichage.qcm;
			},
			setValue: (aValue) => {
				this._optionsAffichage.qcm = aValue;
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
					{ class: "EspaceBas" },
					ObjetTraduction_1.GTraductions.getValeur(
						"RecapDevoirRendu.fenetreOptions.libelleConsigne",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "EspaceHaut" },
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "AlignementMilieuVertical",
							"ie-model": this.jsxModelCheckboxAfficherQCM.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.fenetreOptions.avecQCM",
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
							"ie-model": this.jsxModelCheckboxAfficherAvecDepot.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.fenetreOptions.avecDepot",
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
							"ie-model": this.jsxModelCheckboxAfficherAvecRendu.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.fenetreOptions.avecRendu",
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
							"ie-model": this.jsxModelCheckboxAfficherAucunRendu.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"RecapDevoirRendu.fenetreOptions.avecSansRendu",
						),
					),
				),
			),
		);
		return T.join("");
	}
	setDonnees(aDonnees) {
		this._optionsAffichage = Object.assign({}, aDonnees);
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this._optionsAffichage);
	}
}
exports.ObjetFenetre_ParamRecapDevoirRendu = ObjetFenetre_ParamRecapDevoirRendu;
