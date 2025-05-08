exports.AppelMethodeDistante = void 0;
const TableauDElements_1 = require("TableauDElements");
const WS_ParametreAppel_1 = require("WS_ParametreAppel");
class AppelMethodeDistante {
  constructor(aServices, aParam) {
    const lService = aServices.getService(aParam.webService);
    const lPort = lService.getPort(aParam.port);
    this.operation = lPort.getOperation(aParam.methode);
    this.exceptionsNonJournalisables =
      this.operation.getExceptionsNonJournalisables();
    const lParametres = new TableauDElements_1.TableauDElements();
    const lNomsParamIn = this.operation.getNomsParamIn();
    for (
      let lIndice = 0, lTaille = lNomsParamIn.length;
      lIndice < lTaille;
      lIndice++
    ) {
      lParametres.ajouterElement(
        new WS_ParametreAppel_1.NomEtValeur(lNomsParamIn[lIndice]),
      );
    }
    this.parametres = lParametres;
  }
  getParametres() {
    return this.parametres;
  }
  getExceptionsNonJournalisables() {
    return this.exceptionsNonJournalisables;
  }
  getUrl() {
    return this.operation.getUrlAcces();
  }
  getNomOperation() {
    return this.operation ? this.operation.getNom() : "";
  }
  getEntetesHttp() {
    return this.operation.getEntetesHttp();
  }
  construireEnveloppeSoap() {
    return this.operation.construireEnveloppeSoap(this.parametres);
  }
  lireEnveloppeSoap(aMessageSOAP) {
    return this.operation.lireEnveloppeSoap(aMessageSOAP);
  }
}
exports.AppelMethodeDistante = AppelMethodeDistante;
