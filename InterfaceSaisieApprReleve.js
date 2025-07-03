exports.InterfaceSaisieApprReleve = void 0;
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const _InterfaceSaisieApprReleveBulletin_1 = require("_InterfaceSaisieApprReleveBulletin");
const DonneesListe_ApprBulletin_1 = require("DonneesListe_ApprBulletin");
class InterfaceSaisieApprReleve extends _InterfaceSaisieApprReleveBulletin_1._InterfaceSaisieApprReleveBulletin {
	constructor(...aParams) {
		super(...aParams);
		this.typeReleveBulletin =
			TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsReleveProfesseur;
	}
	estColonnePositionnementEstVisible() {
		const lNumColonne = this.getInstance(
			this.identListe,
		).getNumeroColonneDIdColonne(
			DonneesListe_ApprBulletin_1.DonneesListe_ApprBulletin.colonnes.niveauAcqu,
		);
		return lNumColonne !== -1;
	}
}
exports.InterfaceSaisieApprReleve = InterfaceSaisieApprReleve;
