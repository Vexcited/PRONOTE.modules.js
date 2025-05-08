exports.TypeFichierBase64 = void 0;
const Enumere_ChampsJSON_1 = require("Enumere_ChampsJSON");
const TypeHttpVariable_1 = require("TypeHttpVariable");
class TypeFichierBase64 {
	constructor(aDonneesBase64) {
		this.donneesBase64 = aDonneesBase64;
	}
	toJSON() {
		const lJSON = {};
		lJSON[Enumere_ChampsJSON_1.TypeChampsJSON.type] =
			TypeHttpVariable_1.TypeHttpVariable.TypeHttpFichierBase64;
		lJSON[Enumere_ChampsJSON_1.TypeChampsJSON.valeur] = this.donneesBase64;
		return lJSON;
	}
}
exports.TypeFichierBase64 = TypeFichierBase64;
