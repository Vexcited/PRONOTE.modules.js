exports.DonneesListe_OffresStages = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDate_1 = require("ObjetDate");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
class DonneesListe_OffresStages extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.autoriserEditionToutesOffresStages =
			aParams.autoriserEditionToutesOffresStages;
		this.setOptions({
			avecSelection: true,
			avecBoutonActionLigne: true,
			avecEvnt_SelectionClick: true,
			avecEvnt_Selection: false,
			avecEvnt_Creation: true,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.sujet.getLibelle();
	}
	getInfosSuppZonePrincipale(aParams) {
		var _a;
		if (
			((_a = aParams.article.periodes) === null || _a === void 0
				? void 0
				: _a.count()) > 0
		) {
			let FormatDateDebut = ObjetDate_1.GDate.formatDate(
				aParams.article.periodes.getPremierElement().dateDebut,
				"%JJ/%MM/%AAAA",
			);
			let FormatDateFin = ObjetDate_1.GDate.formatDate(
				aParams.article.periodes.getPremierElement().dateFin,
				"%JJ/%MM/%AAAA",
			);
			return IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"span",
					null,
					aParams.article.periodes.count() > 0
						? ObjetTraduction_1.GTraductions.getValeur(
								aParams.article.periodes.count() > 1
									? "OffreStage.DuAu3points"
									: "OffreStage.DuAu",
								[FormatDateDebut, FormatDateFin],
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"OffreStage.aucunePeriodeImposee",
							),
				),
			);
		} else {
			return IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"span",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.aucunePeriodeImposee",
					),
				),
			);
		}
	}
	getZoneGauche(aParams) {
		let H = [];
		H.push(`<div >`);
		if (aParams.article.estPublie) {
			H.push(
				IE.jsx.str("i", {
					class: "icon_ok m-l",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.EditInterdit_Publie",
					),
					role: "img",
				}),
			);
		} else {
			H.push(
				IE.jsx.str("i", {
					class: "icon_edt_permanence m-l",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.NonPublie",
					),
					role: "img",
				}),
			);
		}
		H.push(`</div>`);
		return H.join("");
	}
	avecMenuContextuel(aParams) {
		return this.autoriserEditionToutesOffresStages || aParams.article.estAuteur;
	}
	initialisationObjetContextuel(aParams) {
		if (!aParams.menuContextuel) {
			return;
		}
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			!aParams.article.estPublie,
			function () {
				this.callback.appel({
					article: aParams.article,
					genreEvenement: Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
					estEnEdition: true,
				});
			},
			{ icon: "icon_pencil" },
		);
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			!aParams.article.estPublie,
			async function () {
				this.callback.appel({
					article: aParams.article,
					genreEvenement:
						Enumere_EvenementListe_1.EGenreEvenementListe.Suppression,
					estEnSuppression: true,
				});
			},
			{ icon: "icon_trash" },
		);
		aParams.menuContextuel.setDonnees();
	}
}
exports.DonneesListe_OffresStages = DonneesListe_OffresStages;
