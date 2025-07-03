exports.ObjetCompte_AutorisationImage = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetCompte_AutorisationImage extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
		this.param = { autoriserImage: false };
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
			return this._composeAutorisationImage();
		}
		return "";
	}
	getTitre() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"ParametresUtilisateur.DroitALImage",
		);
	}
	jsxModeleSw() {
		return {
			getValue: () => {
				return !this.param.autoriserImage;
			},
			setValue: (aValue) => {
				this.param.autoriserImage = !aValue;
				this.callback.appel({ estAutorise: !aValue });
			},
		};
	}
	_composeAutorisationImage() {
		return IE.jsx.str(
			"div",
			{ class: "NoWrap" },
			IE.jsx.str(
				"ie-switch",
				{ "ie-model": this.jsxModeleSw.bind(this) },
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.autoriserImageParents",
					[GEtatUtilisateur.getMembre().getLibelle(), GApplication.nomProduit],
				),
			),
		);
	}
}
exports.ObjetCompte_AutorisationImage = ObjetCompte_AutorisationImage;
