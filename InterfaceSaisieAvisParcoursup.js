exports.InterfaceSaisieAvisParcoursup = void 0;
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const _InterfaceSaisieApprReleveBulletin_1 = require("_InterfaceSaisieApprReleveBulletin");
class InterfaceSaisieAvisParcoursup extends _InterfaceSaisieApprReleveBulletin_1._InterfaceSaisieApprReleveBulletin {
	constructor(...aParams) {
		super(...aParams);
		this.typeReleveBulletin =
			TypeReleveBulletin_1.TypeReleveBulletin.AvisParcoursup;
		this.avecComboPeriode = false;
	}
}
exports.InterfaceSaisieAvisParcoursup = InterfaceSaisieAvisParcoursup;
