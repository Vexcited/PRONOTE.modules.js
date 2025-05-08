exports.WS_Administration = void 0;
const WS_Service_1 = require("WS_Service");
const WS_ParametreAppel_1 = require("WS_ParametreAppel");
class WS_Administration {
  constructor(aParam) {
    this.service = new WS_Service_1.WS_Service();
    this.service.setNom(aParam.nom);
    this.service.setEspaceNommage(aParam.espaceNommage);
    this.service.setPrefixeSoapAction(aParam.prefixeSoapAction);
    this.service.setUrlAcces(aParam.urlAcces);
    this.service.setVersionSoap(aParam.versionSoap);
    this.ajouterPorts();
  }
  getService() {
    return this.service;
  }
  ajouterPorts() {}
  ajouterOperation(
    aPort,
    aNom,
    aTabParamIn,
    aTabParamOut,
    aTabParamExcept,
    aExceptionsNonJournalisables,
  ) {
    const lOperation = aPort.ajouterOperation();
    lOperation.setNom(aNom);
    lOperation.setParamInput(
      new WS_ParametreAppel_1.ParametreTableauNomsEtValeurs(aNom, aTabParamIn),
    );
    lOperation.setParamOutput(
      new WS_ParametreAppel_1.ParametreTableauNomsEtValeurs(
        aNom + "Response",
        aTabParamOut,
      ),
    );
    lOperation.setTabPrmExceptions(aTabParamExcept);
    lOperation.setExceptionsNonJournalisables(aExceptionsNonJournalisables);
    const lNomsParamIn = [];
    for (
      let lIndice = 0, lTaille = aTabParamIn.length;
      lIndice < lTaille;
      lIndice++
    ) {
      lNomsParamIn.push(aTabParamIn[lIndice].nom);
    }
    lOperation.setNomsParamIn(lNomsParamIn);
  }
  ajouterPortWS(aParam) {
    const lPort = this.service.ajouterPort();
    lPort.setNom(aParam.nom);
    lPort.setUrlAcces(lPort.getUrlAcces() + aParam.url);
    for (let i = 0; i < aParam.operations.length; i++) {
      const lOp = aParam.operations[i];
      this.ajouterOperation(
        lPort,
        lOp.nom,
        lOp.tabParamIN,
        lOp.tabParamOUT,
        lOp.tabParamEXCEPT,
        Boolean(lOp.exceptionsNonJournalisables),
      );
    }
  }
}
exports.WS_Administration = WS_Administration;
