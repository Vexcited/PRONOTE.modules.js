exports.DonneesListe_Trombi = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_Trombi extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: true,
			avecEvnt_SelectionClick: true,
			avecTri: false,
			avecBoutonActionLigne: false,
			flatDesignMinimal: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getZoneGauche(aParams) {
		const H = [];
		H.push(this.composePhoto(aParams.article));
		return H.join("");
	}
	composePhoto(aEleve) {
		const H = [];
		let lAvecPhoto =
			!!aEleve &&
			GApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
			);
		H.push(
			IE.jsx.str(
				"figure",
				{ class: "identite-vignette" },
				IE.jsx.str("img", {
					"ie-load-src": lAvecPhoto
						? ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aEleve, {
								libelle: "photo.jpg",
							})
						: false,
					"ie-imgviewer": true,
					class: "img-portrait",
					alt: aEleve.getLibelle(),
					"data-libelle": aEleve.getLibelle(),
				}),
			),
		);
		return H.join("");
	}
	getTotal(aEstHeader) {
		if (aEstHeader) {
			const lNbLignes = this.Donnees.count();
			let lTitre = ObjetTraduction_1.GTraductions.getValeur("Eleve");
			if (lNbLignes) {
				lTitre =
					lNbLignes +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						lNbLignes > 1 ? "Etudiants" : "Etudiant",
					).toLowerCase();
			}
			return { getHtml: () => lTitre, avecEtiquette: false };
		}
	}
}
exports.DonneesListe_Trombi = DonneesListe_Trombi;
