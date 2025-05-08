const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { GTraductions } = require("ObjetTraduction.js");
class InterfaceVide extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return this.composeMessage(GTraductions.getValeur("SelectionAffichage"));
	}
}
module.exports = { InterfaceVide };
