exports.ObjetRequeteSaisieQCMResultat = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Serialiser_QCM_1 = require("Serialiser_QCM");
class ObjetRequeteSaisieQCMResultat extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		aParam.eleves.setSerialisateurJSON({
			ignorerEtatsElements: true,
			nePasTrierPourValidation: true,
		});
		this.JSON.typeSaisieQCMResultat = aParam.typeSaisieQCMResultat;
		this.JSON.eleves = aParam.eleves;
		this.JSON.execution = aParam.execution.toJSON();
		new Serialiser_QCM_1.Serialiser_QCM().executionQCM(
			aParam.execution,
			this.JSON.execution,
		);
		this.JSON.fin = aParam.fin;
		this.JSON.debut = aParam.debut;
		this.JSON.publication = aParam.publication;
		this.JSON.garderMeilleureNote = aParam.garderMeilleureNote;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteSaisieQCMResultat = ObjetRequeteSaisieQCMResultat;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieQCMResultat",
	ObjetRequeteSaisieQCMResultat,
);
