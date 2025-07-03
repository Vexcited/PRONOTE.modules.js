exports.DonneesListe_CoursNonAssures = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_CoursNonAssures extends ObjetDonneesListe_1.ObjetDonneesListe {
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
								? IE.jsx.str(
										IE.jsx.fragment,
										null,
										aParams.article.strMatiere,
										IE.jsx.str("i", {
											style: "float:right; font-size:1.4rem;",
											class: "icon_co_enseignement",
											"ie-tooltiplabel":
												ObjetTraduction_1.GTraductions.getValeur(
													"CoursNonAssures.CoEnseignement",
												),
											role: "img",
										}),
									)
								: aParams.article.strMatiere
							: ObjetTraduction_1.GTraductions.getValeur(
									"CoursNonAssures.SansSalle",
								);
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
					? ObjetDate_1.GDate.formatDate(
							aParams.article.dateDuCours,
							"%JJ/%MM/%AAAA",
						)
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
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_CoursNonAssures.colonnes.professeur:
				return ObjetTraduction_1.GTraductions.getValeur("Total");
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
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
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
exports.DonneesListe_CoursNonAssures = DonneesListe_CoursNonAssures;
(function (DonneesListe_CoursNonAssures) {
	let colonnes;
	(function (colonnes) {
		colonnes["professeur"] = "CoursNonAssures_professeur";
		colonnes["matiere"] = "CoursNonAssures_matiere";
		colonnes["classe"] = "CoursNonAssures_classe";
		colonnes["duree"] = "CoursNonAssures_duree";
		colonnes["date"] = "CoursNonAssures_date";
		colonnes["debut"] = "CoursNonAssures_debut";
		colonnes["aDonneLieu"] = "CoursNonAssures_aDonneLieu";
	})(
		(colonnes =
			DonneesListe_CoursNonAssures.colonnes ||
			(DonneesListe_CoursNonAssures.colonnes = {})),
	);
})(
	DonneesListe_CoursNonAssures ||
		(exports.DonneesListe_CoursNonAssures = DonneesListe_CoursNonAssures = {}),
);
