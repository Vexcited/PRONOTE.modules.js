exports.WS_Port = void 0;
const TableauDElements_1 = require("TableauDElements");
const WS_Operation_1 = require("WS_Operation");
class WS_Port {
	constructor(aEspaceNommage, aPrefixeSoapAction, aUrlAcces, aVersionSoap) {
		this.nom = "";
		this.espaceNommage = aEspaceNommage;
		this.prefixeSoapAction = aPrefixeSoapAction;
		this.urlAcces = aUrlAcces;
		this.versionSoap = aVersionSoap;
		this.operations = new TableauDElements_1.TableauDElements();
	}
	setNom(aNom) {
		this.nom = aNom;
	}
	setUrlAcces(aUrlAcces) {
		this.urlAcces = aUrlAcces;
	}
	getNom() {
		return this.nom;
	}
	getUrlAcces() {
		return this.urlAcces;
	}
	ajouterOperation(aOperation) {
		const lOperation = aOperation
			? aOperation
			: new WS_Operation_1.WS_Operation(
					this.espaceNommage,
					this.prefixeSoapAction + "-" + this.nom + "#",
					this.urlAcces,
					this.versionSoap,
				);
		return this.operations.ajouterElement(lOperation);
	}
	getOperation(aNomOperation) {
		return this.operations.getElement(aNomOperation);
	}
}
exports.WS_Port = WS_Port;
