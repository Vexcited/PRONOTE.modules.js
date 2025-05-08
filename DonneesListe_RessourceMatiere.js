exports.DonneesListe_RessourceMatiere = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const tag_1 = require("tag");
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
			? (0, tag_1.tag)("i", { class: "icon_th_large" })
			: (0, tag_1.tag)("div", {
					class: "couleur ie-line-color static only-color",
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
				H.push(
					(0, tag_1.tag)(
						"div",
						{ class: "compteur" },
						!isNaN(aParams.article.count)
							? aParams.article.count
							: !isNaN(aParams.article.nbElementsConcernes)
								? aParams.article.nbElementsConcernes
								: "",
					),
				);
			}
		}
		return H.join("");
	}
	getClassCelluleConteneur(aParams) {
		return aParams.article.getGenre() !== this.options.genreToutesMatieres
			? "matiere-spe"
			: "";
	}
}
exports.DonneesListe_RessourceMatiere = DonneesListe_RessourceMatiere;
