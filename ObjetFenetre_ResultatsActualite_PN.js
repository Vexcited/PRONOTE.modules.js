exports.ObjetFenetre_ResultatsActualite_PN = void 0;
const ObjetFenetre_ResultatsActualite_1 = require("ObjetFenetre_ResultatsActualite");
const ObjetRequeteSaisieActualitesNotification_1 = require("ObjetRequeteSaisieActualitesNotification");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetRequetePageActualitesResultats_1 = require("ObjetRequetePageActualitesResultats");
const ObjetResultatsActualite_1 = require("ObjetResultatsActualite");
class ObjetFenetre_ResultatsActualite_PN extends ObjetFenetre_ResultatsActualite_1.ObjetFenetre_ResultatsActualite {
	constructor(...aParams) {
		super(...aParams);
	}
	evenementResultats(aTypeCommande, aDonnees) {
		if (
			aTypeCommande ===
			ObjetResultatsActualite_1.TypeEvenementCallback.RenvoyerNotification
		) {
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
		new ObjetRequetePageActualitesResultats_1.ObjetRequetePageActualitesResultats(
			this,
		)
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
			listeActualite: new ObjetListeElements_1.ObjetListeElements().add(
				aActualite,
			),
		};
		if (aParticipantSelectionne) {
			lOptions.avecNotificationParticipantSelection = true;
			lOptions.participantSelectionne =
				new ObjetListeElements_1.ObjetListeElements().add(
					aParticipantSelectionne,
				);
		}
		new ObjetRequeteSaisieActualitesNotification_1.ObjetRequeteSaisieActualitesNotification(
			this,
		).lancerRequete(lOptions);
	}
}
exports.ObjetFenetre_ResultatsActualite_PN = ObjetFenetre_ResultatsActualite_PN;
