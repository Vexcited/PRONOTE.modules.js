const PageEntreprise = require("PageEntreprise.js");
const ObjetRequetePageEntreprise = require("ObjetRequetePageEntreprise.js");
const ObjetRequeteSaisieEntreprise = require("ObjetRequeteSaisieEntreprise.js");
const { InterfacePage } = require("InterfacePage.js");
const EGenreActionInfoEntreprise = { Valider: 0, Edition: 1 };
class InterfacePageEntreprise extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.indexContactCourant = 0;
  }
  construireInstances() {
    this.identPage = this.add(
      PageEntreprise,
      this.evenementEntreprise,
      this.initialiserEntreprise,
    );
  }
  initialiserEntreprise() {
    this.requeteEntreprise();
  }
  recupererDonnees() {}
  setParametresGeneraux() {
    this.avecBandeau = true;
    this.IdentZoneAlClient = this.identPage;
  }
  requeteEntreprise() {
    new ObjetRequetePageEntreprise(
      this,
      this.surReponseRequeteEntreprise,
    ).lancerRequete();
  }
  surReponseRequeteEntreprise(aEntreprise, aAutorisations) {
    this.actualiserInfoEntreprise(aEntreprise, aAutorisations);
  }
  actualiserInfoEntreprise(aEntreprise, aAutorisations) {
    this.getInstance(this.identPage).setDonnees(
      aEntreprise,
      aAutorisations,
      this.indexContactCourant,
    );
  }
  evenementEntreprise(aGenreAction, aEntreprise) {
    switch (aGenreAction) {
      case EGenreActionInfoEntreprise.Valider:
        this.evenementSaisieEntreprise(aEntreprise);
        break;
      case EGenreActionInfoEntreprise.Edition:
        break;
    }
  }
  evenementSaisieEntreprise(aEntreprise) {
    new ObjetRequeteSaisieEntreprise(
      this,
      this.surReponseRequeteSaisieEntreprise,
    ).lancerRequete(aEntreprise);
  }
  surReponseRequeteSaisieEntreprise() {
    this.requeteEntreprise();
  }
  valider() {
    this.indexContactCourant = this.getInstance(
      this.identPage,
    ).indexContactCourant;
    this.getInstance(this.identPage).surValidation();
  }
  surResizeInterface() {
    super.surResizeInterface();
    this.getInstance(this.identPage).actualiserAffichage(true);
  }
}
module.exports = { InterfacePageEntreprise };
