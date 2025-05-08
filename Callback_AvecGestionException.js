exports.Callback_AvecGestionException = void 0;
const Callback_1 = require("Callback");
const ExceptionRiche_1 = require("ExceptionRiche");
class Callback_AvecGestionException extends Callback_1.Callback {
  constructor(aPere, aEvenement, aEvenementSurException, aIdentifiant) {
    super(aPere, aEvenement, aIdentifiant);
    this.evenementSurException = aEvenementSurException;
  }
  appel(...aParams) {
    const aRetour = aParams[0];
    if (aRetour instanceof Error) {
      try {
        throw aRetour;
      } catch (e) {
        if (this.pere && this.evenementSurException) {
          return this.evenementSurException.apply(this.pere, aParams);
        } else {
          return this.gererExceptionParDefaut(aRetour);
        }
      }
    } else {
      if (this.pere && this.evenement) {
        return this.evenement.call(this.pere, ...aParams);
      }
    }
  }
  gererExceptionParDefaut(aRetour) {
    if (aRetour instanceof ExceptionRiche_1.ObjetExceptionRiche) {
      alert(aRetour.getMessage());
    } else if (aRetour instanceof Error) {
      alert(aRetour.message);
    }
  }
}
exports.Callback_AvecGestionException = Callback_AvecGestionException;
