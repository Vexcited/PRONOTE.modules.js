exports.DonneesListe_ListeACocher = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_ListeACocher extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEtatSaisie: false, avecEvnt_Creation: true });
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeACocher.colonnes.coche:
				return aParams.article.selectionne;
			case DonneesListe_ListeACocher.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeACocher.colonnes.coche:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getTri() {
		const lTris = [
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.getNumero();
			}),
		];
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
	avecMenuContextuel() {
		return false;
	}
	surCreation(D, V) {
		D.Libelle = V[1];
		D.selectionne = true;
		D.estModifiable = true;
		D.estSupprimable = true;
		D.nbReferences = 1;
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeACocher.colonnes.coche:
				return aParams.article.estSelectionnable !== false;
			case DonneesListe_ListeACocher.colonnes.libelle:
				return !!aParams.article.estModifiable;
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeACocher.colonnes.coche:
				aParams.article.selectionne = V;
				aParams.article.selectionne
					? aParams.article.nbReferences++
					: aParams.article.nbReferences--;
				break;
			case DonneesListe_ListeACocher.colonnes.libelle:
				aParams.article.ancienLibelle = aParams.article.Libelle;
				aParams.article.Libelle = V;
				break;
		}
	}
	avecSuppression(aParams) {
		return !!aParams.article.estSupprimable;
	}
	suppressionImpossible(D) {
		return D.nbReferences !== 0;
	}
	getMessageSuppressionImpossible() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"liste.suppressionMotifImpossible",
		);
	}
}
exports.DonneesListe_ListeACocher = DonneesListe_ListeACocher;
DonneesListe_ListeACocher.colonnes = {
	coche: "DLAC_coche",
	libelle: "DLAC_libelle",
};
