exports.DonneesListe_SelectionElementPilier = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_SelectionElementPilier extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecDeploiement: true,
			avecImageSurColonneDeploiement: true,
		});
	}
	avecSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	getClassCelluleConteneur(aParams) {
		if (aParams.article.estUnDeploiement) {
			return "AvecMain";
		}
		return "";
	}
	getIndentationCellule(aParams) {
		return this.getIndentationCelluleSelonParente(aParams);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionElementPilier.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getTypeValeur() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getVisible(D) {
		if (!this._options || !this._options.filtres) {
			return true;
		}
		D.selectionne = false;
		let lVisible = true;
		for (const i in this._options.filtres) {
			const lFiltre = this._options.filtres[i];
			lVisible = lVisible && lFiltre.filtre(D, lFiltre.checked);
			if (!lVisible) {
				return false;
			}
		}
		return lVisible;
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.pere ? D.pere.getPosition() : D.getPosition();
			}),
		);
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.pere ? D.getPosition() : -1;
			}),
		);
		return lTris;
	}
}
exports.DonneesListe_SelectionElementPilier =
	DonneesListe_SelectionElementPilier;
DonneesListe_SelectionElementPilier.colonnes = {
	libelle: "selectElmtPilier_libelle",
};
