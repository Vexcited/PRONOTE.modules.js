exports.WS_Service = void 0;
const TableauDElements_1 = require("TableauDElements");
const WS_Port_1 = require("WS_Port");
class WS_Service {
  constructor() {
    this.nom = "";
    this.espaceNommage = "";
    this.prefixeSoapAction = "";
    this.urlAcces = "";
    this.versionSoap = "";
    this.ports = new TableauDElements_1.TableauDElements();
  }
  setNom(aNom) {
    this.nom = aNom;
  }
  setEspaceNommage(aEspaceNommage) {
    this.espaceNommage = aEspaceNommage;
  }
  setPrefixeSoapAction(aPrefixeSoapAction) {
    this.prefixeSoapAction = aPrefixeSoapAction;
  }
  setUrlAcces(aUrlAcces) {
    this.urlAcces = aUrlAcces;
  }
  setVersionSoap(aVersionSoap) {
    this.versionSoap = aVersionSoap;
  }
  getNom() {
    return this.nom;
  }
  ajouterPort(aPort) {
    const lPort = aPort
      ? aPort
      : new WS_Port_1.WS_Port(
          this.espaceNommage,
          this.prefixeSoapAction,
          this.urlAcces,
          this.versionSoap,
        );
    return this.ports.ajouterElement(lPort);
  }
  getPort(aNomPort) {
    return this.ports.getElement(aNomPort);
  }
}
exports.WS_Service = WS_Service;
