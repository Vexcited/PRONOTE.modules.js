const { GestionnaireBlocDeBase } = require("GestionnaireBloc.js");
const { ObjetVignetteMediatheque } = require("ObjetVignetteMediatheque.js");
class GestionnaireBlocVignettesMediatheque extends GestionnaireBlocDeBase {
  constructor(...aParams) {
    super(...aParams);
  }
  composeBloc(aDataBloc) {
    const lInstance = this.getInstanceObjetMetier(
      aDataBloc,
      ObjetVignetteMediatheque,
    );
    return {
      html: this.composeZoneInstance(lInstance),
      controleur: lInstance.controleur,
    };
  }
}
module.exports = { GestionnaireBlocVignettesMediatheque };
