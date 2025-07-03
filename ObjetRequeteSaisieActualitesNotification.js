exports.ObjetRequeteSaisieActualitesNotification = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieActualitesNotification extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON.saisieActualite = aParam.saisieActualite;
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
}
exports.ObjetRequeteSaisieActualitesNotification =
	ObjetRequeteSaisieActualitesNotification;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieActualitesNotification",
	ObjetRequeteSaisieActualitesNotification,
);
