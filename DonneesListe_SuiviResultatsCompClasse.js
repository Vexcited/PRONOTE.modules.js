exports.DonneesListe_SuiviResultatsCompClasse = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
class DonneesListe_SuiviResultatsCompClasse extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEdition: false, avecSuppression: false });
	}
	avecEvenementSelectionClick(aParams) {
		return (
			aParams.idColonne === DonneesListe_SuiviResultatsCompClasse.colonnes.eleve
		);
	}
	avecMenuContextuel() {
		return false;
	}
	getTypeValeur() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviResultatsCompClasse.colonnes.eleve:
				return aParams.article.getLibelle();
			case DonneesListe_SuiviResultatsCompClasse.colonnes.nbEchecs:
				return aParams.article.nbElemCompEchecs || 0;
			case DonneesListe_SuiviResultatsCompClasse.colonnes.nbSucces:
				return aParams.article.nbElemCompSucces || 0;
		}
		return "";
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (aParams.article.nbElemCompEchecs > 0) {
			lClasses.push("Gras");
		}
		switch (aParams.idColonne) {
			case DonneesListe_SuiviResultatsCompClasse.colonnes.eleve:
				lClasses.push("SouligneSurvol");
				lClasses.push("AvecMain");
				break;
			case DonneesListe_SuiviResultatsCompClasse.colonnes.nbEchecs:
			case DonneesListe_SuiviResultatsCompClasse.colonnes.nbSucces:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	getTri(aCol, aGenreTri) {
		const lTris = [];
		switch (this.getId(aCol)) {
			case DonneesListe_SuiviResultatsCompClasse.colonnes.eleve:
				lTris.push(ObjetTri_1.ObjetTri.init("Position", aGenreTri));
				break;
			case DonneesListe_SuiviResultatsCompClasse.colonnes.nbEchecs:
				lTris.push(
					ObjetTri_1.ObjetTri.init(
						"nbElemCompEchecs",
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_SuiviResultatsCompClasse.colonnes.nbSucces:
				lTris.push(
					ObjetTri_1.ObjetTri.init(
						"nbElemCompSucces",
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
		}
		return lTris;
	}
}
exports.DonneesListe_SuiviResultatsCompClasse =
	DonneesListe_SuiviResultatsCompClasse;
DonneesListe_SuiviResultatsCompClasse.colonnes = {
	eleve: "DLSuiviCpt_eleve",
	nbEchecs: "DLSuiviCpt_echecs",
	nbSucces: "DLSuiviCpt_succes",
};
