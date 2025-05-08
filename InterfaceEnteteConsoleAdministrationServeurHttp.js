exports.InterfaceEnteteConsoleAdministrationServeurHttp = void 0;
const InterfaceZoneInfosPrincipales_1 = require("InterfaceZoneInfosPrincipales");
const ObjetInterface_1 = require("ObjetInterface");
class InterfaceEnteteConsoleAdministrationServeurHttp extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identZoneInfosPrincipales = this.add(
      InterfaceZoneInfosPrincipales_1.InterfaceZoneInfosPrincipales,
      this.evenementPublication,
    );
  }
  construireStructureAffichage() {
    const H = [];
    H.push(
      '<table class="Table">',
      this.identZoneInfosPrincipales >= 0
        ? '<tr><td id="' +
            this.getInstance(this.identZoneInfosPrincipales).getNom() +
            '"></td></tr>'
        : "",
      "</table>",
    );
    return H.join("");
  }
  evenementPublication() {
    this.callback.appel();
  }
}
exports.InterfaceEnteteConsoleAdministrationServeurHttp =
  InterfaceEnteteConsoleAdministrationServeurHttp;
