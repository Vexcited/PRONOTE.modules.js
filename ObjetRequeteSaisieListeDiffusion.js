const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieListeDiffusion extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    aParam.liste.setSerialisateurJSON({
      methodeSerialisation: _serialiserListeDiffusion.bind(this),
    });
    this.JSON = { liste: aParam.liste };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONRapportSaisie);
  }
}
Requetes.inscrire("SaisieListeDiffusion", ObjetRequeteSaisieListeDiffusion);
function _serialiserListeDiffusion(aElement, aJSON) {
  aJSON.estPublique = aElement.estPublique;
  aJSON.listePublicEntite = aElement.listePublicEntite;
  aJSON.genresPublicEntite = aElement.genresPublicEntite;
  aJSON.listePublicIndividu = aElement.listePublicIndividu;
  if (aJSON.listePublicIndividu) {
    aJSON.listePublicIndividu.setSerialisateurJSON({ avecLibelle: false });
  }
}
module.exports = { ObjetRequeteSaisieListeDiffusion };
