const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	EGenreRessource,
	EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
class DonneesListe_AbsencesEtRetards extends ObjetDonneesListe {
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
				return ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_AbsencesEtRetards.colonnes.ouverte:
			case DonneesListe_AbsencesEtRetards.colonnes.regleeAdm:
				return ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		if (aParams.article) {
			switch (aParams.idColonne) {
				case DonneesListe_AbsencesEtRetards.colonnes.type: {
					const lHtml = [];
					const lClassIcon = EGenreRessourceUtil.getNomImageAbsence(
						aParams.article.getGenre(),
						{ justifie: aParams.article.justifie },
					);
					lHtml.push('<i class="Texte12 ', lClassIcon, '"></i>');
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
		const lDateDebut = GDate.formatDate(D.DateDebut, "%JJ/%MM");
		const lDateFin = GDate.formatDate(D.DateFin, "%JJ/%MM");
		const lHeureDebut = GDate.formatDate(D.DateDebut, "%hh%sh%mm");
		const lHeureFin = GDate.formatDate(D.DateFin, "%hh%sh%mm");
		switch (D.getGenre()) {
			case EGenreRessource.Absence: {
				let lResult;
				if (lDateDebut === lDateFin) {
					lResult = GTraductions.getValeur(
						"Dates.LeDateDebutDeHeureDebutAHeureFin",
						[lDateDebut, lHeureDebut, lHeureFin],
					);
				} else {
					lResult = GTraductions.getValeur(
						"Dates.DuDateDebutAHeureDebutAuDateFinAHeureFin",
						[lDateDebut, lHeureDebut, lDateFin, lHeureFin],
					);
				}
				return lResult;
			}
			case EGenreRessource.Retard:
				return GTraductions.getValeur("Dates.LeDateDebutAHeureDebut", [
					lDateDebut,
					lHeureDebut,
				]);
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (aColonneDeTri === null || aColonneDeTri === undefined) {
			return [];
		}
		const lTris = [];
		let i;
		for (i = 0; i < aColonneDeTri.length; i++) {
			if (aColonneDeTri[i] === 4) {
				lTris.push(ObjetTri.init("DateDebut", aGenreTri[i]));
				lTris.push(ObjetTri.init("DateFin", aGenreTri[i]));
			} else {
				lTris.push(
					ObjetTri.init(
						this.getValeurPourTri.bind(this, aColonneDeTri[i]),
						aGenreTri[i],
					),
				);
			}
		}
		lTris.push(ObjetTri.init(this.getValeurPourTri.bind(this, 1)));
		lTris.push(ObjetTri.init("DateDebut"));
		lTris.push(ObjetTri.init("DateFin"));
		return lTris;
	}
	getValeurPourTri(aColonne, D) {
		const lParams = this.paramsListe.getParams(aColonne, -1, { surTri: true });
		switch (aColonne) {
			case DonneesListe_AbsencesEtRetards.genreColonne.motifs:
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
DonneesListe_AbsencesEtRetards.colonnes = {
	type: "AbsencesEtRetards_type",
	eleve: "AbsencesEtRetards_eleve",
	classe: "AbsencesEtRetards_classe",
	regime: "AbsencesEtRetards_regime",
	date: "AbsencesEtRetards_date",
	motifs: "AbsencesEtRetards_motifs",
	matieres: "AbsencesEtRetards_matieres",
	ouverte: "AbsencesEtRetards_ouverte",
	regleeAdm: "AbsencesEtRetards_regleeAdm",
};
DonneesListe_AbsencesEtRetards.genreColonne = {
	type: 0,
	eleve: 1,
	classe: 2,
	regime: 3,
	date: 4,
	motifs: 5,
	matieres: 6,
	ouverte: 7,
	regleeAdm: 8,
};
module.exports = { DonneesListe_AbsencesEtRetards };
