const {
  _InterfaceSuiviResultatsCompetences,
} = require("_InterfaceSuiviResultatsCompetences.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class InterfaceSuiviResultatsCompetencesParent extends _InterfaceSuiviResultatsCompetences {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    super.construireInstances();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      comboSelectionPeriode: {
        init(aCombo) {
          aCombo.setOptionsObjetSaisie({
            labelWAICellule: GTraductions.getValeur(
              "WAI.ListeSelectionPeriode",
            ),
          });
        },
        getDonnees(aDonnees) {
          if (!aDonnees) {
            return GEtatUtilisateur.getOngletListePeriodes();
          }
        },
        getIndiceSelection() {
          let lIndicePeriode = 0;
          const lListePeriodes = GEtatUtilisateur.getOngletListePeriodes();
          if (lListePeriodes) {
            const lPeriodeNavigation = GEtatUtilisateur.Navigation.getRessource(
              EGenreRessource.Periode,
            );
            if (lPeriodeNavigation) {
              lIndicePeriode =
                lListePeriodes.getIndiceParElement(lPeriodeNavigation);
            }
          }
          return Math.max(lIndicePeriode, 0);
        },
        event(aParametres) {
          if (aParametres.element) {
            GEtatUtilisateur.Navigation.setRessource(
              EGenreRessource.Periode,
              aParametres.element,
            );
            aInstance.afficherPage();
          }
        },
      },
    });
  }
  getElementsAddSurZoneSelection() {
    return [{ html: '<ie-combo ie-model="comboSelectionPeriode"></ie-combo>' }];
  }
  getElementsAddSurZoneParametrage() {
    return [];
  }
  getClasseConcernee() {
    const lEleve = this.getEleveConcerne();
    return lEleve ? lEleve.Classe : null;
  }
  getEleveConcerne() {
    return GEtatUtilisateur.getMembre();
  }
  getPeriodeConcernee() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
  }
}
module.exports = { InterfaceSuiviResultatsCompetencesParent };
