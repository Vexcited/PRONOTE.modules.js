exports.DonneesListe_AbsencesEtRetards = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class DonneesListe_AbsencesEtRetards extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aAvecSaisieRA) {
		super(aDonnees);
		this.avecSaisieRA = aAvecSaisieRA;
		this.setOptions({ avecSuppression: false });
	}
	avecEdition(aParams) {
		return (
			!!this.avecSaisieRA &&
			aParams.idColonne === DonneesListe_AbsencesEtRetards.colonnes.regleeAdm
		);
	}
	getClassCelluleConteneur(aParams) {
		return aParams.idColonne ===
			DonneesListe_AbsencesEtRetards.colonnes.regleeAdm
			? "AvecMain"
			: "";
	}
	getClass(aParams) {
		const lClass = [];
		if (aParams.idColonne === DonneesListe_AbsencesEtRetards.colonnes.type) {
			lClass.push("AlignementMilieu");
		}
		return lClass.join(" ");
	}
	avecMenuContextuel() {
		return false;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesEtRetards.colonnes.type:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_AbsencesEtRetards.colonnes.ouverte:
			case DonneesListe_AbsencesEtRetards.colonnes.regleeAdm:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		if (aParams.article) {
			switch (aParams.idColonne) {
				case DonneesListe_AbsencesEtRetards.colonnes.type: {
					const lHtml = [];
					const lClassIcon =
						Enumere_Ressource_1.EGenreRessourceUtil.getNomImageAbsence(
							aParams.article.getGenre(),
							{ justifie: aParams.article.justifie },
						);
					lHtml.push(
						'<i class="Texte12 ',
						lClassIcon,
						'"  role="img" aria-label=',
						Enumere_Ressource_1.EGenreRessource[aParams.article.getGenre()],
						"></i>",
					);
					return lHtml.join("");
				}
				case DonneesListe_AbsencesEtRetards.colonnes.eleve:
					return aParams.article.eleve.getLibelle();
				case DonneesListe_AbsencesEtRetards.colonnes.classe:
					return aParams.article.classe.getLibelle();
				case DonneesListe_AbsencesEtRetards.colonnes.regime:
					return aParams.article.regime.getLibelle();
				case DonneesListe_AbsencesEtRetards.colonnes.date:
					return this.getDate(aParams.article);
				case DonneesListe_AbsencesEtRetards.colonnes.motifs:
					return !!aParams.article.listeMotifs &&
						!!aParams.article.listeMotifs.getPremierElement()
						? aParams.article.listeMotifs.getPremierElement().getLibelle() || ""
						: "";
				case DonneesListe_AbsencesEtRetards.colonnes.matieres: {
					const lMatieres = [];
					let lStrMatieres;
					if (!!aParams.article.listeMatieres) {
						aParams.article.listeMatieres.parcourir((aElt) => {
							lMatieres.push(aElt.getLibelle());
						});
						lStrMatieres = lMatieres.join(", ");
					} else {
						lStrMatieres = "";
					}
					return !!aParams.article.matiere
						? aParams.article.matiere.getLibelle()
						: lStrMatieres;
				}
				case DonneesListe_AbsencesEtRetards.colonnes.ouverte:
					return aParams.article.EstOuverte;
				case DonneesListe_AbsencesEtRetards.colonnes.regleeAdm:
					return aParams.article.reglee;
			}
		}
		return "";
	}
	getDate(D) {
		const lDateDebut = ObjetDate_1.GDate.formatDate(D.DateDebut, "%JJ/%MM");
		const lDateFin = ObjetDate_1.GDate.formatDate(D.DateFin, "%JJ/%MM");
		const lHeureDebut = ObjetDate_1.GDate.formatDate(D.DateDebut, "%hh%sh%mm");
		const lHeureFin = ObjetDate_1.GDate.formatDate(D.DateFin, "%hh%sh%mm");
		switch (D.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.Absence: {
				let lResult;
				if (lDateDebut === lDateFin) {
					lResult = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.LeDateDebutDeHeureDebutAHeureFin",
						[lDateDebut, lHeureDebut, lHeureFin],
					);
				} else {
					lResult = ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DuDateDebutAHeureDebutAuDateFinAHeureFin",
						[lDateDebut, lHeureDebut, lDateFin, lHeureFin],
					);
				}
				return lResult;
			}
			case Enumere_Ressource_1.EGenreRessource.Retard:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Dates.LeDateDebutAHeureDebut",
					[lDateDebut, lHeureDebut],
				);
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (aColonneDeTri === null || aColonneDeTri === undefined) {
			return [];
		}
		const lTris = [];
		for (let i = 0; i < aColonneDeTri.length; i++) {
			if (
				aColonneDeTri[i] === DonneesListe_AbsencesEtRetards.genreColonne.date
			) {
				lTris.push(ObjetTri_1.ObjetTri.init("DateDebut", aGenreTri[i]));
				lTris.push(ObjetTri_1.ObjetTri.init("DateFin", aGenreTri[i]));
			} else {
				lTris.push(
					ObjetTri_1.ObjetTri.init(
						this.getValeurPourTri.bind(this, aColonneDeTri[i]),
						aGenreTri[i],
					),
				);
			}
		}
		return lTris;
	}
	getValeurPourTri(aColonne, D) {
		const lParams = this.paramsListe.getParams(aColonne, -1, {
			surTri: true,
			article: D,
		});
		const lIdColonne = this.getId(aColonne);
		switch (lIdColonne) {
			case DonneesListe_AbsencesEtRetards.colonnes.motifs:
				if (D.listeMotifs && D.listeMotifs.getPremierElement()) {
					return D.listeMotifs.getPremierElement().estMotifNonEncoreConnu
						? ""
						: D.listeMotifs.getPremierElement().getLibelle();
				} else {
					return this.getValeur(lParams);
				}
			default:
				return this.getValeur(lParams);
		}
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_AbsencesEtRetards.colonnes.regleeAdm:
				aParams.article.reglee = V;
				break;
		}
	}
}
exports.DonneesListe_AbsencesEtRetards = DonneesListe_AbsencesEtRetards;
(function (DonneesListe_AbsencesEtRetards) {
	let colonnes;
	(function (colonnes) {
		colonnes["type"] = "AbsencesEtRetards_type";
		colonnes["eleve"] = "AbsencesEtRetards_eleve";
		colonnes["classe"] = "AbsencesEtRetards_classe";
		colonnes["regime"] = "AbsencesEtRetards_regime";
		colonnes["date"] = "AbsencesEtRetards_date";
		colonnes["motifs"] = "AbsencesEtRetards_motifs";
		colonnes["matieres"] = "AbsencesEtRetards_matieres";
		colonnes["ouverte"] = "AbsencesEtRetards_ouverte";
		colonnes["regleeAdm"] = "AbsencesEtRetards_regleeAdm";
	})(
		(colonnes =
			DonneesListe_AbsencesEtRetards.colonnes ||
			(DonneesListe_AbsencesEtRetards.colonnes = {})),
	);
	let genreColonne;
	(function (genreColonne) {
		genreColonne[(genreColonne["type"] = 0)] = "type";
		genreColonne[(genreColonne["eleve"] = 1)] = "eleve";
		genreColonne[(genreColonne["classe"] = 2)] = "classe";
		genreColonne[(genreColonne["regime"] = 3)] = "regime";
		genreColonne[(genreColonne["date"] = 4)] = "date";
		genreColonne[(genreColonne["motifs"] = 5)] = "motifs";
		genreColonne[(genreColonne["matieres"] = 6)] = "matieres";
		genreColonne[(genreColonne["ouverte"] = 7)] = "ouverte";
		genreColonne[(genreColonne["regleeAdm"] = 8)] = "regleeAdm";
	})(
		(genreColonne =
			DonneesListe_AbsencesEtRetards.genreColonne ||
			(DonneesListe_AbsencesEtRetards.genreColonne = {})),
	);
})(
	DonneesListe_AbsencesEtRetards ||
		(exports.DonneesListe_AbsencesEtRetards = DonneesListe_AbsencesEtRetards =
			{}),
);
