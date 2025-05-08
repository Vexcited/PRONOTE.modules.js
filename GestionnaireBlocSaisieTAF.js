const { GestionnaireBlocDeBase } = require("GestionnaireBloc.js");
const { ObjetBlocSaisieTAF } = require("ObjetBlocSaisieTAF.js");
const { Identite } = require("ObjetIdentite.js");
const { BlocCard } = require("BlocCard.js");
class GestionnaireBlocSaisieTAF extends GestionnaireBlocDeBase {
  constructor(...aParams) {
    super(...aParams);
  }
  composeBloc(aDataBloc) {
    const lInstance = this.getInstanceObjetMetier(
      aDataBloc,
      ObjetBlocSaisieTAF,
    );
    return {
      html: this.composeZoneInstance(lInstance),
      controleur: lInstance.controleur,
    };
  }
  composeBlocMsg(aMsg) {
    const lBloc = Identite.creerInstance(BlocCard, { pere: this });
    return { html: lBloc.composeHtmlMsg(aMsg) };
  }
}
module.exports = { GestionnaireBlocSaisieTAF };
