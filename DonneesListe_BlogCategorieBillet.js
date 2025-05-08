exports.DonneesListe_BlogCategorieBillet = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
class DonneesListe_BlogCategorieBillet extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aAvecEdition = false) {
		super(aDonnees);
		this.applicationSco = GApplication;
		this._avecEditionCategorie = aAvecEdition;
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_SelectionDblClick: true,
			avecEvnt_Suppression: aAvecEdition,
			flatDesignMinimal: true,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getZoneGauche(aParams) {
		return aParams.article.couleur
			? '<div style="' +
					ObjetStyle_1.GStyle.composeCouleurFond(aParams.article.couleur) +
					'height:2rem;padding:0.2rem;border-radius:0.4rem;"></div>'
			: '<div style="margin-right:0.4rem"></div>';
	}
	avecMenuContextuel(aParams) {
		return this.avecEditionCategorie(aParams);
	}
	avecBoutonActionLigne(aParams) {
		return this.avecEditionCategorie(aParams);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			true,
			function () {
				this.callback.appel({
					article: aParametres.article,
					genreEvenement: Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
				});
			},
			{ icon: "icon_pencil" },
		);
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			true,
			function () {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"blog.msgConfirmSupprCategorieBillet",
					),
					callback: (aGenreAction) => {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							this.callback.appel({
								article: aParametres.article,
								genreEvenement:
									Enumere_EvenementListe_1.EGenreEvenementListe.Suppression,
							});
						}
					},
				});
			},
			{ icon: "icon_trash" },
		);
		aParametres.menuContextuel.setDonnees();
	}
	avecEditionCategorie(aParams) {
		return (
			this._avecEditionCategorie &&
			!!aParams.article &&
			aParams.article.estEditable &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		);
	}
}
exports.DonneesListe_BlogCategorieBillet = DonneesListe_BlogCategorieBillet;
