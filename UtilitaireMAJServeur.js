exports.UtilitaireMAJServeur = void 0;
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetWAI_1 = require("ObjetWAI");
const ObjetWAI_2 = require("ObjetWAI");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const GestionnaireModale_1 = require("GestionnaireModale");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireDeconnexion_1 = require("UtilitaireDeconnexion");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const LottiePatience_1 = require("LottiePatience");
exports.UtilitaireMAJServeur = {
	initialiser(aOptions) {
		const lUtil = {
			fenetre: null,
			idMessage: "idMessageMAJ",
			options: {
				afficherMessageDelaiLong: true,
				afficherMessageImminentEleve: false,
				messageTitreFenetre: ObjetTraduction_1.GTraductions.getValeur(
					"MAJServeur.MAJ_Titre",
				),
				messageFenetreMAJPrevue: ObjetTraduction_1.GTraductions.getValeur(
					"MAJServeur.MAJ_Prevue_S",
				),
				messageFenetreMAJImminentEleve:
					ObjetTraduction_1.GTraductions.getValeur(
						"MAJServeur.MAJ_Imminente_Eleve_S",
					),
				messageFenetreMAJImminent: ObjetTraduction_1.GTraductions.getValeur(
					"MAJServeur.MAJ_Imminente_S",
				),
				messageAnnule: ObjetTraduction_1.GTraductions.getValeur(
					"MAJServeur.MAJ_Annulee",
				),
				messageAttenteMAJ: ObjetTraduction_1.GTraductions.getValeur(
					"MAJServeur.MAJ_Attente",
				),
				messageMAJEffectue: ObjetTraduction_1.GTraductions.getValeur(
					"MAJServeur.MAJ_Effectue",
				),
				cssImage: "",
			},
		};
		Object.assign(lUtil.options, aOptions);
		Invocateur_1.Invocateur.abonner(
			ObjetRequeteJSON_1.utils.getIdentNotification("dureeMAJServeur"),
			(aDuree) => {
				_notificationMAJ(lUtil, aDuree);
			},
		);
		Invocateur_1.Invocateur.abonner(
			ObjetRequeteJSON_1.utils.getIdentNotification("MAJAnnulation"),
			() => {
				clearTimeout(lUtil.timeoutDetectionMAJImminente);
				clearTimeout(lUtil.timeoutRechargment);
				if (GApplication.SESSION_FINI) {
					return;
				}
				GApplication.getCommunication().setMAJServeurEnCours(false);
				_ouvrirFenetreSplash({
					util: lUtil,
					init: function (aFenetre) {
						aFenetre.estAnnulation = true;
					},
				});
			},
		);
	},
};
const lDelaiRepeatRequeteFinMAJ = 10 * 1000;
const lDureeAttenteMAJPourRequete = 10 * 60 * 1000;
const lDelaiMAJAvertissement = 4 * 60 * 1000;
const lDelaiDeconnexion = 1 * 60 * 1000;
const lDelaiPresencePreparationAvertissement =
	lDelaiMAJAvertissement + lDelaiDeconnexion;
