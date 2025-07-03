exports.DonneesListe_FicheBrevetCompetence = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class DonneesListe_FicheBrevetCompetence extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aCompetences, aParam) {
		super(aCompetences.listePiliers);
		this.competences = aCompetences;
		this.callbackMenuContextuel = aParam.callBackMenuContextuel;
		this.setOptions({ avecSuppression: false, editionApresSelection: false });
	}
	avecSelection() {
		return !GEtatUtilisateur.estEspacePourEleve();
	}
	avecEdition(aParams) {
		if (
			aParams.idColonne === DonneesListe_FicheBrevetCompetence.colonnes.maitrise
		) {
			return !!aParams.article.avecEdition;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		return (
			aParams.idColonne ===
				DonneesListe_FicheBrevetCompetence.colonnes.maitrise &&
			aParams.article.avecEdition
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetCompetence.colonnes.competences:
				return aParams.article.getLibelle();
			case DonneesListe_FicheBrevetCompetence.colonnes.maitrise:
				return aParams.article.niveauDAcquisition.getLibelle();
			case DonneesListe_FicheBrevetCompetence.colonnes.points:
				return aParams.article.points.getNoteEntier();
			case DonneesListe_FicheBrevetCompetence.colonnes.bareme:
				return aParams.article.bareme.getNoteEntier();
		}
		return "";
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetCompetence.colonnes.competences:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.TotalDesPoints",
				);
			case DonneesListe_FicheBrevetCompetence.colonnes.points:
				return this.competences.totalPoints.getNoteEntier();
			case DonneesListe_FicheBrevetCompetence.colonnes.bareme:
				return this.competences.totalBareme.getNoteEntier();
		}
		return "";
	}
	getClassTotal(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetCompetence.colonnes.points:
			case DonneesListe_FicheBrevetCompetence.colonnes.bareme:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_FicheBrevetCompetence.colonnes.points:
			case DonneesListe_FicheBrevetCompetence.colonnes.bareme:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.setOptions({
			largeurMin: 150,
			largeurColonneGauche: 30,
		});
		const lListe =
			UtilitaireCompetences_1.TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu(
				{
					genreChoixValidationCompetence:
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_Competence,
					avecDispense: aParametres.article.estPilierLVE,
				},
			);
		if (lListe) {
			lListe.parcourir((aElement) => {
				if (aElement.existe()) {
					aParametres.menuContextuel.add(
						aElement.tableauLibelles || aElement.getLibelle(),
						aElement.actif !== false &&
							!!aParametres.article &&
							!!aParametres.article.avecEdition,
						() => {
							this.callbackMenuContextuel(aElement, aParametres.ligne);
						},
						{
							image: aElement.image,
							imageFormate: true,
							largeurImage: aElement.largeurImage,
						},
					);
				}
			});
			aParametres.menuContextuel.setDonnees();
		}
	}
}
exports.DonneesListe_FicheBrevetCompetence = DonneesListe_FicheBrevetCompetence;
(function (DonneesListe_FicheBrevetCompetence) {
	let colonnes;
	(function (colonnes) {
		colonnes["competences"] = "FicheBrevetCompetence";
		colonnes["maitrise"] = "FicheBrevetCompetenceMaitrise";
		colonnes["points"] = "FicheBrevetCompetencePoints";
		colonnes["bareme"] = "FicheBrevetCompetenceBareme";
	})(
		(colonnes =
			DonneesListe_FicheBrevetCompetence.colonnes ||
			(DonneesListe_FicheBrevetCompetence.colonnes = {})),
	);
})(
	DonneesListe_FicheBrevetCompetence ||
		(exports.DonneesListe_FicheBrevetCompetence =
			DonneesListe_FicheBrevetCompetence =
				{}),
);
