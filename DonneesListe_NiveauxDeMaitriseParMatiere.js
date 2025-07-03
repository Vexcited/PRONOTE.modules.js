exports.DonneesListe_NiveauxDeMaitriseParMatiere = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
var GenreLigneListeNiveauxDeMaitriseParMatiere;
(function (GenreLigneListeNiveauxDeMaitriseParMatiere) {
	GenreLigneListeNiveauxDeMaitriseParMatiere[
		(GenreLigneListeNiveauxDeMaitriseParMatiere["pilier"] = 0)
	] = "pilier";
	GenreLigneListeNiveauxDeMaitriseParMatiere[
		(GenreLigneListeNiveauxDeMaitriseParMatiere["service"] = 1)
	] = "service";
	GenreLigneListeNiveauxDeMaitriseParMatiere[
		(GenreLigneListeNiveauxDeMaitriseParMatiere["domaine"] = 2)
	] = "domaine";
})(
	GenreLigneListeNiveauxDeMaitriseParMatiere ||
		(GenreLigneListeNiveauxDeMaitriseParMatiere = {}),
);
class DonneesListe_NiveauxDeMaitriseParMatiere extends ObjetDonneesListe_1.ObjetDonneesListe {
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
						GenreLigneListeNiveauxDeMaitriseParMatiere.pilier,
						GenreLigneListeNiveauxDeMaitriseParMatiere.service,
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
					const lParamsJauge = {
						listeNiveaux: aParams.article.listeNiveauxParNiveau
							? aParams.article.listeNiveauxParNiveau
							: UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
									aParams.article.listeNiveaux,
								),
						hint: aParams.article.listeNiveauxParNiveau
							? aParams.article.hintNiveaux
							: UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
									aParams.article.listeNiveaux,
								),
					};
					if (lAvecPastille) {
						lJauge =
							UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParPastilles(
								lParamsJauge,
							);
					} else {
						lJauge =
							UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
								lParamsJauge,
							);
					}
				}
				return lJauge;
			}
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.etatDAcquisition:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getStyle(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.matieres
		) {
			switch (aParams.article.getGenre()) {
				case GenreLigneListeNiveauxDeMaitriseParMatiere.pilier:
					return "";
				case GenreLigneListeNiveauxDeMaitriseParMatiere.service:
					return "padding-left: 5px;";
				case GenreLigneListeNiveauxDeMaitriseParMatiere.domaine:
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
				case GenreLigneListeNiveauxDeMaitriseParMatiere.pilier:
					return "Gras";
				case GenreLigneListeNiveauxDeMaitriseParMatiere.service:
					return "Gras";
				case GenreLigneListeNiveauxDeMaitriseParMatiere.domaine:
					return this.parametres.avecDetail ? "AvecMain" : "";
			}
		}
	}
	getCouleurCellule(aParams) {
		switch (aParams.article.getGenre()) {
			case GenreLigneListeNiveauxDeMaitriseParMatiere.pilier:
				return GCouleur.liste.cumul[0];
			case GenreLigneListeNiveauxDeMaitriseParMatiere.service:
				return GCouleur.liste.cumul[1];
			case GenreLigneListeNiveauxDeMaitriseParMatiere.domaine:
				return GCouleur.liste.colonneFixe;
		}
	}
}
exports.DonneesListe_NiveauxDeMaitriseParMatiere =
	DonneesListe_NiveauxDeMaitriseParMatiere;
DonneesListe_NiveauxDeMaitriseParMatiere.colonnes = {
	matieres: "matieres",
	etatDAcquisition: "etatDAcquisition",
};
