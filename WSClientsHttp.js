exports.WS_ClientsHttp = void 0;
const WSParametreAppel = require("WS_ParametreAppel");
class WS_ClientsHttp {
  getDescription() {
    return {
      nom: "PortClientsHttp",
      url: "ClientsHttp",
      operations: [
        {
          nom: "GetAutoriserAnciennesVersionsTLS",
          tabParamIN: [],
          tabParamOUT: [new WSParametreAppel.ParametreBoolean("return")],
          tabParamEXCEPT: [],
        },
        {
          nom: "SetAutoriserAnciennesVersionsTLS",
          tabParamIN: [new WSParametreAppel.ParametreBoolean("AAutoriser")],
          tabParamOUT: [],
          tabParamEXCEPT: [],
        },
      ],
    };
  }
}
exports.WS_ClientsHttp = WS_ClientsHttp;
