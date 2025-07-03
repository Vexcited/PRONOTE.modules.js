exports.InterfaceSuiviResultatsCompetencesParent = void 0;
const _InterfaceSuiviResultatsCompetences_1 = require("_InterfaceSuiviResultatsCompetences");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class InterfaceSuiviResultatsCompetencesParent extends _InterfaceSuiviResultatsCompetences_1._InterfaceSuiviResultatsCompetences {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		super.construireInstances();
	}
	jsxComboModelSelectionPeriode() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"WAI.ListeSelectionPeriode",
					),
				});
			},
			getDonnees: (aListe) => {
				if (!aListe) {
					return this.etatUtilisateurSco.getOngletListePeriodes();
				}
				return aListe;
			},
			getIndiceSelection: () => {
				let lIndicePeriode = 0;
				const lListePeriodes = this.etatUtilisateurSco.getOngletListePeriodes();
				if (lListePeriodes) {
					const lPeriodeNavigation =
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Periode,
						);
					if (lPeriodeNavigation) {
						lIndicePeriode =
							lListePeriodes.getIndiceParElement(lPeriodeNavigation);
					}
				}
				return Math.max(lIndicePeriode, 0);
			},
			event: (aParams) => {
				if (aParams.element) {
					this.etatUtilisateurSco.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
						aParams.element,
					);
					this.afficherPage();
				}
			},
		};
	}
	getElementsAddSurZoneSelection() {
		return [
			{
				html: IE.jsx.str("ie-combo", {
					"ie-model": this.jsxComboModelSelectionPeriode.bind(this),
				}),
			},
		];
	}
	getElementsAddSurZoneParametrage() {
		return [];
	}
	getClasseConcernee() {
		const lEleve = this.getEleveConcerne();
		return lEleve ? lEleve.Classe : null;
	}
	getEleveConcerne() {
		return this.etatUtilisateurSco.getMembre();
	}
	getPeriodeConcernee() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
	}
}
exports.InterfaceSuiviResultatsCompetencesParent =
	InterfaceSuiviResultatsCompetencesParent;
