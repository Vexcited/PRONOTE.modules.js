exports.ObjetFenetre_SelectionCreneauxAppel = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_SelectionCreneauxAppel extends ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.selectionnerCreneauxAppel",
			),
			largeur: 450,
			hauteur: 700,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.setSelectionObligatoire(true);
		this.indexBtnValider = 1;
	}
	_creerObjetDonneesListe() {
		return new DonneesListe_SelectionCreneauxAppel(this.listeRessources);
	}
	_initialiserListe(aInstance) {
		let lOptions = {
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecCBToutCocher: true,
			forcerOmbreScrollBottom: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
		};
		aInstance.setOptionsListe(lOptions);
	}
}
exports.ObjetFenetre_SelectionCreneauxAppel =
	ObjetFenetre_SelectionCreneauxAppel;
class DonneesListe_SelectionCreneauxAppel extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecCB: true,
			avecCocheCBSurLigne: true,
			avecBoutonActionLigne: false,
		});
	}
	getValueCB(aParams) {
		return aParams.article ? aParams.article.selectionne : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		aParams.article.selectionne = aValue;
	}
}
