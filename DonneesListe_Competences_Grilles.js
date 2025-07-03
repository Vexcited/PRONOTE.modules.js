exports.DonneesListe_Competences_Grilles = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
class DonneesListe_Competences_Grilles extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aOptionsDonneesListeCompetences) {
		super(aDonnees);
		this.optionsCompetencesGrilles = {
			avecFusionClasses: aOptionsDonneesListeCompetences.avecFusionClasses,
			avecCreationParSaisieDirecte:
				aOptionsDonneesListeCompetences.avecCreationParSaisieDirecte,
			surDeplacer: aOptionsDonneesListeCompetences.surDeplacer,
		};
		this.setOptions({
			avecEtatSaisie: false,
			avecEvnt_Selection: true,
			avecEvnt_Creation:
				!this.optionsCompetencesGrilles.avecCreationParSaisieDirecte,
			avecEvnt_ApresCreation:
				this.optionsCompetencesGrilles.avecCreationParSaisieDirecte,
		});
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences_Grilles.colonnes.nbCompetences:
			case DonneesListe_Competences_Grilles.colonnes.nbItems:
				return "AlignementDroit";
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences_Grilles.colonnes.lve:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	surCreation(D, V) {
		const lLibelle = V[0];
		D.setLibelle(lLibelle);
	}
	avecEvenementEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_Competences_Grilles.colonnes.classes &&
			this.avecEdition(aParams)
		);
	}
	avecEvenementApresEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_Competences_Grilles.colonnes.libelle ||
			aParams.idColonne === DonneesListe_Competences_Grilles.colonnes.lve
		);
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences_Grilles.colonnes.libelle:
				return !!aParams.article.libelleEditable;
			case DonneesListe_Competences_Grilles.colonnes.classes:
				return !!aParams.article.estClassesEditable;
			case DonneesListe_Competences_Grilles.colonnes.lve:
				return !!aParams.article.estLVEEditable;
		}
		return false;
	}
	surEdition(aParams, V) {
		aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		switch (aParams.idColonne) {
			case DonneesListe_Competences_Grilles.colonnes.libelle:
				aParams.article.Libelle = V;
				break;
			case DonneesListe_Competences_Grilles.colonnes.lve:
				aParams.article.estLVE = V;
				break;
		}
	}
	avecEvenementSuppression() {
		return true;
	}
	avecInterruptionSuppression() {
		return true;
	}
	suppressionConfirmation() {
		return false;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences_Grilles.colonnes.libelle:
				return !!aParams.article.getLibelle()
					? aParams.article.getLibelle()
					: "";
			case DonneesListe_Competences_Grilles.colonnes.nbCompetences:
				return !!aParams.article.nbCompetences
					? aParams.article.nbCompetences
					: "";
			case DonneesListe_Competences_Grilles.colonnes.nbItems:
				return !!aParams.article.nbItems ? aParams.article.nbItems : "";
			case DonneesListe_Competences_Grilles.colonnes.classes:
				return !!aParams.article.strListeClasses
					? ObjetChaine_1.GChaine.insecable(aParams.article.strListeClasses)
					: "";
			case DonneesListe_Competences_Grilles.colonnes.lve:
				return !!aParams.article.estLVE;
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences_Grilles.colonnes.classes:
				return aParams.article.hintListeClasses || "";
		}
		return "";
	}
	surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		if (this.optionsCompetencesGrilles.surDeplacer) {
			this.optionsCompetencesGrilles.surDeplacer(
				aParamsSource.article,
				aParamsLigneDestination.article,
			);
		}
	}
	fusionCelluleAvecLignePrecedente(aParams) {
		if (
			aParams.idColonne === DonneesListe_Competences_Grilles.colonnes.classes
		) {
			return !!this.optionsCompetencesGrilles.avecFusionClasses;
		}
		return false;
	}
}
exports.DonneesListe_Competences_Grilles = DonneesListe_Competences_Grilles;
DonneesListe_Competences_Grilles.colonnes = {
	libelle: "competence_grilles_libelle",
	nbCompetences: "competence_grilles_nbCompetences",
	nbItems: "competence_grilles_nbItems",
	classes: "competence_grilles_classes",
	lve: "competence_grilles_lve",
};
