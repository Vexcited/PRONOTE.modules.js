exports.DonneesListe_CategorieEvaluation = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const AccessApp_1 = require("AccessApp");
class DonneesListe_CategorieEvaluation extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aParams) {
		super(aParams.listeCategories);
		this.appSco = (0, AccessApp_1.getApp)();
		this.avecFiltre = aParams.filtreMesCategories;
		this.tailleMax = aParams.tailleMax;
		this.estEditable = aParams.estEditable;
		this.setOptions({
			avecEvnt_Creation: true,
			avecEvnt_Selection: true,
			avecEvnt_SelectionClick: true,
			flatDesignMinimal: true,
			avecCB: aParams.avecCB,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getInfosSuppZonePrincipale(aParams) {
		return aParams.article.proprietaire ? aParams.article.proprietaire : "";
	}
	getZoneGauche(aParams) {
		return aParams.article.couleur
			? '<div style="' +
					ObjetStyle_1.GStyle.composeCouleurFond(aParams.article.couleur) +
					'height:2rem;padding:0.2rem;border-radius:0.4rem;"></div>'
			: '<div style="margin-right:0.4rem"></div>';
	}
	getValueCB(aParams) {
		return aParams.article ? aParams.article.coche : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.coche = aValue;
	}
	avecMenuContextuel(aParams) {
		return (
			this.estEditable &&
			!!aParams.article &&
			aParams.article.estEditable &&
			!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		);
	}
	avecBoutonActionLigne(aParams) {
		return (
			this.estEditable &&
			!!aParams.article &&
			aParams.article.estEditable &&
			!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (this.estEditable) {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Modifier"),
				true,
				() => {
					this.paramsListe.liste.callback.appel({
						article: aParametres.article,
						genreEvenement:
							Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
					});
				},
				{ icon: "icon_pencil" },
			);
			if (this.options.avecCB) {
				aParametres.menuContextuel.add(
					!aParametres.article.coche
						? ObjetTraduction_1.GTraductions.getValeur(
								"FenetreCategorieEvaluation.selectionner",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreCategorieEvaluation.deselectionner",
							),
					true,
					() => {
						aParametres.article.coche = !aParametres.article.coche;
						this.paramsListe.liste.actualiser();
					},
					{
						icon: !aParametres.article.coche
							? "icon_ok"
							: "icon_fermeture_widget",
					},
				);
			}
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				true,
				() => {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreCategorieEvaluation.confSupprCategorie",
						),
						callback: (aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								this.paramsListe.liste.callback.appel({
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
		}
		aParametres.menuContextuel.setDonnees();
	}
	getVisible(aArticle) {
		const lVisible = this.avecFiltre ? aArticle.filtreMesCategories : true;
		return (
			aArticle.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression && lVisible
		);
	}
}
exports.DonneesListe_CategorieEvaluation = DonneesListe_CategorieEvaluation;
