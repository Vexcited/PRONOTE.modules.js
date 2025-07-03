exports.ObjetPreferenceAccessibilite = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIdentite_1 = require("ObjetIdentite");
const AccessApp_1 = require("AccessApp");
class ObjetPreferenceAccessibilite extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	jsxModeleCheckboxRemplacerPastillesCompetences() {
		return {
			getValue: () => {
				return this.etatUtilisateurSco.estAvecCodeCompetences();
			},
			setValue: (aValue) => {
				this.etatUtilisateurSco.setAvecCodeCompetences(aValue);
			},
		};
	}
	construireAffichage() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "champ-conteneur" },
					IE.jsx.str(
						"ie-switch",
						{
							class: "long-text",
							"ie-model":
								this.jsxModeleCheckboxRemplacerPastillesCompetences.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.RemplacerPastillesCompetences",
						),
					),
				),
			),
		);
		return H.join("");
	}
}
exports.ObjetPreferenceAccessibilite = ObjetPreferenceAccessibilite;
