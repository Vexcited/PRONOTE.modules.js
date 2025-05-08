exports.ObjetSelecteurRegimeEleve = void 0;
const ObjetFenetre_SelectionRegimeEleve_1 = require("ObjetFenetre_SelectionRegimeEleve");
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetSelecteurRegimeEleve extends _ObjetSelecteur_1._ObjetSelecteur {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			titreLibelle:
				ObjetTraduction_1.GTraductions.getValeur("RecapAbs.regimes"),
		});
	}
	construireInstanceFenetreSelection() {
		this.identFenetreSelection = this.addFenetre(
			ObjetFenetre_SelectionRegimeEleve_1.ObjetFenetre_SelectionRegimeEleve,
			this.evntFenetreSelection,
		);
	}
	evntBtnSelection() {
		this.getInstance(this.identFenetreSelection).setDonnees(
			this.listeTotale,
			MethodesObjet_1.MethodesObjet.dupliquer(this.listeSelection),
		);
	}
}
exports.ObjetSelecteurRegimeEleve = ObjetSelecteurRegimeEleve;
