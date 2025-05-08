exports.InterfaceListeEntreprises = void 0;
const InterfaceListeEntreprisesCP_1 = require("InterfaceListeEntreprisesCP");
const ObjetRequeteListeOffresStages_1 = require("ObjetRequeteListeOffresStages");
class InterfaceListeEntreprises extends InterfaceListeEntreprisesCP_1.InterfaceListeEntreprisesCP {
  constructor(...aParams) {
    super(...aParams);
    this.options = {
      avecPeriode: true,
      avecFiltrePeriode: false,
      avecPeriodeUnique: false,
    };
  }
  recupererDonnees() {
    new ObjetRequeteListeOffresStages_1.ObjetRequeteListeOffresStages(
      this,
      this._actionSurRecupererListeOffres,
    ).lancerRequete();
  }
  _actionSurRecupererListeOffres(aParam) {
    this.listeEntreprises = aParam.listeEntreprises;
    this.traiterDonnees();
  }
}
exports.InterfaceListeEntreprises = InterfaceListeEntreprises;
