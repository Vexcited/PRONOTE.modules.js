const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_CoursNonAssures extends ObjetDonneesListe {
	constructor(aDonnees, aOptions) {
		let lCumul = null;
		aDonnees.parcourir((D) => {
			if (D.estCategorie) {
				lCumul = D;
				D.estDeploye = true;
				D.estUnDeploiement = true;
			} else {
				D.pere = lCumul;
			}
		});
		super(aDonnees);
		this.optionsAffichage = Object.assign(
			{ avecCumulProfesseur: true },
			aOptions,
		);
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
			avecContenuTronque: true,
			avecTri: false,
		});
	}
	avecDeploiement() {
		return !!this.optionsAffichage.avecCumulProfesseur;
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			this.optionsAffichage.avecCumulProfesseur &&
			aParams.idColonne === DonneesListe_CoursNonAssures.colonnes.professeur
		);
	}
	getVisible(D) {
		if (!this.optionsAffichage.avecCumulProfesseur) {
			return !D.estUnDeploiement;
		}
		return true;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_CoursNonAssures.colonnes.professeur: {
				let result = "";
				if (this.optionsAffichage.avecCumulProfesseur) {
					result = aParams.article.estCategorie
						? aParams.article.strProf || ""
						: aParams.article.strMatiere
							? aParams.article.coEnseignement
								? aParams.article.strMatiere +
									'<i style="float:right; font-size:1.4rem;" class="icon_co_enseignement" ie-hint="\'' +
									GChaine.toTitle(
										GTraductions.getValeur("CoursNonAssures.CoEnseignement"),
									) +
									"'\"></i>"
								: aParams.article.strMatiere
							: GTraductions.getValeur("CoursNonAssures.SansSalle");
				} else {
					result = aParams.article.strProf || "";
				}
				return result;
			}
			case DonneesListe_CoursNonAssures.colonnes.matiere:
				return aParams.article.strMatiere || "";
			case DonneesListe_CoursNonAssures.colonnes.classe:
				return aParams.article.strClasse || "";
			case DonneesListe_CoursNonAssures.colonnes.duree:
				return aParams.article.StrDuree || "";
			case DonneesListe_CoursNonAssures.colonnes.debut:
				return aParams.article.strDebut || "";
			case DonneesListe_CoursNonAssures.colonnes.date:
				return aParams.article.dateDuCours
					? GDate.formatDate(aParams.article.dateDuCours, "%JJ/%MM/%AAAA")
					: "";
			case DonneesListe_CoursNonAssures.colonnes.aDonneLieu:
				return aParams.article.strRemplacement || "";
		}
		return "";
	}
	getTypeValeur(aParams) {
		if (
			aParams.idColonne === DonneesListe_CoursNonAssures.colonnes.professeur
		) {
			return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_CoursNonAssures.colonnes.professeur:
				return GTraductions.getValeur("Total");
			case DonneesListe_CoursNonAssures.colonnes.duree:
				return this.Donnees.total;
		}
		return "";
	}
	getClassTotal(aParams) {
		const lClasses = [];
		lClasses.push("Gras");
		if (aParams.idColonne === DonneesListe_CoursNonAssures.colonnes.duree) {
			lClasses.push("AlignementDroit");
		}
		return lClasses.join(" ");
	}
	getCouleurCellule(aParams) {
		if (aParams.article.estUnDeploiement) {
			return ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
	}
	getClass(aParams) {
		const lClasses = [];
		if (aParams.article.estUnDeploiement) {
			lClasses.push("Gras");
		}
		switch (aParams.idColonne) {
			case DonneesListe_CoursNonAssures.colonnes.duree:
				lClasses.push("AlignementDroit");
		}
		return lClasses.join(" ");
	}
}
DonneesListe_CoursNonAssures.colonnes = {
	professeur: "CoursNonAssures_professeur",
	matiere: "CoursNonAssures_matiere",
	classe: "CoursNonAssures_classe",
	duree: "CoursNonAssures_duree",
	date: "CoursNonAssures_date",
	debut: "CoursNonAssures_debut",
	aDonneLieu: "CoursNonAssures_aDonneLieu",
};
module.exports = DonneesListe_CoursNonAssures;
