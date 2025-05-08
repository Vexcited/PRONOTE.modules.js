const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { SerialiserQCM_PN } = require("SerialiserQCM_PN.js");
class ObjetRequeteSaisieQCM extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aListeQCM) {
    aListeQCM.setSerialisateurJSON({
      methodeSerialisation: _serialisation.bind(this),
      nePasTrierPourValidation: true,
    });
    this.JSON = { listeQCM: aListeQCM };
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieQCM", ObjetRequeteSaisieQCM);
function _serialisation(aElement, aJSON, aIndice) {
  aJSON.Ordre = aIndice + 1;
  const lJSON = aElement.toJSON();
  let lGarderQCM;
  switch (aElement.getGenre()) {
    case EGenreRessource.ExecutionQCM:
      lGarderQCM = new SerialiserQCM_PN().executionQCM(aElement, lJSON);
      break;
    case EGenreRessource.QCM:
      lGarderQCM = new SerialiserQCM_PN().qcm(aElement, lJSON);
      break;
    default:
      break;
  }
  $.extend(true, aJSON, lJSON);
  return lGarderQCM;
}
module.exports = { ObjetRequeteSaisieQCM };
