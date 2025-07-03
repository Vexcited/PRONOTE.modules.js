exports.ObjetParametresCommunSco = void 0;
const ObjetParametresCP_1 = require("ObjetParametresCP");
class ObjetParametresCommunSco extends ObjetParametresCP_1.ObjetParametresCP {
	constructor(aJSON) {
		super();
		Object.assign(this, aJSON);
	}
	setDocumentTitle(aLibelleOnglet) {
		const lLibelleOnglet = aLibelleOnglet ? aLibelleOnglet + " - " : "";
		const lLibelleProduit =
			this.nomProduit + (this.versionPN ? " " + this.versionPN : "");
		document.title = `${lLibelleOnglet}${lLibelleProduit} - ${this.NomEtablissementConnexion}`;
	}
}
exports.ObjetParametresCommunSco = ObjetParametresCommunSco;
