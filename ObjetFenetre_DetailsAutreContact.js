const { ObjetFenetre } = require("ObjetFenetre.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
class ObjetFenetre_DetailsAutreContact extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idContenu = GUID.getId();
	}
	construireInstances() {}
	composeContenu() {
		const H = [];
		H.push('<div id="', this.idContenu, '"></div>');
		return H.join("");
	}
	setDonnees(aParams) {
		GHtml.setHtml(this.idContenu, aParams.html, {
			controleur: aParams.controleur,
		});
	}
}
module.exports = { ObjetFenetre_DetailsAutreContact };
