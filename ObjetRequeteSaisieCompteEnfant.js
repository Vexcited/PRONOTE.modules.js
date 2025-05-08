const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieCompteEnfant extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    $.extend(this.JSON, aParams);
    if (!!aParams.informationsMedicales) {
      this.JSON.informationsMedicales =
        aParams.informationsMedicales.toJSONAll();
    }
    if (!!aParams.allergies && !!aParams.allergies.listeAllergenes) {
      this.JSON.listeAllergenes = aParams.allergies.listeAllergenes;
      aParams.allergies.listeAllergenes.setSerialisateurJSON({
        methodeSerialisation: _ajouterActif,
        ignorerEtatsElements: true,
      });
      this.JSON.autoriseConsultationAllergies =
        aParams.allergies.autoriseConsultationAllergies;
    }
    if (!!aParams.restrictionsAlimentaires) {
      this.JSON.restrictionsAlimentaires.setSerialisateurJSON({
        methodeSerialisation: _ajouterActif,
      });
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire("SaisieCompteEnfant", ObjetRequeteSaisieCompteEnfant);
function _ajouterActif(aElement, aJSON) {
  aJSON.Actif = aElement.Actif;
}
module.exports = { ObjetRequeteSaisieCompteEnfant };
