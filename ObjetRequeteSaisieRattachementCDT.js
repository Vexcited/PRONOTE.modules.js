const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieRattachementCDT extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = { numeroSemaine: aParam.numeroSemaine };
    if (aParam.cahierDeTextes) {
      this.JSON.cahierDeTextes = aParam.cahierDeTextes.toJSON();
    }
    if (aParam.cours) {
      this.JSON.cours = aParam.cours.toJSON();
    }
    if (aParam.listeCDT) {
      this.JSON.listeCDT = aParam.listeCDT;
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lParam = {};
    this.callbackReussite.appel(lParam);
  }
}
Requetes.inscrire("SaisieRattachementCDT", ObjetRequeteSaisieRattachementCDT);
module.exports = { ObjetRequeteSaisieRattachementCDT };
