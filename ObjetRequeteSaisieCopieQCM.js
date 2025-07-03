exports.ObjetRequeteSaisieCopieQCM = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieCopieQCM extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		if (aParam.QCM) {
			aParam.QCM.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		this.JSON = aParam;
		if (!!this.JSON.questions) {
			this.JSON.questions.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lRapport = {};
		if (!!this.JSONRapportSaisie) {
			if (this.JSONRapportSaisie.nbAjout !== undefined) {
				lRapport.nbImportes = this.JSONRapportSaisie.nbAjout;
			}
		}
		this.callbackReussite.appel(lRapport);
	}
}
exports.ObjetRequeteSaisieCopieQCM = ObjetRequeteSaisieCopieQCM;
CollectionRequetes_1.Requetes.inscrire("CopieQCM", ObjetRequeteSaisieCopieQCM);
