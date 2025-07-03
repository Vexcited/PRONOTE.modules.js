exports.ObjetCompte_AutorisationSortie = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetCompte_AutorisationSortie extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
		this.param = { sortieAutorisee: false };
	}
	setDonnees(aParam) {
		$.extend(this.param, aParam);
		this.donneesRecues = true;
		ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage(), {
			controleur: this.controleur,
		});
	}
	construireAffichage() {
		if (this.donneesRecues) {
			return this._composeAutorisationSortie();
		}
		return "";
	}
	getTitre() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"InfosEnfantPrim.autoriseSortie.titreRubrique",
		);
	}
	jsxModeleSw() {
		return {
			getValue: () => {
				return !this.param.sortieAutorisee;
			},
			setValue: (aValue) => {
				this.param.sortieAutorisee = !aValue;
				this.callback.appel({ estAutorise: !aValue });
			},
		};
	}
	_composeAutorisationSortie() {
		const H = [];
		H.push('<div class="NoWrap">');
		H.push(
			'<ie-switch ie-model="switchAutoriserSortie">',
			ObjetTraduction_1.GTraductions.getValeur(
				"InfosEnfantPrim.autoriseSortie.libelleAutorisation",
			),
			"</ie-switch>",
		);
		H.push("</div>");
		return H.join("");
	}
}
exports.ObjetCompte_AutorisationSortie = ObjetCompte_AutorisationSortie;
