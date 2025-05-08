exports.InterfaceRecapitulatifVS_Mobile = void 0;
const InterfaceRecapitulatifVS_1 = require("InterfaceRecapitulatifVS");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTraduction_1 = require("ObjetTraduction");
class InterfaceRecapitulatifVS_Mobile extends InterfaceRecapitulatifVS_1.InterfaceRecapitulatifVS {
  constructor(...aParams) {
    super(...aParams);
    this.etatUtilisateurScoMobile = this.applicationSco.getEtatUtilisateur();
  }
  construireInstances() {
    this.identSelection = this.add(
      ObjetSelection_1.ObjetSelection,
      this.evenementSelection,
      (aInstance) => {
        aInstance.setParametres({
          optionsCombo: {
            labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
              "WAI.ListeSelectionPeriode",
            ),
          },
        });
      },
    );
    super.construireInstances();
  }
  recupererDonnees() {
    const lOngletInfosPeriodes =
      this.etatUtilisateurScoMobile.getOngletInfosPeriodes();
    if (!this.listePeriodes) {
      this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
      const lNrPeriodeParDefaut =
        this.etatUtilisateurScoMobile.getPage() &&
        this.etatUtilisateurScoMobile.getPage().periode
          ? this.etatUtilisateurScoMobile.getPage().periode.getNumero()
          : lOngletInfosPeriodes.periodeParDefaut.getNumero();
      this.positionPeriodeCourant =
        this.listePeriodes.getIndiceParNumeroEtGenre(lNrPeriodeParDefaut);
      if (
        !this.positionPeriodeCourant ||
        (this.etatUtilisateurScoMobile.getPage() &&
          this.etatUtilisateurScoMobile.getPage().retourAccueil)
      ) {
        this.positionPeriodeCourant = 0;
      }
      this.periodeCourant = this.listePeriodes.get(this.positionPeriodeCourant);
    }
    this.getInstance(this.identSelection).setDonnees(
      this.listePeriodes,
      this.positionPeriodeCourant,
      null,
      "",
    );
    this.basculerVisibiliteSurGenreEcran(this.getCtxEcran({ niveauEcran: 0 }));
  }
  evenementSelection(aParam) {
    this.periodeCourant = aParam.element;
    this.positionPeriodeCourant = this.listePeriodes.getIndiceParElement(
      this.periodeCourant,
    );
    this.recupererDonneesRecapVS();
  }
}
exports.InterfaceRecapitulatifVS_Mobile = InterfaceRecapitulatifVS_Mobile;
