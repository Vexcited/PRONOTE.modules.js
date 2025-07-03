exports.ObjetFenetre_SelectionMotifs = void 0;
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListe_1 = require("ObjetListe");
class ObjetFenetre_SelectionMotifs extends ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 450,
			hauteur: 700,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.indexBtnValider = 1;
	}
	setDonnees(aParam) {
		this.listeRessourcesSelectionnees = aParam.listeRessourcesSelectionnees;
		this.genreRessource = aParam.genreRessource;
		this.construireListeRessource(
			aParam.listeRessources,
			aParam.listeRessourcesSelectionnees,
		);
		this.setOptionsFenetre({ titre: aParam.titre });
		this.afficher();
		this._actualiserListe();
	}
	_actualiserListe() {
		this.setBoutonActif(
			this.indexBtnValider,
			!this.estSelectionObligatoire() || this._nbRessourcesCochees() > 0,
		);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionMotifs(this.listeRessources),
		);
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
}
exports.ObjetFenetre_SelectionMotifs = ObjetFenetre_SelectionMotifs;
class DonneesListe_SelectionMotifs extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecTri: true,
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
	getZoneGauche(aParams) {
		return "couleur" in aParams.article && aParams.article.couleur
			? '<div class="couleur ie-line-color static only-color" style="--color-line:' +
					aParams.article.couleur +
					'"></div>'
			: '<div class="m-right"></div>';
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return !D.nonConnu;
			}),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
}
