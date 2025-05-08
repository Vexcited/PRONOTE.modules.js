const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetDocumentsATelecharger } = require("ObjetDocumentsATelecharger.js");
class ObjetFenetre_BulletinBIA extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identDoc = this.add(ObjetDocumentsATelecharger);
	}
	setOptionsFenetre(aParams) {
		super.setOptionsFenetre(aParams);
	}
	setDonnees(aDonnees) {
		this.getInstance(this.identDoc).setDonnees(aDonnees);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div class="Espace Table BorderBox full-width" id="',
			this.getInstance(this.identDoc).getNom(),
			'"></div>',
		);
		return T.join("");
	}
}
module.exports = { ObjetFenetre_BulletinBIA };
