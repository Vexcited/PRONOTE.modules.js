exports.ObjetRequeteCalculAutoNotesSelonCompetences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteCalculAutoNotesSelonCompetences extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteCalculAutoNotesSelonCompetences =
	ObjetRequeteCalculAutoNotesSelonCompetences;
CollectionRequetes_1.Requetes.inscrire(
	"CalculAutoNotesSelonCompetences",
	ObjetRequeteCalculAutoNotesSelonCompetences,
);
