exports.WS_GestionEduConnect = exports.ETypeStatutDeclaration = void 0;
const WSParametreAppel = require("WS_ParametreAppel");
var ETypeStatutDeclaration;
(function (ETypeStatutDeclaration) {
  ETypeStatutDeclaration["Sd_Inconnu"] = "Sd_Inconnu";
  ETypeStatutDeclaration["Sd_Declaree"] = "Sd_Declaree";
  ETypeStatutDeclaration["Sd_NonPilote"] = "Sd_NonPilote";
})(
  ETypeStatutDeclaration ||
    (exports.ETypeStatutDeclaration = ETypeStatutDeclaration = {}),
);
class WS_GestionEduConnect {
  getDescription() {
    return {
      nom: "PortGestionEduConnect",
      url: "GestionEduConnect",
      operations: [
        {
          nom: "CreerParametresEduConnect",
          tabParamIN: [],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "GetUrlDeServiceDeclaree",
          tabParamIN: [],
          tabParamOUT: [new WSParametreAppel.ParametreBoolean("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "DeclarerUrlDeService",
          tabParamIN: [],
          tabParamOUT: [new WSParametreAppel.ParametreString("return")],
          tabParamEXCEPT: [],
        },
      ],
    };
  }
}
exports.WS_GestionEduConnect = WS_GestionEduConnect;
