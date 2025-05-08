const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetRequeteSaisieMotifs extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.param = {};
    Object.assign(this.param, aParam);
    this.JSON.avecAucunMotif = aParam.avecAucunMotif;
    aParam.motifs.setSerialisateurJSON({
      methodeSerialisation: _serialiser_Motifs.bind(this),
    });
    this.JSON.motifs = aParam.motifs;
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.listeMotifsCree =
      this.JSONRapportSaisie && this.JSONRapportSaisie.motifsCree
        ? this.JSONRapportSaisie.motifsCree
        : new ObjetListeElements();
    const lListeMotifs =
      this.JSONReponse && this.JSONReponse.motifs
        ? this.JSONReponse.motifs
        : new ObjetListeElements();
    lListeMotifs.setTri([
      ObjetTri.init((D) => {
        return !D.ssMotif;
      }, ObjetTri.init("Libelle")),
    ]);
    lListeMotifs.trier();
    const lListeMotifsSelect = lListeMotifs.getListeElements(
      _getElementsSelectionnes.bind(this),
    );
    this.callbackReussite.appel(lListeMotifsSelect, lListeMotifs);
  }
}
Requetes.inscrire("SaisieMotifs", ObjetRequeteSaisieMotifs);
function _serialiser_Motifs(aMotif, aJSON) {
  if (aMotif.sousCategorieDossier) {
    aJSON.sousCategorieDossier = aMotif.sousCategorieDossier.toJSON();
  }
}
function _getElementsSelectionnes(aElement) {
  let lResult = false;
  const lElmCree = this.listeMotifsCree.getElementParNumero(
    aElement.getNumero(),
  );
  if (
    (!!lElmCree &&
      !!this.param.selection.getElementParNumero(lElmCree.nrOrigin)) ||
    (!lElmCree &&
      !!this.param.selection.getElementParNumero(aElement.getNumero()))
  ) {
    lResult = true;
  }
  return lResult;
}
module.exports = { ObjetRequeteSaisieMotifs };
