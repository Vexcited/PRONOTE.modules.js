const {
  ObjetFenetre_ResultatsActualite,
} = require("ObjetFenetre_ResultatsActualite.js");
const {
  ObjetRequeteSaisieActualitesNotification,
} = require("ObjetRequeteSaisieActualitesNotification.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
  ObjetRequetePageActualitesResultats,
} = require("ObjetRequetePageActualitesResultats.js");
const { TypeEvenementCallback } = require("ObjetResultatsActualite.js");
class ObjetFenetre_ResultatsActualite_PN extends ObjetFenetre_ResultatsActualite {
  constructor(...aParams) {
    super(...aParams);
  }
  evenementResultats(aTypeCommande, aDonnees) {
    if (aTypeCommande === TypeEvenementCallback.RenvoyerNotification) {
      this._requeteNotification(
        aDonnees.actualite,
        aDonnees.participantSelectionne,
      );
    } else {
      super.evenementResultats(aTypeCommande, aDonnees);
    }
  }
  initResultats(aInstance) {
    super.initResultats(aInstance);
    aInstance.setOptions({
      avecNotificationRelance: true,
      avecSeparationNomPrenom: true,
    });
  }
  lancerRequeteRecupererResultatsActualite(aDonneesRequete, aCallback) {
    new ObjetRequetePageActualitesResultats(this)
      .lancerRequete({
        actualite: aDonneesRequete.actualite,
        avecCumulClasses: aDonneesRequete.avecCumulClasses,
      })
      .then((aActualiteAvecResultats) => {
        aCallback(aActualiteAvecResultats);
      });
  }
  _requeteNotification(aActualite, aParticipantSelectionne) {
    const lOptions = {
      saisieActualite: true,
      listeActualite: new ObjetListeElements().add(aActualite),
    };
    if (aParticipantSelectionne) {
      lOptions.avecNotificationParticipantSelection = true;
      lOptions.participantSelectionne = new ObjetListeElements().add(
        aParticipantSelectionne,
      );
    }
    new ObjetRequeteSaisieActualitesNotification(this).lancerRequete(lOptions);
  }
}
module.exports = { ObjetFenetre_ResultatsActualite_PN };
