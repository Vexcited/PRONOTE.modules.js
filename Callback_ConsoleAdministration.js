exports.Callback_ConsoleAdministration = void 0;
const Callback_AvecGestionException_1 = require("Callback_AvecGestionException");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ExceptionRiche_1 = require("ExceptionRiche");
const AccessApp_1 = require("AccessApp");
class Callback_ConsoleAdministration extends Callback_AvecGestionException_1.Callback_AvecGestionException {
	constructor(aPere, aEvenement, aEvenementSurException, aIdentifiant) {
		super(aPere, aEvenement, aEvenementSurException, aIdentifiant);
	}
	gererExceptionParDefaut(aRetour) {
		if (aRetour instanceof ExceptionRiche_1.ObjetExceptionRiche) {
			aRetour.afficherMessage();
		} else if (aRetour instanceof Error) {
			try {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: aRetour.message,
					});
			} catch (e) {
				alert(aRetour.message);
			}
		} else {
		}
	}
}
exports.Callback_ConsoleAdministration = Callback_ConsoleAdministration;
