exports.InterfaceParametrageSamlSco = void 0;
const InterfaceParametrageSaml_ServeurHttp_1 = require("InterfaceParametrageSaml_ServeurHttp");
class InterfaceParametrageSamlSco extends InterfaceParametrageSaml_ServeurHttp_1.InterfaceParametrageSaml_ServeurHttp {
  constructor(...aParams) {
    super(...aParams);
    Object.assign(this.optionsSaml, {
      avecAccesInvite: false,
      largeurLibelleFenetre: 150,
    });
  }
}
exports.InterfaceParametrageSamlSco = InterfaceParametrageSamlSco;
