exports.DonneesListe_SuiviResultatsCompEleve = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class DonneesListe_SuiviResultatsCompEleve extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams = {}) {
		super(aDonnees);
		this.optionsAffichage = {
			avecJaugeCliquable: !!aParams.avecJaugeCliquable,
			afficheJaugeChronologique: false,
		};
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecDeploiement: true,
			avecTri: false,
			avecEvnt_SelectionClick: this.optionsAffichage.avecJaugeCliquable,
		});
	}
	setOptionsAffichage(aOptionsAffichage) {
		Object.assign(this.optionsAffichage, aOptionsAffichage);
	}
	avecMenuContextuel() {
		return false;
	}
	getColonneDeFusion(aParams) {
		if (aParams.article.estUnDeploiement) {
			if (
				aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Palier ||
				aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Pilier
			) {
				return DonneesListe_SuiviResultatsCompEleve.colonnes.libelle;
			}
		}
		return null;
	}
	getTypeValeur() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_SuiviResultatsCompEleve.colonnes.libelle:
				if (aParams.article.estUnDeploiement) {
					lClasses.push("AvecMain");
				}
				break;
			case DonneesListe_SuiviResultatsCompEleve.colonnes.jauge:
				if (this.optionsAffichage.avecJaugeCliquable) {
					lClasses.push("AvecMain");
				}
				break;
		}
		return lClasses.join(" ");
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_SuiviResultatsCompEleve.colonnes.libelle
		);
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_SuiviResultatsCompEleve.colonnes.libelle
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviResultatsCompEleve.colonnes.libelle:
				return aParams.article.getLibelle();
			case DonneesListe_SuiviResultatsCompEleve.colonnes.jauge: {
				let lJauge = "";
				if (this.optionsAffichage.afficheJaugeChronologique) {
					lJauge =
						UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeChronologique(
							{
								listeNiveaux: aParams.article.listeNiveaux,
								hint: UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
									aParams.article.listeNiveaux,
								),
							},
						);
				} else {
					lJauge =
						UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
							{
								listeNiveaux: aParams.article.listeNiveauxParNiveau,
								hint: UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
									aParams.article.listeNiveauxParNiveau,
								),
							},
						);
				}
				return lJauge;
			}
		}
		return "";
	}
	getCouleurCellule(aParams) {
		if (!!aParams.article) {
			switch (aParams.article.getGenre()) {
				case Enumere_Ressource_1.EGenreRessource.Palier:
				case Enumere_Ressource_1.EGenreRessource.Pilier:
					return GCouleur.liste.cumul[0];
				case Enumere_Ressource_1.EGenreRessource.ElementPilier:
					return GCouleur.liste.cumul[1];
				case Enumere_Ressource_1.EGenreRessource.Competence:
				case Enumere_Ressource_1.EGenreRessource.SousItem:
					return GCouleur.liste.cumul[2];
			}
		}
		return null;
	}
	getIndentationCellule(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_SuiviResultatsCompEleve.colonnes.libelle
		) {
			return this.getIndentationCelluleSelonParente(aParams);
		}
		return 0;
	}
}
exports.DonneesListe_SuiviResultatsCompEleve =
	DonneesListe_SuiviResultatsCompEleve;
DonneesListe_SuiviResultatsCompEleve.colonnes = {
	libelle: "DLSuiviCpt_libelle",
	jauge: "DLSuiviCpt_jauge",
};
