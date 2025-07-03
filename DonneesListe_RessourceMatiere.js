exports.DonneesListe_RessourceMatiere = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
class DonneesListe_RessourceMatiere extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_Selection: true,
			avecTri: false,
			flatDesignMinimal: true,
			avecBoutonActionLigne: false,
			genreToutesMatieres: -1,
		});
	}
	getZoneGauche(aParams) {
		return aParams.article.getGenre() === this.options.genreToutesMatieres
			? IE.jsx.str("i", { class: "icon_th_large", role: "presentation" })
			: IE.jsx.str("div", {
					class: "ie-line-color static only-color",
					style: aParams.article.couleurFond
						? `--color-line:${aParams.article.couleurFond};`
						: false,
				});
	}
	getZoneComplementaire(aParams) {
		const H = [];
		if (aParams.article.getGenre() !== this.options.genreToutesMatieres) {
			if (
				!isNaN(aParams.article.count) ||
				!isNaN(aParams.article.nbElementsConcernes)
			) {
				const lStrCompteur = !isNaN(aParams.article.count)
					? aParams.article.count
					: !isNaN(aParams.article.nbElementsConcernes)
						? aParams.article.nbElementsConcernes
						: "";
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str("div", { class: "compteur" }, lStrCompteur),
					),
				);
			}
		}
		return H.join("");
	}
}
exports.DonneesListe_RessourceMatiere = DonneesListe_RessourceMatiere;
