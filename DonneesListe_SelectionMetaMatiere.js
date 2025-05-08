exports.DonneesListe_SelectionMetaMatiere = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
class DonneesListe_SelectionMetaMatiere extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aListeMetaMatieres) {
		super(aListeMetaMatieres);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecEtatSaisie: false,
			avecMultiSelection: true,
		});
	}
	surSelectionLigne(J, D, aSelectionner) {
		D.selectionne = aSelectionner;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionMetaMatiere.colonnes.libelle:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_SelectionMetaMatiere.colonnes.lve:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionMetaMatiere.colonnes.libelle:
				return aParams.article.getLibelle();
			case DonneesListe_SelectionMetaMatiere.colonnes.lve:
				return !!aParams.article.estLVE;
		}
		return "";
	}
	getVisible(D) {
		if (!this._options || !this._options.filtres) {
			return true;
		}
		D.selectionne = false;
		let lVisible = true;
		for (let i in this._options.filtres) {
			const lFiltre = this._options.filtres[i];
			lVisible = lVisible && lFiltre.filtre(D, lFiltre.checked);
			if (!lVisible) {
				D.selectionne = false;
				return false;
			}
		}
		return lVisible;
	}
}
exports.DonneesListe_SelectionMetaMatiere = DonneesListe_SelectionMetaMatiere;
DonneesListe_SelectionMetaMatiere.colonnes = {
	libelle: "selectMetaMatiere_libelle",
	lve: "selectMetaMatiere_lve",
};
