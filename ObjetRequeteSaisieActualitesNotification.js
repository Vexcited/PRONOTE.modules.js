const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieActualitesNotification extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.saisieActualite = aParam.saisieActualite;
    this.JSON.saisieActualite = this.saisieActualite;
    aParam.listeActualite.setSerialisateurJSON({ ignorerEtatsElements: true });
    this.JSON.listeActualites = aParam.listeActualite;
    if (aParam.avecNotificationParticipant) {
      this.JSON.avecNotificationParticipant =
        aParam.avecNotificationParticipant;
    }
    if (aParam.avecNotificationParticipantSelection) {
      this.JSON.avecNotificationParticipantSelection =
        aParam.avecNotificationParticipantSelection;
      this.JSON.participantSelectionne = aParam.participantSelectionne;
      this.JSON.participantSelectionne.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire(
  "SaisieActualitesNotification",
  ObjetRequeteSaisieActualitesNotification,
);
module.exports = { ObjetRequeteSaisieActualitesNotification };
