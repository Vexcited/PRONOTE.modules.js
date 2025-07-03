exports.ObjetFenetre_SelectionTypeRessourceAbsence = void 0;
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListe_1 = require("ObjetListe");
class ObjetFenetre_SelectionTypeRessourceAbsence extends ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SelectionnerTypesDeDonnees",
			),
			largeur: 350,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.setSelectionObligatoire(true);
		this.setAutoriseEltAucun(true);
		this.indexBtnValider = 1;
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecCBToutCocher: true,
			avecToutSelectionner: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
		});
	}
	_actualiserListe() {
		this.setBoutonActif(
			this.indexBtnValider,
			!this.estSelectionObligatoire() || this._nbRessourcesCochees() > 0,
		);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListeSelectionTypeRessourceAbsence(this.listeRessources),
		);
	}
}
exports.ObjetFenetre_SelectionTypeRessourceAbsence =
	ObjetFenetre_SelectionTypeRessourceAbsence;
class DonneesListeSelectionTypeRessourceAbsence extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecTri: false,
			avecSelection: false,
			avecCB: true,
			avecEvnt_CB: true,
			avecCocheCBSurLigne: true,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getValueCB(aParams) {
		return !!aParams.article.selectionne;
	}
	setValueCB(aParams, aValue) {
		aParams.article.selectionne = aValue;
	}
}
