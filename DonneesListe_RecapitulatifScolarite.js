exports.DonneesListe_RecapitulatifScolarite = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
const TypeColonneRecapScolarite_1 = require("TypeColonneRecapScolarite");
class DonneesListe_RecapitulatifScolarite extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aLigneTotal) {
		super(aDonnees);
		this.ligneTotal = aLigneTotal;
		this.setOptions({
			avecDeploiement: true,
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecTri: false,
		});
	}
	estUneColonneAutreObservation(aIdColonne) {
		return aIdColonne.startsWith(
			DonneesListe_RecapitulatifScolarite.colonnes.prefixeAutreObservation,
		);
	}
	estUneColonneMention(aIdColonne) {
		return aIdColonne.startsWith(
			DonneesListe_RecapitulatifScolarite.colonnes.prefixeMention,
		);
	}
	avecEvenementEdition(aParams) {
		if (aParams.article.estUnDeploiement || aParams.article.estTotal) {
			return false;
		}
		const lIndexColonne = aParams.colonne;
		if (this.estUneColonneAutreObservation(aParams.idColonne)) {
			return aParams.article.colonnes[lIndexColonne] !== "-";
		}
		if (this.estUneColonneMention(aParams.idColonne)) {
			return false;
		}
		switch (aParams.idColonne) {
			case DonneesListe_RecapitulatifScolarite.colonnes.Absence:
				return (
					aParams.article.listeAbsences &&
					aParams.article.listeAbsences.count() > 0
				);
			case DonneesListe_RecapitulatifScolarite.colonnes.Retard:
				return (
					aParams.article.listeRetards &&
					aParams.article.listeRetards.count() > 0
				);
			case DonneesListe_RecapitulatifScolarite.colonnes.Exclusion:
				return (
					aParams.article.listeExclusions &&
					aParams.article.listeExclusions.count() > 0
				);
			case DonneesListe_RecapitulatifScolarite.colonnes.Punition:
				return (
					aParams.article.listePunitions &&
					aParams.article.listePunitions.count() > 0
				);
			case DonneesListe_RecapitulatifScolarite.colonnes.Sanction:
				return (
					aParams.article.listeSanctions &&
					aParams.article.listeSanctions.count() > 0
				);
			case DonneesListe_RecapitulatifScolarite.colonnes.ObservationParent:
			case DonneesListe_RecapitulatifScolarite.colonnes.Encouragement:
			case DonneesListe_RecapitulatifScolarite.colonnes.DefautCarnet:
				return aParams.article.colonnes[lIndexColonne] !== "-";
		}
		return false;
	}
	avecMenuContextuel() {
		return false;
	}
	getValeur(aParams) {
		if (aParams.article && aParams.article.colonnes) {
			return aParams.article.colonnes[aParams.colonne];
		}
		return "";
	}
	avecContenuTronque(aParams) {
		return (
			aParams.idColonne === DonneesListe_RecapitulatifScolarite.colonnes.Regime
		);
	}
	getContenuTotal(aParams) {
		if (this.ligneTotal) {
			return this.ligneTotal.colonnes[aParams.colonne];
		}
		return "";
	}
	getCouleurCellule(aParams) {
		if (aParams.article.estUnDeploiement) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
	}
	getClass(aParams) {
		const lClasses = [];
		lClasses.push("AvecMain");
		if (aParams.article.estUnDeploiement) {
			lClasses.push("Gras");
		}
		switch (aParams.idColonne) {
			case DonneesListe_RecapitulatifScolarite.colonnes.Classe:
			case DonneesListe_RecapitulatifScolarite.colonnes.Eleve:
			case DonneesListe_RecapitulatifScolarite.colonnes.Naissance:
			case DonneesListe_RecapitulatifScolarite.colonnes.Regime:
				lClasses.push("AlignementGauche");
				break;
			case DonneesListe_RecapitulatifScolarite.colonnes.Moyenne:
				lClasses.push("AlignementDroit");
				break;
			default:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	getTri() {
		return [ObjetTri_1.ObjetTri.init("Position")];
	}
}
exports.DonneesListe_RecapitulatifScolarite =
	DonneesListe_RecapitulatifScolarite;
DonneesListe_RecapitulatifScolarite.prefixeColonnes = {
	default: "DL_RecapSco_",
	autreObservations:
		"DL_RecapSco_" +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_AutreObservation +
		"_",
	mentions:
		"DL_RecapSco_" +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Mention +
		"_",
};
DonneesListe_RecapitulatifScolarite.colonnes = {
	Classe:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Classe,
	Eleve:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Eleve,
	Naissance:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Naissance,
	Regime:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Regime,
	Moyenne:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Moyenne,
	NoteSup:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_NoteSup,
	NoteInf:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_NoteInf,
	Absence:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Absence,
	Retard:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Retard,
	Exclusion:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Exclusion,
	Punition:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Punition,
	Sanction:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Sanction,
	Convocation:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Convocation,
	ObservationParent:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_ObservationParent,
	Encouragement:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Encouragement,
	DefautCarnet:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
		TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_DefautCarnet,
	prefixeAutreObservation:
		DonneesListe_RecapitulatifScolarite.prefixeColonnes.autreObservations,
	prefixeMention: DonneesListe_RecapitulatifScolarite.prefixeColonnes.mentions,
};
