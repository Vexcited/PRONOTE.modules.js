exports.DonneesListe_Criteres = void 0;
const ChoixDestinatairesParCriteres_1 = require("ChoixDestinatairesParCriteres");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireDocumentATelecharger_1 = require("UtilitaireDocumentATelecharger");
class DonneesListe_Criteres extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListe) {
		super(aListe);
		this.setOptions({
			avecCB: true,
			avecCocheCBSurLigne: true,
			avecEventDeploiementSurCellule: true,
			avecBoutonActionLigne: false,
		});
	}
	avecCB(aParams) {
		var _a;
		if (
			DonneesListe_Criteres.isArticleFamille(aParams.article) &&
			((_a = aParams.article.infos) === null || _a === void 0
				? void 0
				: _a.estSousFamille) === false
		) {
			return false;
		}
		return super.avecCB(aParams);
	}
	getTitreZonePrincipale(aParams) {
		var _a;
		const lCouleur =
			DonneesListe_Criteres.isArticleAutorisationSortie(aParams.article) &&
			((_a = aParams.article.infos) === null || _a === void 0
				? void 0
				: _a.couleur);
		return IE.jsx.str(
			"div",
			{ class: ["flex-contain", "flex-gap"] },
			lCouleur &&
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getCouleurLigne(
					{ couleur: lCouleur },
				),
			this.getContenueZonePrincipale(aParams),
		);
	}
	getContenueZonePrincipale(aParams) {
		var _a, _b;
		switch (true) {
			case DonneesListe_Criteres.isArticleProjetAcc(aParams.article):
			case DonneesListe_Criteres.isArticleAutorisationSortie(aParams.article): {
				return IE.jsx.str(
					"p",
					null,
					aParams.article.getLibelle(),
					" ",
					((_a = aParams.article.infos) === null || _a === void 0
						? void 0
						: _a.code) &&
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							"(",
							IE.jsx.str(
								"span",
								null,
								(_b = aParams.article.infos) === null || _b === void 0
									? void 0
									: _b.code,
							),
							")",
						),
				);
			}
			default:
				return IE.jsx.str("p", null, aParams.article.getLibelle());
		}
	}
	getInfosSuppZonePrincipale(aParams) {
		var _a, _b, _c, _d, _e;
		switch (true) {
			case DonneesListe_Criteres.isArticleRegime(aParams.article): {
				const lLibelleRespas = this.getLibelleRepas(aParams.article);
				return IE.jsx.str(
					IE.jsx.fragment,
					null,
					((_a = aParams.article.infos) === null || _a === void 0
						? void 0
						: _a.code) &&
						IE.jsx.str(
							"p",
							null,
							ObjetTraduction_1.GTraductions.getValeur("Code"),
							": ",
							(_b = aParams.article.infos) === null || _b === void 0
								? void 0
								: _b.code,
						),
					lLibelleRespas && IE.jsx.str("p", null, lLibelleRespas),
					((_c = aParams.article.infos) === null || _c === void 0
						? void 0
						: _c.estInternat) &&
						IE.jsx.str(
							"p",
							null,
							ChoixDestinatairesParCriteres_1.TradChoixDestinatairesParCriteres
								.Internat,
						),
				);
			}
			case DonneesListe_Criteres.isArticleAutorisationSortie(aParams.article): {
				return IE.jsx.str(
					IE.jsx.fragment,
					null,
					(_e =
						(_d = aParams.article.infos) === null || _d === void 0
							? void 0
							: _d.listeDetailHoraires) === null || _e === void 0
						? void 0
						: _e.join(" "),
				);
			}
			default:
				return "";
		}
	}
	getZoneMessage(aParams) {
		var _a;
		switch (true) {
			case DonneesListe_Criteres.isArticleAutorisationSortie(aParams.article): {
				return (_a = aParams.article.infos) === null || _a === void 0
					? void 0
					: _a.descriptif;
			}
			default:
				return "";
		}
	}
	getLibelleRepas(aArticle) {
		if (aArticle.infos.estRepasMidi && aArticle.infos.estRepasSoir) {
			return ChoixDestinatairesParCriteres_1.TradChoixDestinatairesParCriteres
				.RepasMidiSoir;
		} else if (aArticle.infos.estRepasMidi) {
			return ChoixDestinatairesParCriteres_1.TradChoixDestinatairesParCriteres
				.RepasMidi;
		} else if (aArticle.infos.estRepasSoir) {
			return ChoixDestinatairesParCriteres_1.TradChoixDestinatairesParCriteres
				.RepasSoir;
		}
		return "";
	}
}
exports.DonneesListe_Criteres = DonneesListe_Criteres;
(function (DonneesListe_Criteres) {
	DonneesListe_Criteres.isArticleRegime = (aArticle) => {
		return (
			aArticle.typeCriteres ===
			ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_Regime
		);
	};
	DonneesListe_Criteres.isArticleFamille = (aArticle) => {
		return (
			aArticle.typeCriteres ===
			ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_LienFamille
		);
	};
	DonneesListe_Criteres.isArticleProjetAcc = (aArticle) => {
		return (
			aArticle.typeCriteres ===
			ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_ProjetAccompagnement
		);
	};
	DonneesListe_Criteres.isArticleAutorisationSortie = (aArticle) => {
		return (
			aArticle.typeCriteres ===
			ChoixDestinatairesParCriteres_1.TypeGenreCritereTelechargement
				.CTMDOC_AutorisationDeSortie
		);
	};
})(
	DonneesListe_Criteres ||
		(exports.DonneesListe_Criteres = DonneesListe_Criteres = {}),
);
