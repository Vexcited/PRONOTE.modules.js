exports.DonneesListe_SelecteurMembre = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Espace_1 = require("Enumere_Espace");
class DonneesListe_SelecteurMembre extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.applicationScoMobile = GApplication;
		this.setOptions({
			avecEvnt_SelectionClick: true,
			avecTri: false,
			avecEllipsis: false,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getInfosSuppZonePrincipale(aParams) {
		var _a;
		return aParams.article.pourAppli
			? ""
			: (_a = aParams.article) === null || _a === void 0
				? void 0
				: _a.Classe.getLibelle();
	}
	getZoneGauche(aParams) {
		return this.composePhoto(aParams.article);
	}
	avecSelection(aParams) {
		return true;
	}
	avecEvenementSelection(aParams) {
		return this.avecSelection(aParams);
	}
	composePhoto(aMembre) {
		if (aMembre.pourAppli) {
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"figure",
					{ class: "identite-appli" },
					IE.jsx.str("i", { class: "icon_user" }),
				),
			);
		} else {
			let lAvecPhoto = !!aMembre;
			if (
				[
					Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				].includes(this.applicationScoMobile.getEtatUtilisateur().GenreEspace)
			) {
				lAvecPhoto = this.applicationScoMobile.droits.get(
					ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
				);
			}
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"figure",
					{ class: "identite-vignette" },
					IE.jsx.str("img", {
						"ie-load-src":
							lAvecPhoto && `data:image/png;base64,${aMembre.photoBase64}`,
						alt: ObjetTraduction_1.GTraductions.getValeur(
							"PhotoDe_S",
							aMembre === null || aMembre === void 0
								? void 0
								: aMembre.getLibelle(),
						),
						class: "img-portrait",
						"aria-hidden": "true",
					}),
				),
			);
		}
	}
}
exports.DonneesListe_SelecteurMembre = DonneesListe_SelecteurMembre;
