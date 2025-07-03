exports.ObjetRequeteSaisieURLSSOVoteElec = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieURLSSOVoteElec extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieURLSSOVoteElec = ObjetRequeteSaisieURLSSOVoteElec;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieURLSSOVoteElec",
	ObjetRequeteSaisieURLSSOVoteElec,
);
