exports.DonneesListe_Diffusion = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_MenuCtxModeMixte_1 = require("Enumere_MenuCtxModeMixte");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const AccessApp_1 = require("AccessApp");
class DonneesListe_Diffusion extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aParams) {
		super(aParams.donnees);
		this.callbackMenuContextuel = aParams.evenementMenuContextuel;
		this.uniquementMesListes = aParams.uniquementMesListes || false;
		this.setOptions({ avecEvnt_Selection: true });
	}
	setUniquementMesListes(aUniquementMesListes) {
		this.uniquementMesListes = aUniquementMesListes;
	}
	getVisible(aArticle) {
		return !this.uniquementMesListes || aArticle.estAuteur;
	}
	avecEvenementApresErreurCreation() {
		return true;
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle() || "";
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		if (aParams.article && aParams.article.libelleAuteur) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "diff_auteur" },
					aParams.article.libelleAuteur,
				),
			);
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		const lContenu = [];
		if (aParams.article.estPublique) {
			const lTexte = ObjetTraduction_1.GTraductions.getValeur(
				"listeDiffusion.hintpartage",
			);
			lContenu.push(
				IE.jsx.str("i", {
					class: "icon_sondage_bibliotheque",
					"ie-tooltiplabel": lTexte,
					role: "img",
				}),
			);
		}
		return IE.jsx.str(
			"div",
			{ class: "icones-conteneur tiny" },
			lContenu.join(""),
		);
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		const lApp = (0, AccessApp_1.getApp)();
		if (aParametres.article && aParametres.article.estAuteur) {
			if (
				lApp.droits.get(
					ObjetDroitsPN_1.TypeDroits.listeDiffusion.avecPublication,
				)
			) {
				const lTitre = aParametres.article.estPublique
					? ObjetTraduction_1.GTraductions.getValeur(
							"listeDiffusion.nepaspartager",
						)
					: ObjetTraduction_1.GTraductions.getValeur("listeDiffusion.partager");
				const lAction = aParametres.article.estPublique
					? DonneesListe_Diffusion.genreAction.departager
					: DonneesListe_Diffusion.genreAction.partager;
				const lIcon = aParametres.article.estPublique
					? "icon_retirer_bibliotheque"
					: "icon_sondage_bibliotheque";
				aParametres.menuContextuel.add(
					lTitre,
					true,
					(aItemMenu) => {
						if (aItemMenu && aItemMenu.data) {
							aItemMenu.data.estPublique = !aItemMenu.data.estPublique;
							aItemMenu.data.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							this.callbackMenuContextuel(aItemMenu);
						}
					},
					{
						icon: lIcon + " i-small",
						Numero: lAction,
						typeAffEnModeMixte:
							Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
						data: aParametres.article,
					},
				);
			}
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("listeDiffusion.renommer"),
				true,
				(aItemMenu) => {
					this.callbackMenuContextuel(aItemMenu);
				},
				{
					icon: "icon_pencil i-small",
					Numero: DonneesListe_Diffusion.genreAction.renommer,
					typeAffEnModeMixte:
						Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
					data: aParametres.article,
				},
			);
		}
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
			aParametres.article.estAuteur,
			(aItemMenu) => {
				if (aItemMenu && aItemMenu.data) {
					const lMsgConfirmSuppression =
						ObjetTraduction_1.GTraductions.getValeur(
							"liste.suppressionSelection",
						);
					lApp.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: lMsgConfirmSuppression,
						callback: (aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								aItemMenu.data.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								this.callbackMenuContextuel(aItemMenu);
							}
						},
					});
				}
			},
			{
				icon: "icon_trash",
				Numero: Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				typeAffEnModeMixte: Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
				data: aParametres.article,
			},
		);
		aParametres.menuContextuel.addSeparateur();
		if (!IE.estMobile) {
			if (
				lApp.droits.get(
					ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
				)
			) {
				aParametres.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur("actualites.creerInfo"),
					true,
					(aArticle) => {
						if (aArticle) {
							this.callbackMenuContextuel(aArticle);
						}
					},
					{
						icon: "icon_diffuser_information i-small",
						Numero: DonneesListe_Diffusion.genreAction.diffuserInformation,
						typeAffEnModeMixte:
							Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
						data: aParametres.article,
						ariaHasPopup: "dialog",
					},
				);
			}
			if (
				lApp.droits.get(ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion)
			) {
				aParametres.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.discussion.demarrer",
					),
					true,
					(aArticle) => {
						if (aArticle) {
							this.callbackMenuContextuel(aArticle);
						}
					},
					{
						icon: "icon_nouvelle_discussion i-small",
						Numero: DonneesListe_Diffusion.genreAction.demarrerDiscussion,
						typeAffEnModeMixte:
							Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
						data: aParametres.article,
						ariaHasPopup: "dialog",
					},
				);
			}
			if (
				lApp.droits.get(
					ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
				)
			) {
				aParametres.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur("actualites.creerSondage"),
					true,
					(aArticle) => {
						if (aArticle) {
							this.callbackMenuContextuel(aArticle);
						}
					},
					{
						icon: "icon_diffuser_sondage i-small",
						Numero: DonneesListe_Diffusion.genreAction.effectuerSondage,
						typeAffEnModeMixte:
							Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
						data: aParametres.article,
						ariaHasPopup: "dialog",
					},
				);
			}
		}
	}
	evenementMenuContextuel(aParametres) {
		this.callbackMenuContextuel(aParametres.ligneMenu);
	}
}
exports.DonneesListe_Diffusion = DonneesListe_Diffusion;
(function (DonneesListe_Diffusion) {
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["diffuserInformation"] = 1)] =
			"diffuserInformation";
		genreAction[(genreAction["demarrerDiscussion"] = 2)] = "demarrerDiscussion";
		genreAction[(genreAction["effectuerSondage"] = 3)] = "effectuerSondage";
		genreAction[(genreAction["partager"] = 4)] = "partager";
		genreAction[(genreAction["departager"] = 5)] = "departager";
		genreAction[(genreAction["renommer"] = 6)] = "renommer";
		genreAction[(genreAction["ajouterpublic"] = 7)] = "ajouterpublic";
	})(
		(genreAction =
			DonneesListe_Diffusion.genreAction ||
			(DonneesListe_Diffusion.genreAction = {})),
	);
})(
	DonneesListe_Diffusion ||
		(exports.DonneesListe_Diffusion = DonneesListe_Diffusion = {}),
);
