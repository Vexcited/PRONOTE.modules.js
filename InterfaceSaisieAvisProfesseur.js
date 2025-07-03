exports.InterfaceSaisieAvisProfesseur = void 0;
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const _InterfaceSaisieApprReleveBulletin_1 = require("_InterfaceSaisieApprReleveBulletin");
const ObjetTraduction_1 = require("ObjetTraduction");
class InterfaceSaisieAvisProfesseur extends _InterfaceSaisieApprReleveBulletin_1._InterfaceSaisieApprReleveBulletin {
	constructor(...aParams) {
		super(...aParams);
		this.typeReleveBulletin =
			TypeReleveBulletin_1.TypeReleveBulletin.AvisProfesseur;
	}
	construireStructureAffichageAutre() {
		const lConstruireInterfaceParent =
			super.construireStructureAffichageAutre();
		const H = [];
		H.push("<div>");
		H.push(
			'<div class="AlignementMilieu Gras Italique" style="line-height: 3rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Appreciations.msgSaisieAvisConfidentiels",
			),
			"</div>",
		);
		H.push(lConstruireInterfaceParent);
		H.push("</div>");
		return H.join("");
	}
}
exports.InterfaceSaisieAvisProfesseur = InterfaceSaisieAvisProfesseur;
