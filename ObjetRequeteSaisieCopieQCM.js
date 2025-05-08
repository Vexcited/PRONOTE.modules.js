const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieCopieQCM extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    if (aParam.QCM) {
      aParam.QCM.setSerialisateurJSON({ ignorerEtatsElements: true });
    }
    this.JSON = aParam;
    if (!!this.JSON.questions) {
      this.JSON.questions.setSerialisateurJSON({ ignorerEtatsElements: true });
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lRapport = {};
    if (!!this.JSONRapportSaisie) {
      if (this.JSONRapportSaisie.nbAjout !== undefined) {
        lRapport.nbImportes = this.JSONRapportSaisie.nbAjout;
      }
    }
    this.callbackReussite.appel(lRapport);
  }
}
Requetes.inscrire("CopieQCM", ObjetRequeteSaisieCopieQCM);
module.exports = { ObjetRequeteSaisieCopieQCM };
