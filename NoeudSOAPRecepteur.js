exports.NoeudSOAPRecepteur = void 0;
const NoeudSOAP_1 = require("NoeudSOAP");
class NoeudSOAPRecepteur extends NoeudSOAP_1.NoeudSOAP {
	constructor(aURI, aAppelDistant, aCallback) {
		const lRoles = [];
		lRoles.push(NoeudSOAP_1.EGenreRoleSOAP.recepteur);
		super(aURI, lRoles);
		this.pere = aCallback.pere;
		this.evenement = aCallback.evenement;
		this.identifiant = aCallback.identifiant;
	}
	traiterMessage(aMessageSOAP) {
		let lDonneesReponse = null;
		try {
			if (this.DescriptionAppel) {
				lDonneesReponse = this.DescriptionAppel.lireEnveloppeSoap(aMessageSOAP);
			}
		} catch (e) {
			lDonneesReponse = e;
		}
		this.declencherCallback(lDonneesReponse);
		return "";
	}
	declencherCallback(aReponse) {
		if (this.pere && this.evenement) {
			this.evenement.call(this.pere, this.identifiant, aReponse);
		}
	}
	setDescriptionAppel(aDonneesDescription) {
		this.DescriptionAppel = aDonneesDescription;
	}
}
exports.NoeudSOAPRecepteur = NoeudSOAPRecepteur;
