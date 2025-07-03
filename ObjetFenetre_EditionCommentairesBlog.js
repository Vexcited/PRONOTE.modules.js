exports.ObjetFenetre_EditionCommentairesBlog = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TypeEtatCommentaireBillet_1 = require("TypeEtatCommentaireBillet");
class ObjetFenetre_EditionCommentairesBlog extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.moteur = new ObjetMoteurBlog_1.ObjetMoteurBlog();
		this.tailleMaxCommentaires = 1000;
		this.donneesSaisie = { commentaire: "" };
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodePhoto: function () {
				$(this.node).on("error", function () {
					$(this).parent().find(".ibe_util_photo_i").show();
					$(this).remove();
				});
			},
			saisieNouveauCommentaireBlog: {
				getValue() {
					return aInstance.donneesSaisie.commentaire || "";
				},
				setValue(aValue) {
					aInstance.donneesSaisie.commentaire = aValue;
				},
				getDisabled() {
					return aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
			},
			btnEnvoyerCommentaire: {
				event() {
					const lNouveauCommentaireBlog =
						aInstance.moteur.creerCommentaireParDefaut();
					lNouveauCommentaireBlog.setLibelle(
						aInstance.donneesSaisie.commentaire,
					);
					lNouveauCommentaireBlog.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					aInstance.billetBlog.listeCommentaires.add(lNouveauCommentaireBlog);
					aInstance.effectuerCallbackFenetre(aInstance.billetBlog);
				},
				getDisabled() {
					let lBtnEnvoiCommentaireActif = false;
					if (
						!aInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estEnConsultation,
						) &&
						!!aInstance.billetBlog
					) {
						lBtnEnvoiCommentaireActif = !!aInstance.donneesSaisie.commentaire;
					}
					return !lBtnEnvoiCommentaireActif;
				},
			},
			btnSupprCommentaire: {
				event(aNumeroCommentaire) {
					let lCommentaire = null;
					if (aInstance.billetBlog && aInstance.billetBlog.listeCommentaires) {
						lCommentaire =
							aInstance.billetBlog.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
					}
					if (lCommentaire && lCommentaire.estSupprimable) {
						aInstance.moteur.afficherMessageConfirmationSuppressionCommentaire(
							lCommentaire,
							() => {
								aInstance.billetBlog.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								aInstance.effectuerCallbackFenetre(aInstance.billetBlog);
							},
						);
					}
				},
				getDisabled() {
					return aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
			},
			btnAcceptCommentaire: {
				event(aNumeroCommentaire) {
					let lCommentaire = null;
					if (aInstance.billetBlog && aInstance.billetBlog.listeCommentaires) {
						lCommentaire =
							aInstance.billetBlog.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
					}
					if (lCommentaire) {
						aInstance.moteur.accepterCommentaire(lCommentaire, () => {
							aInstance.etatUtilisateurSco.setContexteBilletBlog(
								aInstance.billetBlog,
								true,
							);
							aInstance.billetBlog.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
							aInstance.effectuerCallbackFenetre(aInstance.billetBlog, true);
						});
					}
				},
				getDisabled(aNumeroCommentaire) {
					let lEstDisabled = true;
					if (aInstance.billetBlog && aInstance.billetBlog.listeCommentaires) {
						const lCommentaire =
							aInstance.billetBlog.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
						if (lCommentaire) {
							lEstDisabled =
								lCommentaire.etatCommentaire ===
									TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet
										.ECB_Publie ||
								aInstance.applicationSco.droits.get(
									ObjetDroitsPN_1.TypeDroits.estEnConsultation,
								);
						}
					}
					return lEstDisabled;
				},
			},
			btnRejetCommentaire: {
				event(aNumeroCommentaire) {
					let lCommentaire = null;
					if (aInstance.billetBlog && aInstance.billetBlog.listeCommentaires) {
						lCommentaire =
							aInstance.billetBlog.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
					}
					if (lCommentaire) {
						aInstance.moteur.refuserCommentaire(lCommentaire, () => {
							aInstance.etatUtilisateurSco.setContexteBilletBlog(
								aInstance.billetBlog,
								true,
							);
							aInstance.billetBlog.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
							aInstance.effectuerCallbackFenetre(aInstance.billetBlog, true);
						});
					}
				},
				getDisabled(aNumeroCommentaire) {
					let lEstDisabled = true;
					if (aInstance.billetBlog && aInstance.billetBlog.listeCommentaires) {
						const lCommentaire =
							aInstance.billetBlog.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
						if (lCommentaire) {
							lEstDisabled =
								lCommentaire.etatCommentaire ===
									TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet
										.ECB_Refuse ||
								aInstance.applicationSco.droits.get(
									ObjetDroitsPN_1.TypeDroits.estEnConsultation,
								);
						}
					}
					return lEstDisabled;
				},
			},
			avecSaisieCommentairePossible() {
				return aInstance.moteur.avecSaisieCommentairePossibleALaDateCourante(
					aInstance.billetBlog,
				);
			},
			avecMessageFinDeSaisieCommentaire() {
				return !aInstance.moteur.avecSaisieCommentairePossibleALaDateCourante(
					aInstance.billetBlog,
				);
			},
			getMsgFinDeSaisie() {
				return ObjetTraduction_1.GTraductions.getValeur(
					"blog.SaisieCommentaireEnFinDeSaisie",
				);
			},
		});
	}
	setParametres(aParams) {
		super.setParametres(aParams);
		if (aParams.tailleMaxCommentaires) {
			this.tailleMaxCommentaires = aParams.tailleMaxCommentaires;
		}
	}
	setDonnees(aBilletBlog) {
		if (aBilletBlog) {
			this.billetBlog = aBilletBlog;
			const lContenuHtml = this.moteur.existeCommentairesSurBillet(aBilletBlog)
				? this.moteur.composeCardsCommentairesBillet(aBilletBlog)
				: this.composeMsgAucun();
			this.afficher(lContenuHtml);
			$(".editComment-conteneur textarea").trigger("focus");
		}
	}
	effectuerCallbackFenetre(aBillet, aReouvertureFenetreApresSaisie = false) {
		this.callback.appel(1, {
			billet: aBillet,
			avecReouvertureFenetreApresSaisie: aReouvertureFenetreApresSaisie,
		});
		this.fermer();
	}
	composeMsgAucun() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "zone-msg-aucun" },
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur("blog.aucunCommentaire"),
					),
				),
			),
		);
		return H.join("");
	}
	composeBas() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("div", {
				"ie-if": "avecMessageFinDeSaisieCommentaire",
				"ie-html": "getMsgFinDeSaisie",
			}),
			IE.jsx.str(
				"div",
				{
					"ie-if": "avecSaisieCommentairePossible",
					class: "editComment-conteneur",
				},
				IE.jsx.str("ie-textareamax", {
					class: "editComment-input",
					"ie-model": "saisieNouveauCommentaireBlog",
					placeholder: ObjetTraduction_1.GTraductions.getValeur(
						"blog.placeholderCommentaire",
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"blog.placeholderCommentaire",
					),
					maxlength: this.tailleMaxCommentaires,
				}),
				IE.jsx.str("ie-btnicon", {
					class: "icon_envoyer editComment-btnEnvoi",
					"ie-model": "btnEnvoyerCommentaire",
					title: ObjetTraduction_1.GTraductions.getValeur("blog.envoyer"),
				}),
			),
		);
	}
}
exports.ObjetFenetre_EditionCommentairesBlog =
	ObjetFenetre_EditionCommentairesBlog;
