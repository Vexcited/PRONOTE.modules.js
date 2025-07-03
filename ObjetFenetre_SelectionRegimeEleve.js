exports.ObjetFenetre_SelectionRegimeEleve = void 0;
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListe_1 = require("ObjetListe");
class ObjetFenetre_SelectionRegimeEleve extends ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"RecapAbs.titreFenetreRegimes",
			),
			largeur: 450,
			hauteur: 700,
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
		let lOptions = {
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecCBToutCocher: !!this._options.avecCocheRessources,
			forcerOmbreScrollBottom: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
		};
		aInstance.setOptionsListe(lOptions);
	}
	setDonnees(aParams) {
		this.listeRessourcesSelectionnees = aParams.listeRessourcesSelectionnees;
		this.genreRessource = Enumere_Ressource_1.EGenreRessource.RegimeEleve;
		this.construireListeRessource(
			aParams.listeRessources,
			aParams.listeRessourcesSelectionnees,
		);
		this.afficher();
		this._actualiserListe();
	}
	_actualiserListe() {
		this.setBoutonActif(
			this.indexBtnValider,
			!this.estSelectionObligatoire() || this._nbRessourcesCochees() > 0,
		);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionRegimeEleve(this.listeRessources),
		);
	}
}
exports.ObjetFenetre_SelectionRegimeEleve = ObjetFenetre_SelectionRegimeEleve;
class DonneesListe_SelectionRegimeEleve extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecTri: false,
			avecCB: true,
			avecEvnt_CB: true,
			avecCocheCBSurLigne: true,
			avecBoutonActionLigne: false,
		});
	}
	getDisabledCB(aParams) {
		let D = aParams.article;
		return !!D.nonEditable;
	}
	getValueCB(aParams) {
		return aParams.article ? aParams.article.selectionne : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.selectionne = aValue;
	}
	getTitreZonePrincipale(aParams) {
		let D = aParams.article;
		return D.getLibelle();
	}
}
