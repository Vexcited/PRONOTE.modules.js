exports.ObjetSelecteurMotifAbsence = void 0;
const ObjetFenetre_SelectionMotifs_1 = require("ObjetFenetre_SelectionMotifs");
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetSelecteurMotifAbsence extends _ObjetSelecteur_1._ObjetSelecteur {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.selectionMotifsAbsence",
			),
			titreLibelle: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.motifsAbsence",
			),
		});
	}
	construireInstanceFenetreSelection() {
		this.identFenetreSelection = this.addFenetre(
			ObjetFenetre_SelectionMotifs_1.ObjetFenetre_SelectionMotifs,
			this.evntFenetreSelection,
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
exports.ObjetSelecteurMotifAbsence = ObjetSelecteurMotifAbsence;
