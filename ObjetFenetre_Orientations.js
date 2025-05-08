const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
class ObjetFenetre_Orientations extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idMessage = `${this.Nom}_Message`;
		this.setOptionsFenetre({ avecTailleSelonContenu: true, avecScroll: true });
	}
	setDonnees(aMessage) {
		GHtml.setHtml(this.idMessage, (this.Message = aMessage));
		this.afficher();
	}
	composeContenu() {
		return `<div id="${this.idMessage}" class="Texte10 FondBlanc" style="padding:5px;height:auto;min-height:50px;max-height:400px;${GStyle.composeCouleurBordure(GCouleur.fenetre.bordure)}"></div>`;
	}
}
module.exports = { ObjetFenetre_Orientations };
