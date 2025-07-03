exports.DonneesListe_ModeleTravailAFaire_Fd = void 0;
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_ModeleTravailAFaire_Fd extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_Creation: true,
			avecBoutonActionLigne: true,
		});
	}
	initialisationObjetContextuel(aParams) {
		if (!aParams.menuContextuel) {
			return;
		}
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			!!aParams.article.Editable,
			function () {
				this.callback.appel({
					article: aParams.article,
					genreEvenement: Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
				});
			},
			{ icon: "icon_pencil" },
		);
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			!!aParams.article.Editable,
			async function () {
				const lGenreAction = await GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.ConfirmSuppressionCategorieCDT",
					),
				});
				if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					this.callback.appel({
						article: aParams.article,
						genreEvenement:
							Enumere_EvenementListe_1.EGenreEvenementListe.Suppression,
					});
				}
			},
			{ icon: "icon_trash" },
		);
		aParams.menuContextuel.setDonnees();
	}
	getTitreZonePrincipale(aParams) {
		let H = [];
		H.push(
			`<div ie-ellipsis class="ie-titre" >${aParams.article.getLibelle()}</div>`,
		);
		return H.join("");
	}
	estLigneOff(aParams) {
		if (!aParams.article.Editable) {
			return true;
		}
	}
	avecBoutonActionLigne(aParams) {
		if (aParams.article.Editable) {
			return true;
		}
	}
}
exports.DonneesListe_ModeleTravailAFaire_Fd =
	DonneesListe_ModeleTravailAFaire_Fd;
