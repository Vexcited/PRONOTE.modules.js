exports.InterfaceParametrageSaml_ServeurHttp = void 0;
const InterfaceParametrageSaml_1 = require("InterfaceParametrageSaml");
class InterfaceParametrageSaml_ServeurHttp extends InterfaceParametrageSaml_1.InterfaceParametrageSaml {
  constructor(...aParams) {
    super(...aParams);
  }
  estConnecterAuServeur() {
    return this.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur();
  }
  estEnService() {
    return (
      this.objetApplicationConsoles.etatServeurHttp.getEtatActif() === true
    );
  }
}
exports.InterfaceParametrageSaml_ServeurHttp =
  InterfaceParametrageSaml_ServeurHttp;
