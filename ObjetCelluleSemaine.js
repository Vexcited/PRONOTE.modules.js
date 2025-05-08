exports.ObjetCelluleSemaine = void 0;
const _ObjetCelluleSemaine_1 = require("_ObjetCelluleSemaine");
class ObjetCelluleSemaine extends _ObjetCelluleSemaine_1._ObjetCelluleSemaine {
	constructor(...aParams) {
		super(...aParams);
	}
	getDomaineSelectionne() {
		return GEtatUtilisateur.getDomaineSelectionne();
	}
}
exports.ObjetCelluleSemaine = ObjetCelluleSemaine;
