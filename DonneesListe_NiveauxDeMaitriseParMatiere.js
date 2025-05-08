const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class DonneesListe_NiveauxDeMaitriseParMatiere extends ObjetDonneesListe {
	constructor(aDonnees, aOptions) {
		super(aDonnees);
		this.parametres = aOptions;
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecDeploiement: true,
			avecTri: false,
		});
	}
	setParametres(aParametres) {
		Object.assign(this.parametres, aParametres);
	}
	avecEvenementSelection(aParams) {
		return (
			this.parametres.avecDetail &&
			aParams.idColonne ===
				DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.etatDAcquisition
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.matieres:
				return aParams.article.getLibelle();
			case DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.etatDAcquisition: {
				const lAvecPastille = !(
					[
						DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.pilier,
						DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.service,
					].includes(aParams.article.getGenre()) &&
					!(
						GParametres.afficherAbbreviationNiveauDAcquisition ||
						GEtatUtilisateur.estAvecCodeCompetences()
					)
				);
				let lJauge = "";
				if (
					this.parametres.jaugeChronologique &&
					aParams.article.listeNiveaux
				) {
					lJauge = TUtilitaireCompetences.composeJaugeChronologique({
						listeNiveaux: aParams.article.listeNiveaux,
						hint: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
							aParams.article.listeNiveaux,
						),
					});
				} else {
					const lParamsJauge = {
						listeNiveaux: aParams.article.listeNiveauxParNiveau
							? aParams.article.listeNiveauxParNiveau
							: TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
									aParams.article.listeNiveaux,
								),
						hint: aParams.article.listeNiveauxParNiveau
							? aParams.article.hintNiveaux
							: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
									aParams.article.listeNiveaux,
								),
					};
					if (lAvecPastille) {
						lJauge =
							TUtilitaireCompetences.composeJaugeParPastilles(lParamsJauge);
					} else {
						lJauge =
							TUtilitaireCompetences.composeJaugeParNiveaux(lParamsJauge);
					}
				}
				return lJauge;
			}
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.items:
			case DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.niveau:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getStyle(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.matieres
		) {
			switch (aParams.article.getGenre()) {
				case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.pilier:
					return "";
				case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.service:
					return "padding-left: 5px;";
				case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.domaine:
					return "padding-left: 10px;";
			}
		}
	}
	getClass(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.matieres
		) {
			switch (aParams.article.getGenre()) {
				case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.pilier:
					return "Gras";
				case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.service:
					return "Gras";
				case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.domaine:
					return this.parametres.avecDetail ? "AvecMain" : "";
			}
		}
	}
	getCouleurCellule(aParams) {
		switch (aParams.article.getGenre()) {
			case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.pilier:
				return GCouleur.liste.cumul[0];
			case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.service:
				return GCouleur.liste.cumul[1];
			case DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne.domaine:
				return GCouleur.liste.colonneFixe;
		}
	}
}
DonneesListe_NiveauxDeMaitriseParMatiere.colonnes = {
	matieres: "matieres",
	etatDAcquisition: "etatDAcquisition",
};
DonneesListe_NiveauxDeMaitriseParMatiere.genreLigne = {
	pilier: 0,
	service: 1,
	domaine: 2,
};
module.exports = { DonneesListe_NiveauxDeMaitriseParMatiere };
