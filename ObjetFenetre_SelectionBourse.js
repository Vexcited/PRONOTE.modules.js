const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const {
	ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetFenetre_SelectionBourse extends ObjetFenetre_SelectionRessource {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("RecapAbs.titreFenetreBourses"),
			largeur: 350,
			hauteur: 400,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
		this.setSelectionObligatoire(true);
		this.setAutoriseEltAucun(true);
		this.indexBtnValider = 1;
	}
	setDonnees(aListeRessources, aListeRessourcesSelectionnees) {
		this.listeRessourcesSelectionnees = aListeRessourcesSelectionnees;
		this.genreRessource = EGenreRessource.Bourse;
		this.construireListeRessource(
			aListeRessources,
			aListeRessourcesSelectionnees,
		);
		this.afficher();
		this._actualiserListe();
	}
	_actualiserListe() {
		this.setBoutonActif(
			this.indexBtnValider,
			!this.selectionObligatoire || this._nbRessourcesCochees() > 0,
		);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionBourse(this.listeRessources),
		);
	}
}
class DonneesListe_SelectionBourse extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSuppression: false,
			avecEtatSaisie: false,
			avecEvnt_ApresEdition: true,
			avecTri: false,
		});
	}
	avecEdition(aParams) {
		return aParams.colonne === 0;
	}
	getTypeValeur(aParams) {
		switch (aParams.colonne) {
			case 0:
				return ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.colonne) {
			case 0:
				return !!aParams.article.selectionne
					? ObjetDonneesListe.EGenreCoche.Verte
					: ObjetDonneesListe.EGenreCoche.Aucune;
			case 1:
				return aParams.article.getLibelle();
		}
		return "";
	}
	surEdition(aParams, V) {
		aParams.article.selectionne = V;
	}
}
module.exports = { ObjetFenetre_SelectionBourse };
