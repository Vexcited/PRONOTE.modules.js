const { ObjetCalendrier } = require("ObjetCalendrier.js");
const { ObjetListe } = require("ObjetListe.js");
const { InterfacePage } = require("InterfacePage.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
class InterfacePageEtablissement extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.selectionEvaluation = {};
  }
  construireInstances() {
    this.identCalendrier = this.add(
      ObjetCalendrier,
      this.evenementSurCalendrier,
      this.initialiserCalendrier,
    );
    this.identListe = this.add(
      ObjetListe,
      this.evenementSurListe,
      this.initialiserListe,
    );
  }
  initialiserCalendrier(aInstance) {
    UtilitaireInitCalendrier.init(aInstance);
    aInstance.setControleNavigation(true);
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identListe;
    this.avecBandeau = true;
  }
  recupererDonnees() {
    this.afficherPage();
  }
  afficherPage() {
    this.setEtatSaisie(false);
    this.getInstance(this.identCalendrier).setSelection(
      GEtatUtilisateur.getSemaineSelectionnee(),
    );
  }
  evenementSurCalendrier(aNumeroSemaine) {
    GEtatUtilisateur.setSemaineSelectionnee(aNumeroSemaine);
    const lDates = this.getInstance(this.identCalendrier).getDates();
    const lNavigation = {};
    lNavigation.dateDebut = lDates.dateDebut;
    lNavigation.dateFin = lDates.dateFin;
    GParametres.listeComboPeriodes.navigation = lNavigation;
    this.requetePage(lNavigation);
  }
}
module.exports = { InterfacePageEtablissement };
