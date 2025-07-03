exports.ObjetExceptionRiche = void 0;
const Exception_1 = require("Exception");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const AccessApp_1 = require("AccessApp");
class ObjetExceptionRiche extends Exception_1.ObjetException {
	constructor(aNom, aMessage) {
		super(aNom, aMessage);
	}
	afficherMessage(aCallback) {
		try {
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: this.getMessage(),
					callback: () => {
						if (aCallback && aCallback.evenement) {
							aCallback.appel();
						}
					},
				});
		} catch (e) {
			alert(this.getMessage());
		}
	}
}
exports.ObjetExceptionRiche = ObjetExceptionRiche;
