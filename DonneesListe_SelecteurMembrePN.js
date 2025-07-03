exports.DonneesListe_SelecteurMembrePN = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Espace_1 = require("Enumere_Espace");
const DonneesListe_SelecteurMembreCP_1 = require("DonneesListe_SelecteurMembreCP");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_SelecteurMembrePN extends DonneesListe_SelecteurMembreCP_1.DonneesListe_SelecteurMembreCP {
	constructor(aDonnees) {
		super(aDonnees);
		this.applicationScoMobile = GApplication;
	}
	getInfosSuppZonePrincipale(aParams) {
		var _a;
		return aParams.article.pourAppli
			? ""
			: (_a = aParams.article) === null || _a === void 0
				? void 0
				: _a.Classe.getLibelle();
	}
	composePhoto(aMembre) {
		if (aMembre.pourAppli) {
			return this.getHtmlPhotoAppli();
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
			return this.getHtmlPhoto(aMembre, lAvecPhoto);
		}
	}
	getHtmlPhoto(aMembre, aAvecPhoto) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"figure",
				{ class: "identite-vignette" },
				IE.jsx.str("img", {
					"ie-load-src":
						aAvecPhoto && `data:image/png;base64,${aMembre.photoBase64}`,
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
exports.DonneesListe_SelecteurMembrePN = DonneesListe_SelecteurMembrePN;
