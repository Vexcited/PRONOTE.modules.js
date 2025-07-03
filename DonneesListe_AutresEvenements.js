exports.DonneesListe_AutresEvenements = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
class DonneesListe_AutresEvenements extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecTri: true,
			avecDeploiement: true,
		});
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		return (
			aParams.article &&
			aParams.article.estUnDeploiement &&
			aParams.idColonne !== DonneesListe_AutresEvenements.colonnes.date
		);
	}
	getCouleurCellule(aParams, aCouleurCellule) {
		if (
			this.options.avecDeploiement &&
			aParams.article &&
			aParams.article.estUnDeploiement
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.article.estUnDeploiement &&
			aParams.idColonne === DonneesListe_AutresEvenements.colonnes.date
		);
	}
	getValeur(aParams) {
		let lText;
		if (aParams.article && aParams.article.estUnDeploiement) {
			lText = aParams.article.getLibelle() || "";
			if (aParams.article.count > 0 && lText) {
				lText += " (" + aParams.article.count + ")";
			}
			return lText;
		}
		switch (aParams.idColonne) {
			case DonneesListe_AutresEvenements.colonnes.type:
				return aParams.article &&
					aParams.article.rubrique &&
					aParams.article.rubrique.getLibelle()
					? aParams.article.rubrique.getLibelle()
					: "";
			case DonneesListe_AutresEvenements.colonnes.date:
				if (aParams.article.date && aParams.article.date.getHours() === 0) {
					return ObjetDate_1.GDate.formatDate(
						aParams.article.date,
						ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
							"%JJ/%MM/%AAAA",
						]),
					);
				} else {
					return ObjetDate_1.GDate.formatDate(
						aParams.article.date,
						ObjetTraduction_1.GTraductions.getValeur(
							"Dates.LeDateDebutAHeureDebut",
							["%JJ/%MM/%AAAA", "%hh%sh%mm"],
						),
					);
				}
			case DonneesListe_AutresEvenements.colonnes.matiereEtProf:
				lText = "";
				if (aParams.article && aParams.article.strMatiere) {
					lText += aParams.article.strMatiere;
				}
				if (aParams.article && aParams.article.strIndividu) {
					if (lText) {
						lText += " - ";
					}
					lText += aParams.article.strIndividu;
				}
				return lText;
			case DonneesListe_AutresEvenements.colonnes.commentaire:
				return aParams.article && aParams.article.commentaire
					? ObjetChaine_1.GChaine.replaceRCToHTML(aParams.article.commentaire)
					: "";
			case DonneesListe_AutresEvenements.colonnes.publie:
				return aParams.article ? aParams.article.estPublie : false;
			case DonneesListe_AutresEvenements.colonnes.vu:
				return aParams.article && aParams.article.dateVue
					? aParams.article.dateVue
					: "";
			default:
				return "";
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AutresEvenements.colonnes.publie:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_AutresEvenements.colonnes.commentaire:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_AutresEvenements.colonnes.vu:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Date;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("Libelle"),
			]),
		];
		let lId;
		if (aColonneDeTri !== null && aColonneDeTri !== undefined) {
			lId = this.getId(aColonneDeTri);
			switch (lId) {
				case DonneesListe_AutresEvenements.colonnes.type:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.rubrique ? D.rubrique.Libelle : "";
						}, aGenreTri),
					);
					break;
				case DonneesListe_AutresEvenements.colonnes.date:
					lTris.push(ObjetTri_1.ObjetTri.init("date", aGenreTri));
					break;
				default:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							aGenreTri,
						),
					);
					break;
			}
		}
		if (lId !== DonneesListe_AutresEvenements.colonnes.date) {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					"date",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			);
		}
		lTris.push(
			ObjetTri_1.ObjetTri.init(
				"strIndividu",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
		);
		return lTris;
	}
}
exports.DonneesListe_AutresEvenements = DonneesListe_AutresEvenements;
(function (DonneesListe_AutresEvenements) {
	let colonnes;
	(function (colonnes) {
		colonnes["type"] = "vs_autresEv_type";
		colonnes["date"] = "vs_autresEv_date";
		colonnes["matiereEtProf"] = "vs_autresEv_MatEtProf";
		colonnes["commentaire"] = "vs_autresEv_comment";
		colonnes["publie"] = "vs_autresEv_publie";
		colonnes["vu"] = "vs_autresEv_vu";
	})(
		(colonnes =
			DonneesListe_AutresEvenements.colonnes ||
			(DonneesListe_AutresEvenements.colonnes = {})),
	);
})(
	DonneesListe_AutresEvenements ||
		(exports.DonneesListe_AutresEvenements = DonneesListe_AutresEvenements =
			{}),
);
