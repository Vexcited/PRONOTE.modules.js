exports.ObjetFenetre_BulletinBIA = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetDocumentsATelecharger_1 = require("ObjetDocumentsATelecharger");
class ObjetFenetre_BulletinBIA extends ObjetFenetre_1.ObjetFenetre {
	construireInstances() {
		this.identDoc = this.add(
			ObjetDocumentsATelecharger_1.ObjetDocumentsATelecharger,
		);
	}
	setDonnees(aDonnees) {
		this.getInstance(this.identDoc).setDonnees(aDonnees);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div class="Espace Table BorderBox full-width" id="',
			this.getNomInstance(this.identDoc),
			'"></div>',
		);
		return T.join("");
	}
}
exports.ObjetFenetre_BulletinBIA = ObjetFenetre_BulletinBIA;
