exports.DonneesListe_MemosEleves = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_Etat_1 = require("Enumere_Etat");
const AccessApp_1 = require("AccessApp");
class DonneesListe_MemosEleves extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParametres) {
		super(aDonnees);
		this.forcerConsultation = false;
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.estValorisation = aParametres.estValorisation;
		if (aParametres.forcerConsultation !== undefined) {
			this.forcerConsultation = aParametres.forcerConsultation;
		}
		const lSaisie = this.estValorisation
			? this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
				)
			: this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.dossierVS.saisirMemos,
				);
		this.setOptions({
			avecEvnt_Creation: true,
			avecEvnt_Selection: true,
			avecCB: false,
			flatDesignMinimal: true,
			avecBoutonActionLigne: this.forcerConsultation || lSaisie,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article && aParams.article.auteur
			? aParams.article.auteur.getLibelle()
			: "";
	}
	getZoneComplementaire(aParams) {
		if (this.estValorisation) {
			return aParams.article && aParams.article.dateFinMiseEnEvidence
				? ObjetDate_1.GDate.formatDate(
						aParams.article.dateFinMiseEnEvidence,
						"%JJ/%MM/%AAAA",
					)
				: "";
		} else {
			return aParams.article && aParams.article.date
				? ObjetDate_1.GDate.formatDate(aParams.article.date, "%JJ/%MM/%AAAA")
				: "";
		}
	}
	getZoneMessage(aParams) {
		return aParams.article && aParams.article
			? aParams.article.getLibelle()
			: "";
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init(
				"date",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
	}
	initialisationObjetContextuel(aParametres) {
		const lSaisie =
			!this.forcerConsultation &&
			(this.estValorisation
				? this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
					)
				: this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.dossierVS.saisirMemos,
					));
		if (!aParametres.menuContextuel) {
			return;
		}
		if (
			(this.forcerConsultation || !aParametres.article.editable) &&
			this.estValorisation
		) {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Consulter"),
				true,
				function () {
					this.callback.appel({
						article: aParametres.article,
						genreEvenement:
							Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
					});
				},
				{ icon: "icon_eye_open" },
			);
		}
		if (lSaisie) {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Modifier"),
				aParametres.article.editable,
				function () {
					this.callback.appel({
						article: aParametres.article,
						genreEvenement:
							Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
					});
				},
				{ icon: "icon_pencil" },
			);
			const lLibelleConfirmationSuppression = this.estValorisation
				? ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgSuppressionValorisation",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgSuppressionMemo",
					);
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				aParametres.article.editable,
				function () {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: lLibelleConfirmationSuppression,
						callback: (aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								aParametres.article.setEtat(
									Enumere_Etat_1.EGenreEtat.Suppression,
								);
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
		}
		aParametres.menuContextuel.setDonnees();
	}
}
exports.DonneesListe_MemosEleves = DonneesListe_MemosEleves;