function _ouvrirFenetreSplash(aParams) {
	if (aParams.util.fenetre) {
		aParams.util.fenetre.fermer();
	}
	aParams.util.fenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_SplashMAJServeur,
		{
			pere: {},
			initialiser: function (aFenetre) {
				aParams.init(aFenetre);
				aFenetre.setOptionsFenetre(
					Object.assign(
						{
							titre: aParams.util.options.messageTitreFenetre,
							callbackFermer: function () {
								delete aParams.util.fenetre;
								if (aParams.fermer) {
									aParams.fermer(aFenetre);
								}
							},
						},
						aParams.util.options,
					),
				);
			},
		},
	);
	aParams.util.fenetre.afficher();
}
function _notificationMAJ(aUtil, aDuree) {
	if (!MethodesObjet_1.MethodesObjet.isNumber(aDuree)) {
		return;
	}
	if (aUtil.timeoutDetectionMAJImminente) {
		clearTimeout(aUtil.timeoutDetectionMAJImminente);
	}
	let lTimeoutRechargementEcoule = false;
	let lDureeMs = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(aDuree);
	const lDateMAJReelle = new Date(Date.now() + lDureeMs + lDelaiDeconnexion);
	if (lDateMAJReelle.getSeconds() === 59) {
		lDateMAJReelle.setSeconds(lDateMAJReelle.getSeconds() + 1);
	}
	const lEstDelaiLong = lDureeMs > lDelaiMAJAvertissement;
	if (!lEstDelaiLong) {
		lDureeMs =
			Math.floor(UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(aDuree, true)) *
			60 *
			1000;
	}
	if (aUtil.timeoutRechargment) {
		clearTimeout(aUtil.timeoutRechargment);
	}
	aUtil.timeoutRechargment = setTimeout(() => {
		lTimeoutRechargementEcoule = true;
		_deconnexion(aUtil);
	}, lDureeMs);
	if (lDureeMs < 1000) {
		return;
	}
	if (lEstDelaiLong) {
		aUtil.timeoutDetectionMAJImminente = setTimeout(
			() => {
				GApplication.getCommunication().setMAJServeurEnCours(true);
			},
			Math.max(0, lDureeMs - lDelaiPresencePreparationAvertissement),
		);
	}
	if (!lEstDelaiLong || aUtil.options.afficherMessageDelaiLong) {
		aUtil.deconnexionAvecFenetreOuverte = true;
		_ouvrirFenetreSplash({
			util: aUtil,
			init: function (aFenetre) {
				aFenetre.estDelaiLong = lEstDelaiLong;
				aFenetre.dateReelle = lDateMAJReelle;
				aFenetre.dureeMs = lDureeMs;
			},
			fermer: function () {
				if (!lTimeoutRechargementEcoule) {
					aUtil.deconnexionAvecFenetreOuverte = false;
				}
			},
		});
	}
}
function _deconnexion(aUtil) {
	const lCallback = function () {
		UtilitaireDeconnexion_1.UtilitaireDeconnexion.requeteDeconnexion().then(
			() => {
				GApplication.finSession({
					constructionPage: true,
					statut: 0,
					sansBoutonSeConnecter: true,
					jsonErreur: {
						Titre: ObjetTraduction_1.GTraductions.getValeur(
							"connexion.MessageVeuillezPatienter",
						),
						Message: !GApplication.estAppliMobile
							? IE.jsx.str(
									"div",
									{ id: aUtil.idMessage },
									aUtil.options.messageAttenteMAJ,
									IE.jsx.str(
										"div",
										{ class: "UtilitaireMAJPatience" },
										LottiePatience_1.LottiePatience.construire(),
									),
								)
							: aUtil.options.messageAttenteMAJ,
					},
				});
				if (!GApplication.estAppliMobile) {
					aUtil.dateMSDemarrageAttente = Date.now();
					setTimeout(() => {
						_gererRechargementPage(aUtil);
					}, lDelaiRepeatRequeteFinMAJ);
				}
			},
		);
	};
	(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(lCallback);
}
function _messageFinMAJ(aUtil) {
	$(document).find(".pageDeconnexion_titre").remove();
	ObjetHtml_1.GHtml.setHtml(
		aUtil.idMessage,
		[
			'<div style="padding-bottom:3px; padding-top: 10px;">',
			aUtil.options.messageMAJEffectue,
			"</div>",
			'<div tabindex="0" ',
			ObjetWAI_2.GObjetWAI
				? ObjetWAI_2.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Button)
				: "",
			ObjetWAI_2.GObjetWAI
				? ObjetWAI_2.GObjetWAI.composeAttribut({
						genre: ObjetWAI_2.EGenreAttribut.describedby,
						valeur: "waispan_id",
					})
				: "",
			'class="AvecMain Souligne"',
			'onkeyup="if (GNavigateur.isToucheSelection()) window.location.reload()" onclick="window.location.reload ()">',
			ObjetTraduction_1.GTraductions.getValeur("connexion.SeConnecter"),
			"</div>",
		].join(""),
	);
}
function _gererRechargementPage(aUtil) {
	const lEnvoyerRequeteDelai = function () {
		setTimeout(() => {
			if (
				Date.now() - aUtil.dateMSDemarrageAttente <
				lDureeAttenteMAJPourRequete
			) {
				_gererRechargementPage(aUtil);
			} else {
				_messageFinMAJ(aUtil);
			}
		}, lDelaiRepeatRequeteFinMAJ);
	};
	fetch("MAJServeurFin.html")
		.then((aReponse) => {
			if (aReponse.ok) {
				if (!aUtil.deconnexionAvecFenetreOuverte) {
					window.location.reload();
				} else {
					_messageFinMAJ(aUtil);
				}
			} else {
				return Promise.reject();
			}
		})
		.catch(() => {
			lEnvoyerRequeteDelai();
		});
}
class ObjetFenetre_SplashMAJServeur extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			modale: true,
			largeur: 500,
			hauteurBandeau: 25,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			avecAbonnementFermetureFenetreGenerale: false,
			couleurFondBandeau: "#ed9e2b",
			prioriteBlocageAbonnement:
				GestionnaireModale_1.GestionnaireModale.TypePrioriteBlocageInterface
					.messageInformatif,
		});
	}
	composeContenu() {
		const T = [];
		let lMessage = "";
		if (this.estAnnulation) {
			lMessage = this.optionsFenetre.messageAnnule;
		} else if (this.estDelaiLong) {
			lMessage = ObjetChaine_1.GChaine.format(
				this.optionsFenetre.messageFenetreMAJPrevue,
				[ObjetDate_1.GDate.formatDate(this.dateReelle, "%hh%sh%mm")],
			);
		} else {
			lMessage = ObjetChaine_1.GChaine.format(
				this.optionsFenetre.afficherMessageImminentEleve
					? this.optionsFenetre.messageFenetreMAJImminentEleve
					: this.optionsFenetre.messageFenetreMAJImminent,
				[ObjetDate_1.GDate.formatDureeEnMillisecondes(this.dureeMs, "%xm")],
			);
		}
		T.push(
			'<div class="ofsm_image_MAJ ',
			this.optionsFenetre.cssImage,
			'" role="presentation"></div>',
			'<p class="ofsm_texte">',
			lMessage,
			"</p>",
		);
		return T.join("");
	}
}
