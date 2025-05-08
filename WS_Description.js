exports.WS_Description = void 0;
const TableauDElements_1 = require("TableauDElements");
const WS_Service_1 = require("WS_Service");
class WS_Description {
  constructor() {
    this.services = new TableauDElements_1.TableauDElements();
  }
  ajouterService(aService) {
    const lService = aService ? aService : new WS_Service_1.WS_Service();
    return this.services.ajouterElement(lService);
  }
  getService(aNomService) {
    return this.services.getElement(aNomService);
  }
  getServiceParPosition(aPos) {
    return this.services.getElementParPosition(aPos);
  }
  getNombreServices() {
    return this.services.getNbrElements();
  }
}
exports.WS_Description = WS_Description;
