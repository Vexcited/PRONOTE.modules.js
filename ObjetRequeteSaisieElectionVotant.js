exports.ObjetRequeteSaisieElectionVotant = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieElectionVotant extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON.election = aParam.election.toJSONAll();
		aParam.election.vote.setSerialisateurJSON({ ignorerEtatsElements: true });
		this.JSON.election.vote = aParam.election.vote;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieElectionVotant = ObjetRequeteSaisieElectionVotant;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieElectionVotant",
	ObjetRequeteSaisieElectionVotant,
);
