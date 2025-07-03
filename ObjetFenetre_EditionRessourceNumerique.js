exports.ObjetFenetre_EditionRessourceNumerique = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
class ObjetFenetre_EditionRessourceNumerique extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		const lOptionsFenetre = {
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_EditionRessourceNumerique.titre",
			),
			largeur: 460,
			hauteurMin: 280,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					action: ObjetFenetre_EditionRessourceNumerique.genreAction.annuler,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					valider: true,
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					action: ObjetFenetre_EditionRessourceNumerique.genreAction.valider,
				},
			],
		};
		this.boutonOuvrir = {
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_EditionRessourceNumerique.ouvrir",
			),
			theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
			action: ObjetFenetre_EditionRessourceNumerique.genreAction.ouvrir,
		};
		this.boutonSupprimer = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
			action: ObjetFenetre_EditionRessourceNumerique.genreAction.supprimer,
		};
		this.setOptionsFenetre(lOptionsFenetre);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (
						aBoutonRepeat.element.action ===
						ObjetFenetre_EditionRessourceNumerique.genreAction.valider
					) {
						return (
							!aInstance.ressourceNumerique ||
							aInstance.ressourceNumerique.getEtat() ===
								Enumere_Etat_1.EGenreEtat.Aucun
						);
					}
					return false;
				},
			},
			btnSupprimer: {
				event: function () {
					GApplication.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_EditionRessourceNumerique.suppression",
							),
						})
						.then(function (aAccepte) {
							if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
								aInstance.surValidation(
									ObjetFenetre_EditionRessourceNumerique.genreAction.supprimer,
								);
							}
						});
				},
			},
			btnOuvrir: {
				event: function () {
					if (!!aInstance.ressourceNumerique) {
						window.open(
							ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
								aInstance.ressourceNumerique,
							),
						);
					}
				},
			},
			titre: {
				getValue: function () {
					return aInstance && aInstance.ressourceNumerique
						? aInstance.ressourceNumerique.getLibelle()
						: "";
				},
				setValue: function (aValue) {
					if (
						aInstance &&
						aInstance.ressourceNumerique &&
						aInstance.ressourceNumerique.getLibelle() !== aValue
					) {
						aInstance.ressourceNumerique.setLibelle(aValue);
						aInstance.ressourceNumerique.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
				getDisabled: function () {
					return !aInstance || !aInstance.ressourceNumerique;
				},
			},
			commentaire: {
				getValue: function () {
					return aInstance && aInstance.ressourceNumerique
						? aInstance.ressourceNumerique.commentaire
						: "";
				},
				setValue: function (aValue) {
					if (
						aInstance &&
						aInstance.ressourceNumerique &&
						aInstance.ressourceNumerique.commentaire !== aValue
					) {
						aInstance.ressourceNumerique.commentaire = aValue;
						aInstance.ressourceNumerique.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
				getDisabled: function () {
					return !aInstance || !aInstance.ressourceNumerique;
				},
			},
		});
	}
	setDonnees(aRessource) {
		this.ressourceNumerique = aRessource;
		this.actualiser();
		this.afficher();
	}
	composeBas() {
		const H = [];
		H.push(
			'<span class="OFERN_Obligatoire">* ',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_EditionRessourceNumerique.champObligatoire",
			),
			"</span>",
		);
		if (this.boutonSupprimer) {
			const lBouton = this.boutonSupprimer;
			H.push(
				'<ie-bouton class="' + lBouton.theme + '"',
				' ie-model="btnSupprimer">',
				lBouton.libelle,
				"</ie-bouton>",
			);
		}
		return H.join("");
	}
	composeContenu() {
		const T = [];
		T.push('<div class="OFERN_Main">');
		T.push(
			'<div class="OFERN_LigneTitre"><span>',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_EditionRessourceNumerique.label",
			),
			' : *</span><ie-bouton class="' + this.boutonOuvrir.theme + '"',
			' ie-model="btnOuvrir">',
			this.boutonOuvrir.libelle,
			"</ie-bouton></div>",
		);
		T.push('<div class="OFERN_Titre"><input ie-model="titre" /></div>');
		T.push(
			'<div class="OFERN_LigneCommentaire">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_EditionRessourceNumerique.commentaire",
			),
			" :</div>",
		);
		T.push(
			'<div class="OFERN_Commentaire"><textarea ie-model="commentaire"></textarea></div>',
		);
		T.push("</div>");
		return T.join("");
	}
	surValidation(aNumeroBouton) {
		const lResult = {
			genreBouton: aNumeroBouton,
			ressource: this.ressourceNumerique,
		};
		this.callback.appel(lResult);
		this.fermer();
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionRessourceNumerique,
			{ pere: aParams.instance, evenement: aParams.callback },
		);
		lFenetre.setDonnees(aParams.ressource);
	}
}
exports.ObjetFenetre_EditionRessourceNumerique =
	ObjetFenetre_EditionRessourceNumerique;
(function (ObjetFenetre_EditionRessourceNumerique) {
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["annuler"] = 0)] = "annuler";
		genreAction[(genreAction["valider"] = 1)] = "valider";
		genreAction[(genreAction["supprimer"] = 2)] = "supprimer";
		genreAction[(genreAction["ouvrir"] = 3)] = "ouvrir";
	})(
		(genreAction =
			ObjetFenetre_EditionRessourceNumerique.genreAction ||
			(ObjetFenetre_EditionRessourceNumerique.genreAction = {})),
	);
})(
	ObjetFenetre_EditionRessourceNumerique ||
		(exports.ObjetFenetre_EditionRessourceNumerique =
			ObjetFenetre_EditionRessourceNumerique =
				{}),
);
