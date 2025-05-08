const { GDate } = require("ObjetDate.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
class DonneesListe_AutresEvenements extends ObjetDonneesListe {
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
	getCouleurCellule(aParams) {
		if (
			this.options.avecDeploiement &&
			aParams.article &&
			aParams.article.estUnDeploiement
		) {
			return ObjetDonneesListe.ECouleurCellule.Deploiement;
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
					return GDate.formatDate(
						aParams.article.date,
						GTraductions.getValeur("Dates.LeDate", ["%JJ/%MM/%AAAA"]),
					);
				} else {
					return GDate.formatDate(
						aParams.article.date,
						GTraductions.getValeur("Dates.LeDateDebutAHeureDebut", [
							"%JJ/%MM/%AAAA",
							"%hh%sh%mm",
						]),
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
					? GChaine.replaceRCToHTML(aParams.article.commentaire)
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
				return ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_AutresEvenements.colonnes.commentaire:
				return ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_AutresEvenements.colonnes.vu:
				return ObjetDonneesListe.ETypeCellule.Date;
			default:
				return ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [ObjetTri.initRecursif("pere", [ObjetTri.init("Libelle")])];
		let lId;
		if (aColonneDeTri !== null && aColonneDeTri !== undefined) {
			lId = this.getId(aColonneDeTri);
			switch (lId) {
				case DonneesListe_AutresEvenements.colonnes.type:
					lTris.push(
						ObjetTri.init((D) => {
							return D.rubrique ? D.rubrique.Libelle : "";
						}, aGenreTri),
					);
					break;
				case DonneesListe_AutresEvenements.colonnes.date:
					lTris.push(ObjetTri.init("date", aGenreTri));
					break;
				default:
					lTris.push(
						ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							aGenreTri,
						),
					);
					break;
			}
		}
		if (lId !== DonneesListe_AutresEvenements.colonnes.date) {
			lTris.push(ObjetTri.init("date", EGenreTriElement.Decroissant));
		}
		lTris.push(ObjetTri.init("strIndividu", EGenreTriElement.Croissant));
		return lTris;
	}
}
DonneesListe_AutresEvenements.colonnes = {
	type: "vs_autresEv_type",
	date: "vs_autresEv_date",
	matiereEtProf: "vs_autresEv_MatEtProf",
	commentaire: "vs_autresEv_comment",
	publie: "vs_autresEv_publie",
	vu: "vs_autresEv_vu",
};
DonneesListe_AutresEvenements.options = {
	hauteurAdapteContenu: true,
	piedDeListe: null,
};
function _getColonnes(aAvecCumul) {
	const lColonnes = [];
	const lWidthCumul = aAvecCumul ? 0 : 60;
	lColonnes.push({
		id: DonneesListe_AutresEvenements.colonnes.type,
		taille: ObjetListe.initColonne(30, 120, 200),
		titre: {
			libelle: GTraductions.getValeur("CarnetCorrespondance.TypeDObservation"),
		},
	});
	lColonnes.push({
		id: DonneesListe_AutresEvenements.colonnes.date,
		taille: 125,
		titre: { libelle: GTraductions.getValeur("Date") },
	});
	lColonnes.push({
		id: DonneesListe_AutresEvenements.colonnes.matiereEtProf,
		taille: ObjetListe.initColonne(30, 220 - lWidthCumul, 350),
		titre: {
			libelle: GTraductions.getValeur(
				"CarnetCorrespondance.MatiereEtProfesseur",
			),
		},
	});
	lColonnes.push({
		id: DonneesListe_AutresEvenements.colonnes.commentaire,
		taille: ObjetListe.initColonne(70, 220 - lWidthCumul, 720),
		titre: {
			libelle: GTraductions.getValeur("CarnetCorrespondance.Commentaire"),
		},
	});
	lColonnes.push({
		id: DonneesListe_AutresEvenements.colonnes.publie,
		taille: 20,
		titre: {
			title: GTraductions.getValeur("CarnetCorrespondance.Publie"),
			classeCssImage: "Image_Publie",
		},
	});
	lColonnes.push({
		id: DonneesListe_AutresEvenements.colonnes.vu,
		taille: 60,
		titre: { libelle: GTraductions.getValeur("CarnetCorrespondance.Vu") },
	});
	return lColonnes;
}
DonneesListe_AutresEvenements.getOptions = function (aAvecCumul) {
	const lResult = DonneesListe_AutresEvenements.options;
	lResult.colonnes = _getColonnes(aAvecCumul);
	lResult.colonnesCachees = aAvecCumul
		? [DonneesListe_AutresEvenements.colonnes.type]
		: [];
	lResult.avecDeploiement = aAvecCumul;
	return lResult;
};
module.exports = { DonneesListe_AutresEvenements };
