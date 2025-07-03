exports.ObjetSelecteurMotifInfirmerie = void 0;
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_SelectionMotifs_1 = require("ObjetFenetre_SelectionMotifs");
class ObjetSelecteurMotifInfirmerie extends _ObjetSelecteur_1._ObjetSelecteur {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.selectionIssuesInfirmerie",
			),
			titreLibelle: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.issuesInfirmerie",
			),
			tooltip: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.selectionIssuesInfirmerie",
			),
		});
	}
	initFenetreSelection(aInstance) {
		aInstance.setAutoriseEltAucun(true);
		aInstance.setOptionsFenetre({
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		aInstance.indexBtnValider = 1;
	}
	construireInstanceFenetreSelection() {
		this.identFenetreSelection = this.addFenetre(
			ObjetFenetre_SelectionMotifs_1.ObjetFenetre_SelectionMotifs,
			this.evntFenetreSelection,
			this.initFenetreSelection,
		);
	}
	setDonnees(aParam) {
		super.setDonnees(aParam);
		this.genreRessource = aParam.genreRessource;
	}
	evntBtnSelection() {
		this.getInstance(this.identFenetreSelection).setDonnees({
			listeRessources: this.listeTotale,
			listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
				this.listeSelection,
			),
			titre: this._options.titreFenetre,
			genreRessource: this.genreRessource,
		});
	}
}
exports.ObjetSelecteurMotifInfirmerie = ObjetSelecteurMotifInfirmerie;
