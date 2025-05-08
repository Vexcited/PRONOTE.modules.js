exports.NoeudSOAPEmetteur = void 0;
const NoeudSOAP_1 = require("NoeudSOAP");
class NoeudSOAPEmetteur extends NoeudSOAP_1.NoeudSOAP {
	constructor(aUri, aAppelDistant) {
		const lRoles = [];
		lRoles.push(NoeudSOAP_1.EGenreRoleSOAP.emetteur);
		super(aUri, lRoles);
		this.uriDestinaire = aAppelDistant.getUrl();
	}
	traiterMessage(aDonnees) {
		return aDonnees.construireEnveloppeSoap();
	}
}
exports.NoeudSOAPEmetteur = NoeudSOAPEmetteur;
