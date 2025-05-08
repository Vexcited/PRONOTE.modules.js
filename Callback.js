exports.Callback = void 0;
class Callback {
	constructor(aPere, aEvenement, aIdentifiant) {
		this.pere = aPere;
		this.evenement = aEvenement;
		this.identifiant = aIdentifiant;
	}
	appel(...aParams) {
		if (this.pere && this.evenement) {
			return this.evenement.call(this.pere, ...aParams);
		}
	}
}
exports.Callback = Callback;
