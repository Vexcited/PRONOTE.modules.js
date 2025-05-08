const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const {
	ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_SelectionTypeRessourceAbsence extends ObjetFenetre_SelectionRessource {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("TypeDeDonnees"),
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
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListeSelectionTypeRessourceAbsence.colonnes.coche,
			titre: { estCoche: true },
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListeSelectionTypeRessourceAbsence.colonnes.libelle,
			titre: GTraductions.getValeur("Nom"),
			taille: "100%",
		});
		aInstance.setOptionsListe({ colonnes: lColonnes, avecListeNeutre: true });
	}
	_actualiserListe() {
		this.setBoutonActif(
			this.indexBtnValider,
			!this.selectionObligatoire || this._nbRessourcesCochees() > 0,
		);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListeSelectionTypeRessourceAbsence(this.listeRessources),
		);
	}
}
class DonneesListeSelectionTypeRessourceAbsence extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSuppression: false,
			avecEvnt_ApresEdition: true,
			avecEtatSaisie: false,
			avecTri: false,
		});
	}
	avecEdition(aParams) {
		return (
			aParams.idColonne ===
			DonneesListeSelectionTypeRessourceAbsence.colonnes.coche
		);
	}
	getTypeValeur(aParams) {
		if (
			aParams.idColonne ===
			DonneesListeSelectionTypeRessourceAbsence.colonnes.coche
		) {
			return ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListeSelectionTypeRessourceAbsence.colonnes.coche:
				return !!aParams.article.selectionne;
			case DonneesListeSelectionTypeRessourceAbsence.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	surEdition(aParams, V) {
		aParams.article.selectionne = V;
	}
}
DonneesListeSelectionTypeRessourceAbsence.colonnes = {
	coche: "SelTRA_coche",
	libelle: "SelTRA_libelle",
};
module.exports = { ObjetFenetre_SelectionTypeRessourceAbsence };
