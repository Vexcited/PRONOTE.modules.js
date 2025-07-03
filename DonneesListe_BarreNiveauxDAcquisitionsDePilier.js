exports.DonneesListe_BarreNiveauxDAcquisitionsDePilier = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class DonneesListe_BarreNiveauxDAcquisitionsDePilier extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.parametres = aParams;
		this.creerIndexUnique("Libelle");
		this.setOptions({ avecEdition: false, avecSuppression: false });
	}
	getVisible(D) {
		if (!this.parametres.afficheJaugesChronologiques) {
			let lResult = false;
			if (!!D.listeNiveaux) {
				D.listeNiveaux.parcourir((aNiveau) => {
					if (
						aNiveau.getGenre() !==
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Absent &&
						aNiveau.getGenre() !==
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.NonEvalue
					) {
						lResult = true;
						return false;
					}
				});
			}
			return lResult;
		}
		return true;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes.jauge:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes.domaine:
				return (
					aParams.article.getLibelle() ||
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_BarreNiveauxDacquisitions.SansLienAvecLeDomaineDuSocle",
					)
				);
			case DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes.jauge:
				if (this.parametres.afficheJaugesChronologiques) {
					return UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeChronologique(
						{
							listeNiveaux: aParams.article.listeNiveauxChronologiques,
							hint: UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
								aParams.article.listeNiveauxChronologiques,
							),
						},
					);
				} else {
					return UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
						{
							listeNiveaux: aParams.article.listeNiveaux,
							hint: UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
								aParams.article.listeNiveaux,
							),
						},
					);
				}
		}
	}
}
exports.DonneesListe_BarreNiveauxDAcquisitionsDePilier =
	DonneesListe_BarreNiveauxDAcquisitionsDePilier;
DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes = {
	domaine: "DLBarreNiv_domaine",
	jauge: "DLBarreNiv_jauge",
};
