const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteCalculAutoNotesSelonCompetences extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		$.extend(this.JSON, aParam);
		return this.appelAsynchrone();
	}
}
Requetes.inscrire(
	"CalculAutoNotesSelonCompetences",
	ObjetRequeteCalculAutoNotesSelonCompetences,
);
module.exports = { ObjetRequeteCalculAutoNotesSelonCompetences };
