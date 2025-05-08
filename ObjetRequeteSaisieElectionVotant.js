const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieElectionVotant extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON.election = aParam.election.toJSONAll();
		aParam.election.vote.setSerialisateurJSON({ ignorerEtatsElements: true });
		this.JSON.election.vote = aParam.election.vote;
		return this.appelAsynchrone();
	}
}
Requetes.inscrire("SaisieElectionVotant", ObjetRequeteSaisieElectionVotant);
module.exports = { ObjetRequeteSaisieElectionVotant };
