const { GestionnaireImportExport } = require("GestionnaireImportExport.js");
const ObjetRequeteSaisieImport = require("ObjetRequeteSaisieImport.js");
const ObjetFenetre_Import_PN = require("ObjetFenetre_Import_PN.js");
class GestionnaireImportExport_PN extends GestionnaireImportExport {
	constructor(...aParams) {
		super(...aParams);
		this.avecFormatDateUnique = false;
	}
	envoyerRequeteSaisie(aObjetSaisie) {
		new ObjetRequeteSaisieImport(this, this._actionSurSaisie).lancerRequete(
			aObjetSaisie,
		);
	}
	envoyerRequeteDonnees() {
		new ObjetRequeteSaisieImport(
			this,
			this._actionApresRequete,
		).lancerRequete();
	}
	setObjetFenetre() {
		return ObjetFenetre_Import_PN;
	}
}
module.exports = { GestionnaireImportExport_PN };
