exports.InterfaceVide = void 0;
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
class InterfaceVide extends ObjetInterface_1.ObjetInterface {
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return this.composeMessage(
			ObjetTraduction_1.GTraductions.getValeur("SelectionAffichage"),
		);
	}
}
exports.InterfaceVide = InterfaceVide;
