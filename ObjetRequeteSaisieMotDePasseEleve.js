const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieMotDePasseEleve extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON = {
			motDePasse: GApplication.getCommunication().getChaineChiffreeAES(
				aParams.nouveauMDP,
			),
		};
		return this.appelAsynchrone();
	}
	traiterReponseSaisieMessageErreur() {}
	actionApresRequete() {
		this.callbackReussite.appel({
			avecErreur: this.reponseEnErreur(),
			JSON: this.JSONReponse,
		});
	}
}
Requetes.inscrire("SaisieMotDePasseEleve", ObjetRequeteSaisieMotDePasseEleve);
module.exports = { ObjetRequeteSaisieMotDePasseEleve };
