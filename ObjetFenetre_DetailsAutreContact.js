exports.ObjetFenetre_DetailsAutreContact = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
class ObjetFenetre_DetailsAutreContact extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.idContenu = GUID_1.GUID.getId();
	}
	composeContenu() {
		return IE.jsx.str("div", { id: this.idContenu });
	}
	setDonnees(aParams) {
		ObjetHtml_1.GHtml.setHtml(this.idContenu, aParams.html, {
			controleur: aParams.controleur,
		});
	}
}
exports.ObjetFenetre_DetailsAutreContact = ObjetFenetre_DetailsAutreContact;
