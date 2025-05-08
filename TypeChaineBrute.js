exports.TypeChaineBrute = void 0;
const Enumere_ChampsJSON_1 = require("Enumere_ChampsJSON");
const TypeHttpVariable_1 = require("TypeHttpVariable");
class TypeChaineBrute {
  constructor(aChaineBrute) {
    this.chaineBrute = typeof aChaineBrute === "string" ? aChaineBrute : "";
  }
  toJSON() {
    const lJSON = {};
    lJSON[Enumere_ChampsJSON_1.TypeChampsJSON.type] =
      TypeHttpVariable_1.TypeHttpVariable.TypeHttpChaineBrute;
    lJSON[Enumere_ChampsJSON_1.TypeChampsJSON.valeur] = this.chaineBrute;
    return lJSON;
  }
}
exports.TypeChaineBrute = TypeChaineBrute;
