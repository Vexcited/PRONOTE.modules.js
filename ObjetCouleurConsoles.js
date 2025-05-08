exports.ObjetCouleurConsoles = void 0;
const _ObjetCouleur_1 = require("_ObjetCouleur");
class ObjetCouleurConsoles extends _ObjetCouleur_1._ObjetCouleur {
	constructor() {
		super();
		this.enService = {
			fond: this.themeCouleur.sombre,
			texte: this.blanc,
			texteVert: "#00CC00",
			texteRouge: "#FF0000",
		};
		this.texte = this.themeNeutre.sombre;
		this.bandeau = { fond: this.themeCouleur.foncee, texte: this.blanc };
	}
}
exports.ObjetCouleurConsoles = ObjetCouleurConsoles;
