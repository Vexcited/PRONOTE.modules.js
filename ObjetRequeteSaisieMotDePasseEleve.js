exports.ObjetRequeteSaisieMotDePasseEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteSaisieMotDePasseEleve extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		this.JSON = {
			motDePasse: (0, AccessApp_1.getApp)()
				.getCommunication()
				.getChaineChiffreeAES(aParams.nouveauMDP),
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel({
			avecErreur: this.reponseEnErreur(),
			JSON: this.JSONReponse,
		});
	}
}
exports.ObjetRequeteSaisieMotDePasseEleve = ObjetRequeteSaisieMotDePasseEleve;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieMotDePasseEleve",
	ObjetRequeteSaisieMotDePasseEleve,
);
