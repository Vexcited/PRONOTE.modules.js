exports.DonneesListe_RubriqueOrientation = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDate_1 = require("ObjetDate");
const TypeRubriqueOrientation_1 = require("TypeRubriqueOrientation");
const GlossaireOrientation_1 = require("GlossaireOrientation");
class DonneesListe_RubriqueOrientation extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aDonneesComplementaires = {}) {
		super(aDonnees);
		this.setOptions({
			avecSelection: true,
			avecEvnt_SelectionClick: true,
			avecTri: false,
			avecEllipsis: false,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.titre;
	}
	getInfosSuppZonePrincipale(aParams) {
		const lEstIntention =
			aParams.article.getGenre() ===
			TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_IntentionFamille;
		const C_FormatDate = "%JJ %MMMM";
		return IE.jsx.str(
			"ul",
			null,
			IE.jsx.str(
				"li",
				{ class: "with-action" },
				aParams.article.dateDebutRubrique &&
					aParams.article.dateFinRubrique &&
					GlossaireOrientation_1.TradGlossaireOrientation.ARenseignerDuAu.format(
						[
							ObjetDate_1.GDate.formatDate(
								aParams.article.dateDebutRubrique,
								C_FormatDate,
							),
							ObjetDate_1.GDate.formatDate(
								aParams.article.dateFinRubrique,
								C_FormatDate,
							),
						],
					),
			),
			IE.jsx.str(
				"li",
				{ class: "with-action" },
				aParams.article.dateConseil
					? lEstIntention
						? GlossaireOrientation_1.TradGlossaireOrientation.AvisProvisoireDonneLe.format(
								[
									ObjetDate_1.GDate.formatDate(
										aParams.article.dateConseil,
										C_FormatDate,
									),
								],
							)
						: GlossaireOrientation_1.TradGlossaireOrientation.PropositionDonneLe.format(
								[
									ObjetDate_1.GDate.formatDate(
										aParams.article.dateConseil,
										C_FormatDate,
									),
								],
							)
					: "",
			),
			IE.jsx.str(
				"li",
				{ class: "with-action" },
				aParams.article.dateRetourFamille && aParams.article.donneesAR
					? lEstIntention
						? GlossaireOrientation_1.TradGlossaireOrientation.RetourLe.format([
								ObjetDate_1.GDate.formatDate(
									aParams.article.dateRetourFamille,
									C_FormatDate,
								),
							])
						: GlossaireOrientation_1.TradGlossaireOrientation.ReponseLe.format([
								ObjetDate_1.GDate.formatDate(
									aParams.article.dateRetourFamille,
									C_FormatDate,
								),
							])
					: "",
			),
			IE.jsx.str(
				"li",
				{ class: "with-action" },
				aParams.article.getGenre() ===
					TypeRubriqueOrientation_1.TypeRubriqueOrientation
						.RO_DecisionRetenue && aParams.article.dateDebutRubrique
					? GlossaireOrientation_1.TradGlossaireOrientation.DecisionRetenueLe.format(
							[
								ObjetDate_1.GDate.formatDate(
									aParams.article.dateDebutRubrique,
									C_FormatDate,
								),
							],
						)
					: "",
			),
		);
	}
	avecEvenementSelectionClick(aParams) {
		return true;
	}
	getVisible(D) {
		return D.estVisible;
	}
}
exports.DonneesListe_RubriqueOrientation = DonneesListe_RubriqueOrientation;
